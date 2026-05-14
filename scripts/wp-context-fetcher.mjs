#!/usr/bin/env node
/**
 * wp-context-fetcher.mjs
 *
 * Fetches the live module/template context bundle from the WP plugin and
 * caches it locally so /hp-page reads are fast.
 *
 * Cache:   ~/.cache/hp-wp/wp-context.json   (mode 600)
 * TTL:     1 hour by default; override with HP_CONTEXT_TTL (seconds).
 * Endpoint: GET {WP_URL}/wp-json/hp-skill/v1/context-bundle  (HTTP Basic auth)
 *
 * Flags:
 *   --print            Print the bundle JSON to stdout (uses cache when fresh).
 *   --refresh          Force a network fetch even if the cache is fresh.
 *   --check            Print {ok, source, age_seconds, has_credentials} JSON.
 *   --strict           Exit 1 (instead of emitting an empty bundle) when the WP fetch fails.
 *   --ttl=<seconds>    Override TTL for this invocation.
 *
 * Output contract: callers (the SKILL.md Step 0.5) should always read stdout
 * as JSON. Even when --strict is OFF and the network fails, stdout will be
 * a valid JSON object with empty `modules` / `templates`. A warning goes to stderr.
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { loadCredentials } from './env-loader.mjs';

const TIMEOUT_MS = 20000;
const DEFAULT_TTL_SECONDS = 3600;
const CACHE_PATH = join(homedir(), '.cache', 'hp-wp', 'wp-context.json');
const ENDPOINT_PATH = '/wp-json/hp-skill/v1/context-bundle';

function parseArgs(argv) {
    const args = { print: false, refresh: false, check: false, strict: false, ttl: null };
    for (const a of argv) {
        if (a === '--print')   args.print = true;
        else if (a === '--refresh') args.refresh = true;
        else if (a === '--check')   args.check = true;
        else if (a === '--strict')  args.strict = true;
        else if (a.startsWith('--ttl=')) {
            const n = parseInt(a.slice(6), 10);
            if (!Number.isNaN(n) && n > 0) args.ttl = n;
        }
    }
    if (!args.print && !args.check) args.print = true;
    return args;
}

function ttlSeconds(override) {
    if (override) return override;
    const env = parseInt(process.env.HP_CONTEXT_TTL || '', 10);
    return Number.isNaN(env) || env <= 0 ? DEFAULT_TTL_SECONDS : env;
}

function readCache() {
    if (!existsSync(CACHE_PATH)) return null;
    try {
        const raw = JSON.parse(readFileSync(CACHE_PATH, 'utf8'));
        if (!raw || typeof raw !== 'object') return null;
        if (!raw.fetched_at || !raw.data) return null;
        return raw;
    } catch {
        return null;
    }
}

function writeCache(data) {
    const dir = dirname(CACHE_PATH);
    mkdirSync(dir, { recursive: true });
    const payload = {
        fetched_at: new Date().toISOString(),
        ttl_seconds: ttlSeconds(),
        data,
    };
    writeFileSync(CACHE_PATH, JSON.stringify(payload, null, 2));
    try { chmodSync(CACHE_PATH, 0o600); } catch {}
    return payload;
}

function ageSeconds(cache) {
    if (!cache?.fetched_at) return Infinity;
    const t = Date.parse(cache.fetched_at);
    if (Number.isNaN(t)) return Infinity;
    return Math.floor((Date.now() - t) / 1000);
}

async function fetchBundle({ baseUrl, user, pass }) {
    if (!baseUrl) throw new Error('Missing WP_URL — run /hp-wp:hp-config');
    if (!user || !pass) throw new Error('Missing WP_USER or WP_PASS — run /hp-wp:hp-config');

    const url = baseUrl.replace(/\/$/, '') + ENDPOINT_PATH;
    const auth = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');

    const response = await fetch(url, {
        method: 'GET',
        headers: { Authorization: auth, Accept: 'application/json' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed (${response.status}). Run /hp-wp:hp-config.`);
    }
    if (response.status === 404) {
        throw new Error('Endpoint /context-bundle not found. The WP plugin needs to be upgraded to 2.1.0+ (./deploy-plugin.sh).');
    }
    if (!response.ok) {
        throw new Error(`WP returned HTTP ${response.status}`);
    }

    const json = await response.json();
    if (!json || typeof json !== 'object') {
        throw new Error('Bundle response was not a JSON object');
    }
    return json;
}

function emptyBundle(reason) {
    return {
        generated_at: null,
        plugin_version: null,
        modules: {},
        templates: [],
        _empty: true,
        _reason: reason || null,
    };
}

async function main() {
    const args = parseArgs(process.argv.slice(2));
    const cache = readCache();
    const ttl = ttlSeconds(args.ttl);
    const cacheAge = ageSeconds(cache);
    const cacheFresh = cache && cacheAge < ttl;

    let bundle;
    let source;

    if (cacheFresh && !args.refresh) {
        bundle = cache.data;
        source = 'cache';
    } else {
        const creds = loadCredentials();
        try {
            bundle = await fetchBundle(creds);
            const written = writeCache(bundle);
            source = 'fresh';
            if (args.check) {
                process.stdout.write(JSON.stringify({
                    ok: true,
                    source,
                    age_seconds: 0,
                    has_credentials: Boolean(creds.baseUrl && creds.user && creds.pass),
                    cache_path: CACHE_PATH,
                    fetched_at: written.fetched_at,
                    plugin_version: bundle.plugin_version,
                }, null, 2) + '\n');
                return;
            }
        } catch (err) {
            const msg = err?.message || String(err);
            process.stderr.write(`[wp-context-fetcher] WARNING: ${msg}\n`);
            if (args.strict) {
                process.exit(1);
            }
            if (cache) {
                process.stderr.write(`[wp-context-fetcher] Falling back to stale cache (age ${cacheAge}s).\n`);
                bundle = cache.data;
                source = 'stale-cache';
            } else {
                bundle = emptyBundle(msg);
                source = 'none';
            }
            if (args.check) {
                process.stdout.write(JSON.stringify({
                    ok: false,
                    source,
                    age_seconds: cache ? cacheAge : null,
                    has_credentials: Boolean(creds.baseUrl && creds.user && creds.pass),
                    cache_path: CACHE_PATH,
                    error: msg,
                }, null, 2) + '\n');
                return;
            }
        }
    }

    if (args.check) {
        process.stdout.write(JSON.stringify({
            ok: true,
            source,
            age_seconds: source === 'cache' ? cacheAge : 0,
            cache_path: CACHE_PATH,
            ttl_seconds: ttl,
            plugin_version: bundle?.plugin_version ?? null,
            module_count: Object.keys(bundle?.modules || {}).length,
            template_count: (bundle?.templates || []).length,
        }, null, 2) + '\n');
        return;
    }

    process.stdout.write(JSON.stringify({
        source,
        age_seconds: source === 'cache' ? cacheAge : 0,
        ...bundle,
    }, null, 2) + '\n');
}

main().catch((err) => {
    process.stderr.write(`[wp-context-fetcher] FATAL: ${err.message}\n`);
    process.exit(1);
});
