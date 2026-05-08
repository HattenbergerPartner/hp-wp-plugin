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
 */

import { loadCredentials, USER_ENV_PATH } from './env-loader.mjs';
import { createDraft, WPPublishError } from './wp-publisher.mjs';

function parseArgs(argv) {
    const out = { postType: 'pages', status: 'draft' };
    for (let i = 0; i < argv.length; i++) {
        const a = argv[i];
        if (a === '--title') out.title = argv[++i];
        else if (a === '--post-type') out.postType = argv[++i];
        else if (a === '--status') out.status = argv[++i];
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
    console.log('Usage: echo "$markup" | hp-wp-publish --title "..." [--post-type pages|posts] [--status draft|publish]');
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
