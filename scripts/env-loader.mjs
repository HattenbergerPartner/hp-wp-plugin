/**
 * env-loader.js
 *
 * Tiny KEY=VALUE parser. No `dotenv` dependency.
 * Resolves WordPress credentials in this order:
 *   1. ~/.config/hp-wp/.env (per-user, written by /hp-wp:hp-config)
 *   2. <cwd>/.env (maintainer fallback for the dev workflow)
 *   3. process.env (for CI / explicit overrides)
 */

import { readFileSync, existsSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

export const USER_ENV_PATH = join(homedir(), '.config', 'hp-wp', '.env');

function parseEnvFile(text) {
    const out = {};
    for (const rawLine of text.split(/\r?\n/)) {
        const line = rawLine.trim();
        if (!line || line.startsWith('#')) continue;
        const eq = line.indexOf('=');
        if (eq < 1) continue;
        const key = line.slice(0, eq).trim();
        let value = line.slice(eq + 1).trim();
        if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
            value = value.slice(1, -1);
        }
        out[key] = value;
    }
    return out;
}

function readIfExists(path) {
    if (!existsSync(path)) return {};
    try {
        return parseEnvFile(readFileSync(path, 'utf8'));
    } catch {
        return {};
    }
}

export function loadCredentials({ projectEnvPath = join(process.cwd(), '.env') } = {}) {
    const userEnv = readIfExists(USER_ENV_PATH);
    const projectEnv = readIfExists(projectEnvPath);

    const merged = { ...projectEnv, ...userEnv };
    const pickFrom = (key) => process.env[key] ?? merged[key] ?? null;

    return {
        baseUrl: pickFrom('WP_URL'),
        user: pickFrom('WP_USER'),
        pass: pickFrom('WP_PASS'),
        source: process.env.WP_URL
            ? 'process.env'
            : Object.keys(userEnv).length
                ? USER_ENV_PATH
                : Object.keys(projectEnv).length
                    ? projectEnvPath
                    : null,
    };
}
