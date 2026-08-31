#!/usr/bin/env node
/**
 * hp-wp-publish.mjs
 *
 * Reads Gutenberg ACF block markup from stdin and posts it as a draft
 * page (or post) to WordPress via /wp-json/wp/v2/pages.
 *
 * Usage:
 *   echo "$markup" | node ${CLAUDE_PLUGIN_ROOT}/scripts/hp-wp-publish.mjs --title "My Page"
 *   echo "$markup" | node ${CLAUDE_PLUGIN_ROOT}/scripts/hp-wp-publish.mjs --title "Hello" --post-type pages --status publish
 *
 * Stdout (success): single JSON line: {"id":123,"editUrl":"...","status":"draft","slug":"..."}
 * Stderr: human-readable message
 *
 * Exit codes:
 *   0 success
 *   1 usage / config error (missing args)
 *   2 auth failure (re-run /hp-wp:hp-config)
 *   3 network / timeout
 *   4 WP rejected the request (validation)
 *   5 markup uses a module that is not registered on the live site (would render
 *     as nothing). Pass --force to upload anyway.
 *   6 schema was not verified against the live site (stale or bundled). Pass
 *     --force to upload anyway.
 *
 * Flags:
 *   --force   skip the live module-registry gate (exit 5)
 */

import { loadCredentials, USER_ENV_PATH } from './env-loader.mjs';
import { createDraft, WPPublishError } from './wp-publisher.mjs';
import { loadRegistry, findUnregistered } from './wp-block-registry.mjs';
import { loadSchemaBundle } from './wp-schema-fetcher.mjs';

function parseArgs(argv) {
    const out = { postType: 'pages', status: 'draft' };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--title') out.title = argv[++i];
        else if (a === '--post-type') out.postType = argv[++i];
        else if (a === '--status') out.status = argv[++i];
        else if (a === '--force') out.force = true;
        else if (a === '--help' || a === '-h') out.help = true;
    }
    return out;
}

async function readStdin() {
    if (process.stdin.isTTY) return '';
    const chunks = [];
    for await (const c of process.stdin) chunks.push(c);
    return Buffer.concat(chunks).toString('utf8');
}

const args = parseArgs(process.argv.slice(2));

if (args.help) {
    console.log('Usage: echo "$markup" | hp-wp-publish --title "..." [--post-type pages|posts] [--status draft|publish] [--force]');
    process.exit(0);
}

if (!args.title || !args.title.trim()) {
    console.error('Error: --title is required.');
    process.exit(1);
}

const content = (await readStdin()).trim();
if (!content) {
    console.error('Error: no content received on stdin.');
    process.exit(1);
}

const creds = loadCredentials();
if (!creds.baseUrl || !creds.user || !creds.pass) {
    console.error(`Error: WordPress credentials not configured.`);
    console.error(`Run /hp-wp:hp-config (writes to ${USER_ENV_PATH}).`);
    process.exit(2);
}

// ── Live module-registry gate ────────────────────────────────────────────────
// A block whose module was removed from the theme is accepted by WP and
// rendered as nothing. Refuse to upload such markup unless --force.
const usedModules = [...content.matchAll(/<!--\s*wp:acf\/([a-z0-9_-]+)/g)].map(m => m[1]);
const registry = await loadRegistry();
if (registry.slugs) {
    const missing = findUnregistered(registry, usedModules);
    if (missing.length && !args.force) {
        console.error(`Refusing to upload: ${missing.length} module(s) are not registered on ${creds.baseUrl} and would render as nothing: ${missing.map(m => 'acf/' + m).join(', ')}`);
        console.error(`Registered modules (${registry.list.length}): ${registry.list.map(m => 'acf/' + m).join(', ')}`);
        console.error('Fix the markup, or re-run with --force to upload anyway.');
        process.exit(5);
    }
    if (missing.length && args.force) {
        console.error(`WARNING (--force): uploading with unregistered modules ${missing.map(m => 'acf/' + m).join(', ')} — these sections will not render.`);
    }
} else {
    console.error(`WARNING: could not verify module registry (${registry.error || registry.source}); uploading without the existence check.`);
}

// ── Live schema gate ─────────────────────────────────────────────────────────
// Field keys that the theme no longer has are stored by WordPress and never
// rendered. Refuse to upload unless the schema was verified live.
const schemaBundle = await loadSchemaBundle();
if (!schemaBundle.verified && !args.force) {
    console.error(`Refusing to upload: the ACF field schema was not verified against ${creds.baseUrl}.`);
    console.error(`Source: ${schemaBundle.source}${schemaBundle.error ? ` (${schemaBundle.error})` : ''}.`);
    console.error('Field keys may be stale, which stores content under keys nothing renders.');
    console.error('Fix the connection, or re-run with --force to upload anyway.');
    process.exit(6);
}
if (!schemaBundle.verified && args.force) {
    console.error(`WARNING (--force): uploading with an unverified schema (${schemaBundle.source}) — field keys may be stale.`);
}

try {
    const result = await createDraft({
        baseUrl: creds.baseUrl,
        user: creds.user,
        pass: creds.pass,
        title: args.title.trim(),
        content,
        postType: args.postType,
        status: args.status,
    });
    console.log(JSON.stringify(result));
    process.exit(0);
} catch (err) {
    if (err instanceof WPPublishError) {
        console.error(err.message);
        const code = err.kind === 'auth' ? 2 : err.kind === 'network' ? 3 : err.kind === 'validation' ? 4 : 1;
        process.exit(code);
    }
    console.error(`Unexpected error: ${err.message}`);
    process.exit(1);
}
