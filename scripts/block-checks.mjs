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

const PLACEHOLDER_RE = /\[[A-ZÄÖÜ][A-ZÄÖÜ0-9 _-]{2,}(?::|\])/;

function* stringValues(data, prefix = '') {
    for (const [k, v] of Object.entries(data || {})) {
        if (k.startsWith('_')) continue;
        if (typeof v === 'string') yield [prefix + k, v];
        else if (v && typeof v === 'object' && !Array.isArray(v)) yield* stringValues(v, `${prefix}${k}.`);
    }
}

export function checkPlaceholderMarkers(data) {
    const issues = [];
    for (const [field, value] of stringValues(data)) {
        const m = value.match(PLACEHOLDER_RE);
        if (!m) continue;
        const marker = value.slice(m.index, m.index + 60);
        issues.push({
            severity: 'warn',
            code: 'placeholder_marker',
            field,
            message: `field "${field}" contains an editorial placeholder: ${marker}${value.length > m.index + 60 ? '…' : ''}`,
            hint: 'resolve or remove the bracketed marker before the page goes live',
        });
    }
    return issues;
}

function knownNames(module) {
    const names = new Set(module.fields.map(f => f.name));
    const repeaters = new Set();
    for (const [rName, r] of Object.entries(module.repeaters || {})) {
        repeaters.add(rName);
        for (const s of r.subFields) {
            names.add(s.name);
            if (s.type === 'repeater') repeaters.add(s.name);
        }
    }
    return { names, repeaters };
}

/** Strip `<repeater>_<n>_` prefixes until the remainder is a known field name. */
function isKnownKey(base, known) {
    let rest = base;
    for (let guard = 0; guard < 6; guard++) {
        if (known.names.has(rest)) return true;
        const m = rest.match(/^([a-z0-9_]+?)_(\d+)_(.+)$/);
        if (!m || !known.repeaters.has(m[1])) return false;
        rest = m[3];
    }
    return false;
}

export function checkUnknownFields(module, data) {
    const known = knownNames(module);
    const issues = [];
    for (const key of Object.keys(data || {})) {
        const base = key.startsWith('_') ? key.slice(1) : key;
        if (isKnownKey(base, known)) continue;
        if (key.startsWith('_')) continue; // report the value key once; its mapping is implied
        const mapped = data[`_${key}`];
        issues.push({
            severity: 'warn',
            code: 'unknown_field',
            field: key,
            message: `key "${key}"${mapped ? ` (mapped to ${mapped})` : ''} is not in the live schema for this module — the theme ignores it`,
            hint: 'remove it, or if it is new, the schema cache is stale: re-run Step 0.5 with --refresh-context',
        });
    }
    return issues;
}

export function checkMaxlength(module, data) {
    const issues = [];
    const push = (field, len, max) => issues.push({
        severity: 'warn',
        code: 'maxlength_exceeded',
        field,
        message: `field "${field}" has ${len} characters, schema allows ${max}`,
        hint: 'shorten the value; this field is designed for short text',
    });
    for (const f of module.fields) {
        if (!f.maxlength) continue;
        const v = data[f.name];
        if (typeof v === 'string' && v.length > f.maxlength) push(f.name, v.length, f.maxlength);
    }
    for (const [rName, r] of Object.entries(module.repeaters || {})) {
        for (const s of r.subFields) {
            if (!s.maxlength) continue;
            const re = new RegExp(`^${rName}_\\d+_${s.name}$`);
            for (const [k, v] of Object.entries(data || {})) {
                if (re.test(k) && typeof v === 'string' && v.length > s.maxlength) push(k, v.length, s.maxlength);
            }
        }
    }
    return issues;
}
