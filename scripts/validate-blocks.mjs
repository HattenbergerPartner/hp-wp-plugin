#!/usr/bin/env node
/**
 * validate-blocks.mjs
 *
 * Reads ACF Gutenberg block markup from stdin and validates four classes of
 * failure that have been observed to corrupt blocks server-side:
 *
 *   1. JSON parseability             — unescaped " inside string values
 *   2. Schema completeness           — every field declared in acf-schemas.md
 *      for the block's module is present in `data` (with both `name` and
 *      `_name` mapping)
 *   3. Quote hygiene (warn)          — typographic/ASCII pair mismatches
 *      e.g. „..." (U+201E paired with U+0022)
 *   4. HTML escape hygiene           — raw < or > inside any string value
 *      must be < / > to match Gutenberg's serializer
 *
 * Stdout: single-line JSON
 *   { valid: bool, blocks: number, issues: [{block, module, field?, severity, code, message, hint?}] }
 *
 * Exit codes: 0 clean, 1 issues found.
 */

import { loadSchemas } from './schema-loader.mjs';

const BLOCK_RE = /<!--\s*wp:acf\/([a-z0-9_-]+)\s+(\{[\s\S]*?\})\s*\/-->/g;

function readStdin() {
    return new Promise((resolve) => {
        const chunks = [];
        process.stdin.on('data', c => chunks.push(c));
        process.stdin.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}

function findUnescapedQuote(jsonStr) {
    // Walk character by character tracking string-vs-non-string and whether
    // the previous char was a backslash. Return position of the first ASCII "
    // that closes a string in a structurally-invalid place, if any. The cheap
    // approach: try JSON.parse and use the SyntaxError position when present.
    try {
        JSON.parse(jsonStr);
        return null;
    } catch (err) {
        const m = err.message.match(/position (\d+)/);
        if (m) {
            const pos = Number(m[1]);
            const start = Math.max(0, pos - 30);
            const end = Math.min(jsonStr.length, pos + 30);
            return {
                position: pos,
                snippet: jsonStr.slice(start, end),
                error: err.message,
            };
        }
        return { position: null, snippet: '', error: err.message };
    }
}

function walkStrings(value, fieldName, callback) {
    if (typeof value === 'string') {
        callback(value, fieldName);
    } else if (Array.isArray(value)) {
        for (let i = 0; i < value.length; i++) walkStrings(value[i], `${fieldName}[${i}]`, callback);
    } else if (value && typeof value === 'object') {
        for (const [k, v] of Object.entries(value)) walkStrings(v, fieldName ? `${fieldName}.${k}` : k, callback);
    }
}

function checkSchemaCompleteness(module, data) {
    const issues = [];
    if (!module) return issues;
    for (const field of module.fields) {
        // Repeaters are reported as a count integer (e.g. accordion_repeater: 7)
        // plus the mapping `_repeater_name: "field_xxx"`. Their item subfields
        // appear as `<repeater>_<index>_<sub>` and we don't enforce subfield
        // completeness here (LLM is reliable on that — main bug is top-level).
        const valuePresent = field.name in data;
        const mappingPresent = `_${field.name}` in data;
        if (!valuePresent) {
            issues.push({
                severity: 'error',
                code: 'missing_field',
                field: field.name,
                message: `missing schema field "${field.name}" (${field.type})`,
                hint: `add "${field.name}" with key "${field.key}"${field.choices ? ` — choices: ${field.choices.join(' | ')}` : ''}${field.default ? ` — default: ${field.default}` : ''}`,
            });
            continue;
        }
        if (!mappingPresent) {
            issues.push({
                severity: 'error',
                code: 'missing_mapping',
                field: field.name,
                message: `missing field-key mapping "_${field.name}"`,
                hint: `add "_${field.name}":"${field.key}"`,
            });
        }
    }
    return issues;
}

function checkHtmlEscapeRaw(jsonStr) {
    // Scan the RAW JSON source. Literal `<` / `>` chars in the source are a
    // violation; properly Unicode-escaped HTML appears as `<` etc. in
    // the source and is fine. Field names never contain `<`/`>`, so any
    // occurrence is in a value.
    const issues = [];
    const ltIndex = jsonStr.indexOf('<');
    const gtIndex = jsonStr.indexOf('>');
    if (ltIndex === -1 && gtIndex === -1) return issues;

    // Best-effort: identify which key the offending char sits in by walking
    // back to the last `"key":"` pattern before it.
    const findContainingKey = (pos) => {
        const slice = jsonStr.slice(0, pos);
        const m = slice.match(/"([a-z0-9_]+)"\s*:\s*"[^"]*$/i);
        return m ? m[1] : '<unknown field>';
    };

    if (ltIndex !== -1) {
        issues.push({
            severity: 'error',
            code: 'raw_html',
            field: findContainingKey(ltIndex),
            message: `raw < at position ${ltIndex} — must be \\u003c`,
            hint: 'replace every literal < with \\u003c in JSON string values (HTML inside repeater content / wysiwyg fields)',
        });
    }
    if (gtIndex !== -1) {
        issues.push({
            severity: 'error',
            code: 'raw_html',
            field: findContainingKey(gtIndex),
            message: `raw > at position ${gtIndex} — must be \\u003e`,
            hint: 'replace every literal > with \\u003e in JSON string values',
        });
    }
    return issues;
}

function checkQuoteHygiene(data) {
    const issues = [];
    walkStrings(data, '', (str, path) => {
        // German low-9 quote „ (U+201E) followed later by an ASCII " in the
        // same string — likely a mismatched pair the LLM wrote.
        const hasGermanOpen = str.includes('„');
        const hasAsciiClose = str.includes('"');
        if (hasGermanOpen && hasAsciiClose) {
            issues.push({
                severity: 'warn',
                code: 'mixed_quotes',
                field: path,
                message: `field "${path}" mixes German „ with ASCII " — the ASCII " was JSON-escaped this time but pair is typographically wrong`,
                hint: 'use „ (U+201E) opening + " (U+201C) closing for German content',
            });
        }
    });
    return issues;
}

const input = await readStdin();
const schemas = loadSchemas();
const issues = [];
let blockCount = 0;

let match;
const re = new RegExp(BLOCK_RE);
while ((match = re.exec(input)) !== null) {
    blockCount++;
    const blockIndex = blockCount;
    const moduleName = match[1];
    const jsonStr = match[2];
    const module = schemas.get(moduleName);

    const parseFail = findUnescapedQuote(jsonStr);
    if (parseFail) {
        issues.push({
            block: blockIndex,
            module: moduleName,
            severity: 'error',
            code: 'invalid_json',
            message: `JSON.parse failed: ${parseFail.error}`,
            hint: parseFail.position !== null
                ? `near position ${parseFail.position}: …${parseFail.snippet}…`
                : 'JSON could not be parsed at all',
        });
        continue;
    }

    let parsed;
    try {
        parsed = JSON.parse(jsonStr);
    } catch {
        continue;
    }

    if (!module) {
        issues.push({
            block: blockIndex,
            module: moduleName,
            severity: 'warn',
            code: 'unknown_module',
            message: `module "acf/${moduleName}" not found in acf-schemas.md`,
            hint: 'either the schema is stale (run /hp-wp:hp-sync) or the module name is wrong',
        });
        continue;
    }

    const data = parsed.data ?? {};
    for (const issue of checkSchemaCompleteness(module, data)) {
        issues.push({ block: blockIndex, module: moduleName, ...issue });
    }
    for (const issue of checkHtmlEscapeRaw(jsonStr)) {
        issues.push({ block: blockIndex, module: moduleName, ...issue });
    }
    for (const issue of checkQuoteHygiene(data)) {
        issues.push({ block: blockIndex, module: moduleName, ...issue });
    }
}

const errorCount = issues.filter(i => i.severity === 'error').length;
const result = {
    valid: errorCount === 0,
    blocks: blockCount,
    errors: errorCount,
    warnings: issues.length - errorCount,
    issues,
};

console.log(JSON.stringify(result));
process.exit(errorCount === 0 ? 0 : 1);
