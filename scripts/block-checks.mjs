/**
 * block-checks.mjs
 *
 * Pure, side-effect-free checks over a single ACF block's JSON, shared by
 * validate-blocks.mjs and unit-testable in isolation. Each check returns
 * Array<{severity, code, field?, message, hint?}>.
 */

export function findUnescapedQuote(jsonStr) {
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

export function checkSchemaCompleteness(module, data) {
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

export function checkHtmlEscapeRaw(jsonStr) {
    // Scan the RAW JSON source. Literal `<` / `>` chars in the source are a
    // violation; properly Unicode-escaped HTML appears as `\u003c` etc. in
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

export function checkQuoteHygiene(data) {
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
