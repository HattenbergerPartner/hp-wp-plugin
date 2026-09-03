#!/usr/bin/env node
/**
 * wp-schema-fetcher.mjs
 *
 * Fetches the live ACF field definitions and theme colour tokens from
 * WordPress, renders them to markdown, and caches them.
 *
 * Why this exists: the bundled references/acf-schemas.md is only refreshed
 * when a maintainer runs /hp-wp:hp-sync and ships a release. Between releases
 * the theme can add, rename or remove fields, and the generator would emit
 * field keys that no longer resolve — ACF then stores the value under a key
 * nothing reads and the content silently vanishes from the page.
 *
 * Cache:  ~/.cache/hp-wp/acf-schemas.md
 *         ~/.cache/hp-wp/color-system.md
 *         ~/.cache/hp-wp/module-skeletons.md
 *         ~/.cache/hp-wp/schema-meta.json      (all mode 600)
 * TTL:    1 hour, override with HP_SCHEMA_TTL (seconds).
 * Skip:   HP_SKIP_SCHEMA=1 disables network and cache (tests).
 *
 * CLI:
 *   node wp-schema-fetcher.mjs             → prints the bundle status as JSON
 *   node wp-schema-fetcher.mjs --refresh   → force a network fetch
 *   node wp-schema-fetcher.mjs --check     → same as default, kept for symmetry
 *   node wp-schema-fetcher.mjs --strict    → exit 1 when the schema is unverified
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync, chmodSync } from 'node:fs';
import { homedir } from 'node:os';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadCredentials } from './env-loader.mjs';
import { renderAcfSchemas, renderColorSystem, renderModuleSkeletons } from './schema-renderer.mjs';

const TIMEOUT_MS = 15000;
const DEFAULT_TTL_SECONDS = 3600;

const __dirname = dirname(fileURLToPath(import.meta.url));

export const SCHEMA_CACHE_DIR = join(homedir(), '.cache', 'hp-wp');
const CACHED_ACF_PATH = join(SCHEMA_CACHE_DIR, 'acf-schemas.md');
const CACHED_COLOR_PATH = join(SCHEMA_CACHE_DIR, 'color-system.md');
const CACHED_SKELETON_PATH = join(SCHEMA_CACHE_DIR, 'module-skeletons.md');
const META_PATH = join(SCHEMA_CACHE_DIR, 'schema-meta.json');

const REFERENCES_DIR = join(__dirname, '..', 'skills', 'generate-hp-wp-page', 'references');
export const BUNDLED_ACF_PATH = join(REFERENCES_DIR, 'acf-schemas.md');
export const BUNDLED_COLOR_PATH = join(REFERENCES_DIR, 'color-system.md');
export const BUNDLED_SKELETON_PATH = join(REFERENCES_DIR, 'module-skeletons.md');

const ACF_ENDPOINT = '/wp-json/hp-skill/v1/acf-schemas';
const THEME_ENDPOINT = '/wp-json/hp-skill/v1/theme-options';

function ttlSeconds(override) {
    if (override) return override;
    const env = parseInt(process.env.HP_SCHEMA_TTL || '', 10);
    return Number.isNaN(env) || env <= 0 ? DEFAULT_TTL_SECONDS : env;
}

function readMeta() {
    if (!existsSync(META_PATH) || !existsSync(CACHED_ACF_PATH) || !existsSync(CACHED_COLOR_PATH)) return null;
    try {
        const raw = JSON.parse(readFileSync(META_PATH, 'utf8'));
        return raw?.fetched_at ? raw : null;
    } catch {
        return null;
    }
}

function ageSeconds(meta) {
    const t = Date.parse(meta?.fetched_at || '');
    return Number.isNaN(t) ? Infinity : Math.floor((Date.now() - t) / 1000);
}

function blockGroup(g) {
    return (g?.location || []).some(rg => Array.isArray(rg) && rg.some(r => r?.param === 'block'));
}

function countFields(groups) {
    let n = 0;
    const walk = (fields) => {
        if (!Array.isArray(fields)) return;
        for (const f of fields) {
            if (f?.name) n++;
            if (f?.sub_fields) walk(f.sub_fields);
        }
    };
    for (const g of groups) walk(g?.fields);
    return n;
}

async function getJson(url, auth, { allow404 = false } = {}) {
    const response = await fetch(url, {
        headers: { Authorization: auth, Accept: 'application/json' },
        signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (response.status === 401 || response.status === 403) {
        throw new Error(`Authentication failed (${response.status}). Run /hp-wp:hp-config.`);
    }
    if (response.status === 404) {
        if (allow404) return null;
        throw new Error('Endpoint not found. Upgrade the WP plugin (./deploy-plugin.sh).');
    }
    if (!response.ok) throw new Error(`WP returned HTTP ${response.status} for ${url}`);
    return response.json();
}

async function fetchAndRender({ baseUrl, user, pass }) {
    if (!baseUrl) throw new Error('Missing WP_URL — run /hp-wp:hp-config');
    if (!user || !pass) throw new Error('Missing WP_USER or WP_PASS — run /hp-wp:hp-config');

    const base = baseUrl.replace(/\/$/, '');
    const auth = 'Basic ' + Buffer.from(`${user}:${pass}`).toString('base64');

    const groups = await getJson(base + ACF_ENDPOINT, auth);
    if (!Array.isArray(groups) || groups.length === 0) {
        throw new Error('/acf-schemas returned no field groups — refusing to treat that as authoritative');
    }
    const themeOptions = await getJson(base + THEME_ENDPOINT, auth, { allow404: true });

    const moduleCount = groups.filter(g => String(g?.title || '').startsWith('Module:')).length;

    return {
        acfMarkdown: renderAcfSchemas(groups),
        colorMarkdown: renderColorSystem(themeOptions),
        skeletonMarkdown: renderModuleSkeletons(groups),
        module_count: moduleCount,
        field_count: countFields(groups),
        skeleton_count: groups.filter(g => blockGroup(g)).length,
    };
}

function writeCache(rendered) {
    mkdirSync(SCHEMA_CACHE_DIR, { recursive: true });
    writeFileSync(CACHED_ACF_PATH, rendered.acfMarkdown);
    writeFileSync(CACHED_COLOR_PATH, rendered.colorMarkdown);
    writeFileSync(CACHED_SKELETON_PATH, rendered.skeletonMarkdown);
    const meta = {
        fetched_at: new Date().toISOString(),
        module_count: rendered.module_count,
        field_count: rendered.field_count,
        skeleton_count: rendered.skeleton_count,
    };
    writeFileSync(META_PATH, JSON.stringify(meta, null, 2));
    for (const p of [CACHED_ACF_PATH, CACHED_COLOR_PATH, CACHED_SKELETON_PATH, META_PATH]) {
        try { chmodSync(p, 0o600); } catch {}
    }
    return meta;
}

function bundled(source, error, meta = null) {
    return {
        acfPath: BUNDLED_ACF_PATH,
        colorPath: BUNDLED_COLOR_PATH,
        skeletonPath: BUNDLED_SKELETON_PATH,
        source,
        verified: false,
        age_seconds: meta ? ageSeconds(meta) : null,
        fetched_at: meta?.fetched_at ?? null,
        module_count: meta?.module_count ?? 0,
        field_count: meta?.field_count ?? 0,
        error: error ?? null,
    };
}

/**
 * Resolve the schema files to read. Never throws unless `strict` is set.
 */
export async function loadSchemaBundle({ refresh = false, ttl = null, strict = false } = {}) {
    if (process.env.HP_SKIP_SCHEMA === '1') {
        return bundled('skipped', null);
    }

    const meta = readMeta();
    const age = meta ? ageSeconds(meta) : Infinity;
    const fresh = meta && age < ttlSeconds(ttl);

    if (fresh && !refresh) {
        return {
            acfPath: CACHED_ACF_PATH,
            colorPath: CACHED_COLOR_PATH,
            skeletonPath: CACHED_SKELETON_PATH,
            source: 'cache',
            verified: true,
            age_seconds: age,
            fetched_at: meta.fetched_at,
            module_count: meta.module_count ?? 0,
            field_count: meta.field_count ?? 0,
            error: null,
        };
    }

    try {
        const rendered = await fetchAndRender(loadCredentials());
        const written = writeCache(rendered);
        return {
            acfPath: CACHED_ACF_PATH,
            colorPath: CACHED_COLOR_PATH,
            skeletonPath: CACHED_SKELETON_PATH,
            source: 'fresh',
            verified: true,
            age_seconds: 0,
            fetched_at: written.fetched_at,
            module_count: written.module_count,
            field_count: written.field_count,
            error: null,
        };
    } catch (err) {
        const msg = err?.message || String(err);
        if (strict) throw new Error(msg);
        if (meta) {
            return {
                acfPath: CACHED_ACF_PATH,
                colorPath: CACHED_COLOR_PATH,
                skeletonPath: CACHED_SKELETON_PATH,
                source: 'stale-cache',
                verified: false,
                age_seconds: age,
                fetched_at: meta.fetched_at,
                module_count: meta.module_count ?? 0,
                field_count: meta.field_count ?? 0,
                error: msg,
            };
        }
        return bundled('bundled', msg);
    }
}

// ── CLI ──────────────────────────────────────────────────────────────────────
const isMain = process.argv[1] && import.meta.url === new URL(`file://${process.argv[1]}`).href;
if (isMain) {
    const argv = process.argv.slice(2);
    const bundle = await loadSchemaBundle({
        refresh: argv.includes('--refresh'),
        strict: argv.includes('--strict'),
    });
    process.stdout.write(JSON.stringify(bundle, null, 2) + '\n');
    process.exit(argv.includes('--strict') && !bundle.verified ? 1 : 0);
}
