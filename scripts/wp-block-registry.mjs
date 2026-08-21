#!/usr/bin/env node
/**
 * wp-block-registry.mjs
 *
 * Single source of truth for "which ACF blocks actually exist on the live
 * site right now". Fetches the registered block types from WordPress core
 * (GET /wp-json/wp/v2/block-types?namespace=acf) and caches the slug list.
 *
 * Why this exists: the theme registers blocks by scanning its modules
 * directory. When a module is deleted from the theme, WordPress silently
 * renders the stored block as nothing — no error, no container. The bundled
 * acf-schemas.md cannot know about that until a maintainer re-syncs, so every
 * consumer (context fetcher, validator, publisher) asks this registry instead.
 *
 * Cache:    ~/.cache/hp-wp/wp-block-registry.json  (mode 600)
 * TTL:      1 hour by default; override with HP_REGISTRY_TTL (seconds).
 * Skip:     HP_SKIP_REGISTRY=1 disables the network + cache entirely
 *           (returns {slugs: null, source: 'skipped'}). Intended for tests.
 *
 * Programmatic:
 *   import { loadRegistry } from './wp-block-registry.mjs';
 *   const reg = await loadRegistry({ refresh: false });
 *   // reg = { slugs: Set<string>|null, list: string[], source, age_seconds, fetched_at, error }
 *   // slugs are bare module names without the "acf/" prefix, e.g. "textmodule".
 *
 * CLI:
 *   node wp-block-registry.mjs            → prints {source, age_seconds, count, modules:[...]}
 *   node wp-block-registry.mjs --refresh  → force a network fetch
 *   node wp-block-registry.mjs --strict   → exit 1 if the registry cannot be resolved
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { loadCredentials } from './env-loader.mjs';

const TIMEOUT_MS = 15000;
const DEFAULT_TTL_SECONDS = 3600;
export const REGISTRY_CACHE_PATH = join(homedir(), '.cache', 'hp-wp', 'wp-block-registry.json');
const ENDPOINT_PATH = '/wp-json/wp/v2/block-types?namespace=acf&per_page=100&_fields=name';

function ttlSeconds(override) {
    if (override) return override;
    const env = parseInt(process.env.HP_REGISTRY_TTL || '', 10);
    return Number.isNaN(env) || env <= 0 ? DEFAULT_TTL_SECONDS : env;
}

function readCache() {
    if (!existsSync(REGISTRY_CACHE_PATH)) return null;
    try {
        const raw = JSON.parse(readFileSync(REGISTRY_CACHE_PATH, 'utf8'));
        if (!raw?.fetched_at || !Array.isArray(raw.modules)) return null;
        return raw;
    } catch {
        return null;
    }
}

function writeCache(modules) {
    mkdirSync(dirname(REGISTRY_CACHE_PATH), { recursive: true });
    const payload = { fetched_at: new Date().toISOString(), modules };
    writeFileSync(REGISTRY_CACHE_PATH, JSON.stringify(payload, null, 2));
    try { chmodSync(REGISTRY_CACHE_PATH, 0o600); } catch {}
    return payload;
}

function ageSeconds(cache) {
    const t = Date.parse(cache?.fetched_at || '');
    return Number.isNaN(t) ? Infinity : Math.floor((Date.now() - t) / 1000);
}

/** Normalise "acf/textmodule" | "textmodule" → "textmodule". */
export function bareSlug(name) {
    return String(name || '').trim().toLowerCase().replace(/^acf\//, '');
}

async function fetchRegisteredModules({ baseUrl, user, pass }) {
    if (!baseUrl) throw new Error('Missing WP_URL — run /hp-wp:hp-config');
    if (!user || !pass) throw new Error('Missing WP_USER or WP_PASS — run /hp-wp:hp-config');

    const url = baseUrl.replace(/\/$/, '') + ENDPOINT_PATH;
    const auth = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');
    const response = await fetch(url, {
        headers: { Authorization: auth, Accept: 'application/json' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed (${response.status}). Run /hp-wp:hp-config.`);
    }
    if (!response.ok) throw new Error(`WP returned HTTP ${response.status} for block-types`);

    const json = await response.json();
    if (!Array.isArray(json)) throw new Error('block-types response was not an array');
    const modules = json
        .map(b => bareSlug(b?.name))
        .filter(Boolean)
        .sort();
    if (modules.length === 0) throw new Error('block-types returned zero acf/* blocks — refusing to treat that as authoritative');
    return modules;
}

/**
 * Resolve the registry. Never throws unless `strict` is set; on failure it
 * falls back to a stale cache, and if there is none returns slugs: null so
 * callers can degrade to "unknown" rather than "everything is invalid".
 */
export async function loadRegistry({ refresh = false, ttl = null, strict = false } = {}) {
    if (process.env.HP_SKIP_REGISTRY === '1') {
        return { slugs: null, list: [], source: 'skipped', age_seconds: null, fetched_at: null, error: null };
    }

    const cache = readCache();
    const age = ageSeconds(cache);
    const fresh = cache && age < ttlSeconds(ttl);

    if (fresh && !refresh) {
        return { slugs: new Set(cache.modules), list: cache.modules, source: 'cache', age_seconds: age, fetched_at: cache.fetched_at, error: null };
    }

    try {
        const modules = await fetchRegisteredModules(loadCredentials());
        const written = writeCache(modules);
        return { slugs: new Set(modules), list: modules, source: 'fresh', age_seconds: 0, fetched_at: written.fetched_at, error: null };
    } catch (err) {
        const msg = err?.message || String(err);
        if (strict) throw new Error(msg);
        if (cache) {
            return { slugs: new Set(cache.modules), list: cache.modules, source: 'stale-cache', age_seconds: age, fetched_at: cache.fetched_at, error: msg };
        }
        return { slugs: null, list: [], source: 'none', age_seconds: null, fetched_at: null, error: msg };
    }
}

/** Convenience: given a registry and a list of module names, return the ones that are NOT registered. */
export function findUnregistered(registry, moduleNames) {
    if (!registry?.slugs) return [];
    const seen = new Set();
    const out = [];
    for (const name of moduleNames) {
        const slug = bareSlug(name);
        if (!registry.slugs.has(slug) && !seen.has(slug)) {
            seen.add(slug);
            out.push(slug);
        }
    }
    return out;
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
    const argv = process.argv.slice(2);
    const refresh = argv.includes('--refresh');
    const strict = argv.includes('--strict');
    try {
        const reg = await loadRegistry({ refresh, strict });
        process.stdout.write(JSON.stringify({
            ok: reg.slugs !== null,
            source: reg.source,
            age_seconds: reg.age_seconds,
            fetched_at: reg.fetched_at,
            cache_path: REGISTRY_CACHE_PATH,
            count: reg.list.length,
            modules: reg.list,
            error: reg.error,
        }, null, 2) + '\n');
        process.exit(reg.slugs === null && strict ? 1 : 0);
    } catch (err) {
        process.stderr.write(`[wp-block-registry] ${err.message}\n`);
        process.exit(1);
    }
}
