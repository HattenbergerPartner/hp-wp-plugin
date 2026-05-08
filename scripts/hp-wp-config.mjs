#!/usr/bin/env node
/**
 * hp-wp-config.mjs
 *
 * Manages the per-user credentials file at ~/.config/hp-wp/.env.
 *
 * Three modes:
 *   --check        Print resolution status as JSON, exit 0 if configured.
 *   --print        Print resolved WP_URL/WP_USER (password masked) and exit.
 *   --from-stdin   Read JSON {WP_URL, WP_USER, WP_PASS} from stdin, write the
 *                  file, exit 0 on success. Used by the /hp-wp:hp-config slash
 *                  command — Claude collects the values via AskUserQuestion
 *                  and pipes the JSON in.
 *   (default)      Interactive readline prompts. Only works in a real TTY
 *                  (terminal). Will refuse to run when stdin is not a TTY.
 */

import { mkdirSync, writeFileSync, chmodSync, existsSync, readFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { USER_ENV_PATH, loadCredentials } from './env-loader.mjs';

const args = new Set(process.argv.slice(2));

if (args.has('--check')) {
    const creds = loadCredentials();
    const ok = Boolean(creds.baseUrl && creds.user && creds.pass);
    console.log(JSON.stringify({
        ok,
        path: USER_ENV_PATH,
        userEnvExists: existsSync(USER_ENV_PATH),
        source: creds.source,
        hasUrl: Boolean(creds.baseUrl),
        hasUser: Boolean(creds.user),
        hasPass: Boolean(creds.pass),
    }));
    process.exit(ok ? 0 : 1);
}

if (args.has('--print')) {
    const creds = loadCredentials();
    console.log(JSON.stringify({
        path: USER_ENV_PATH,
        source: creds.source,
        WP_URL: creds.baseUrl,
        WP_USER: creds.user,
        WP_PASS: creds.pass ? '***set***' : null,
    }, null, 2));
    process.exit(0);
}

function existingValue(key) {
    if (!existsSync(USER_ENV_PATH)) return '';
    const m = readFileSync(USER_ENV_PATH, 'utf8').match(new RegExp(`^${key}\\s*=\\s*(.+)$`, 'm'));
    if (!m) return '';
    let v = m[1].trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) v = v.slice(1, -1);
    return v;
}

function writeEnv({ url, user, pass }) {
    if (!url || !user || !pass) {
        console.error('All three fields (WP_URL, WP_USER, WP_PASS) are required.');
        process.exit(1);
    }
    const body = `# hp-wp end-user credentials — managed by /hp-wp:hp-config\nWP_URL=${url}\nWP_USER=${user}\nWP_PASS=${pass}\n`;
    mkdirSync(dirname(USER_ENV_PATH), { recursive: true, mode: 0o700 });
    writeFileSync(USER_ENV_PATH, body, { mode: 0o600 });
    chmodSync(USER_ENV_PATH, 0o600);
    console.log(`Saved ${USER_ENV_PATH} (mode 600).`);
}

if (args.has('--from-stdin')) {
    const chunks = [];
    for await (const c of process.stdin) chunks.push(c);
    const raw = Buffer.concat(chunks).toString('utf8').trim();
    if (!raw) {
        console.error('No JSON received on stdin. Expected {"WP_URL":"...","WP_USER":"...","WP_PASS":"..."}');
        process.exit(1);
    }
    let parsed;
    try {
        parsed = JSON.parse(raw);
    } catch (err) {
        console.error(`Invalid JSON on stdin: ${err.message}`);
        process.exit(1);
    }
    writeEnv({ url: parsed.WP_URL, user: parsed.WP_USER, pass: parsed.WP_PASS });
    process.exit(0);
}

if (!process.stdin.isTTY) {
    console.error('Interactive setup requires a real terminal (TTY).');
    console.error('From inside Claude Code: run /hp-wp:hp-config (which uses AskUserQuestion + --from-stdin).');
    console.error(`From a shell: node ${process.argv[1]}  (in your terminal, not piped).`);
    console.error('Or set values non-interactively: echo \'{"WP_URL":"...","WP_USER":"...","WP_PASS":"..."}\' | node ' + process.argv[1] + ' --from-stdin');
    process.exit(2);
}

const { createInterface } = await import('node:readline/promises');
const rl = createInterface({ input: process.stdin, output: process.stdout });

async function ask(label, fallback) {
    const hint = fallback ? ` [${label === 'WP_PASS' ? '***unchanged***' : fallback}]` : '';
    const answer = (await rl.question(`${label}${hint}: `)).trim();
    return answer || fallback;
}

console.log('hp-wp credentials setup');
console.log('───────────────────────');
console.log(`File: ${USER_ENV_PATH}`);
console.log('Press Enter to keep an existing value. Generate an Application Password under WP Admin → Users → Profile.\n');

const url = await ask('WP_URL', existingValue('WP_URL'));
const user = await ask('WP_USER', existingValue('WP_USER'));
const pass = await ask('WP_PASS', existingValue('WP_PASS'));

rl.close();

writeEnv({ url, user, pass });
console.log('Test the connection with: /hp-wp:hp-page <briefing> --draft');
