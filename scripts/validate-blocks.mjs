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
 *   5. Live module existence (error) — the module must be a block type that
 *      WordPress currently has registered (wp-block-registry.mjs). A block
 *      whose module was removed from the theme is stored fine and rendered
 *      as NOTHING, so this is the only check that catches a silently
 *      dropped section before it reaches the editor.
 *
 * Flags:
 *   --offline          Skip both live checks (registry and ACF schema) and
 *                      validate against the bundled schema only.
 *                      The result then carries `registry: {source:'skipped'}`
 *                      and a single `registry_unavailable` warning.
 *   --refresh-registry Force a fresh block-type fetch (bypass 1h cache).
 *
 * Stdout: single-line JSON
 *   { valid: bool, blocks: number, errors, warnings, registry: {source, age_seconds, count},
 *     issues: [{block, module, field?, severity, code, message, hint?}] }
 *
 * Exit codes: 0 clean, 1 issues found.
 */

import { loadSchemas } from './schema-loader.mjs';
import { loadRegistry } from './wp-block-registry.mjs';
import { loadSchemaBundle } from './wp-schema-fetcher.mjs';
import {
    findUnescapedQuote, checkSchemaCompleteness, checkHtmlEscapeRaw, checkQuoteHygiene,
} from './block-checks.mjs';

const BLOCK_RE = /<!--\s*wp:acf\/([a-z0-9_-]+)\s+(\{[\s\S]*?\})\s*\/-->/g;

function readStdin() {
    return new Promise((resolve) => {
        const chunks = [];
        process.stdin.on('data', c => chunks.push(c));
        process.stdin.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    });
}

const argv = process.argv.slice(2);
const offline = argv.includes('--offline');
const refreshRegistry = argv.includes('--refresh-registry');

const input = await readStdin();
const schemaBundle = offline
    ? { acfPath: undefined, source: 'skipped', verified: false, age_seconds: null, module_count: 0, error: null }
    : await loadSchemaBundle({ refresh: refreshRegistry });
const schemas = loadSchemas(schemaBundle.acfPath);
const registry = offline
    ? { slugs: null, list: [], source: 'skipped', age_seconds: null, error: null }
    : await loadRegistry({ refresh: refreshRegistry });
const issues = [];
let blockCount = 0;

if (registry.slugs === null) {
    issues.push({
        block: 0,
        module: null,
        severity: 'warn',
        code: 'registry_unavailable',
        message: offline
            ? 'live module registry skipped (--offline) — module existence was NOT verified'
            : `could not load the live module registry (${registry.error || 'unknown error'}) — module existence was NOT verified`,
        hint: 'a module removed from the theme renders as nothing; run /hp-wp:hp-config and re-validate before uploading',
    });
} else if (registry.source === 'stale-cache') {
    issues.push({
        block: 0,
        module: null,
        severity: 'warn',
        code: 'registry_stale',
        message: `live module registry unreachable (${registry.error}); using cached list from ${registry.fetched_at}`,
        hint: 'results are only as current as that cache',
    });
}

if (!schemaBundle.verified) {
    issues.push({
        block: 0,
        module: null,
        severity: 'warn',
        code: 'schema_unverified',
        message: schemaBundle.source === 'skipped'
            ? 'live ACF schema skipped — field keys were NOT verified against WordPress'
            : `live ACF schema unavailable (${schemaBundle.error || schemaBundle.source}) — field keys came from the ${schemaBundle.source} copy`,
        hint: 'a field key the theme no longer has is stored but never rendered; run /hp-wp:hp-config and re-validate before uploading',
    });
}

let match;
const re = new RegExp(BLOCK_RE);
while ((match = re.exec(input)) !== null) {
    blockCount++;
    const blockIndex = blockCount;
    const moduleName = match[1];
    const jsonStr = match[2];
    const module = schemas.get(moduleName);

    if (registry.slugs && !registry.slugs.has(moduleName)) {
        issues.push({
            block: blockIndex,
            module: moduleName,
            severity: 'error',
            code: 'unregistered_module',
            message: `module "acf/${moduleName}" is not registered on the live WordPress site — the block would be stored but render NOTHING`,
            hint: `replace it with a registered module (${registry.list.length} available: ${registry.list.join(', ')})`,
        });
        // Still run the remaining checks so the author sees every problem at once.
    }

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
        const alreadyFlagged = registry.slugs && !registry.slugs.has(moduleName);
        if (!alreadyFlagged) {
            issues.push({
                block: blockIndex,
                module: moduleName,
                severity: 'error',
                code: 'unknown_module',
                message: `module "acf/${moduleName}" not found in acf-schemas.md — field keys cannot be verified`,
                hint: 'either the module name is wrong, or the bundled schema is stale (maintainer: run /hp-wp:hp-sync and release)',
            });
        }
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
    registry: {
        source: registry.source,
        age_seconds: registry.age_seconds,
        count: registry.list.length,
    },
    schema: {
        source: schemaBundle.source,
        age_seconds: schemaBundle.age_seconds,
        verified: schemaBundle.verified,
        module_count: schemaBundle.module_count,
    },
    issues,
};

console.log(JSON.stringify(result));
process.exit(errorCount === 0 ? 0 : 1);
