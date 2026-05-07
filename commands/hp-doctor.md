---
description: Diagnose the hp-wp plugin install — verify reference files, manifest sanity, server reachability.
allowed-tools: Read, Glob, Bash(curl:*)
---

Run a structured health check on the hp-wp plugin installed at `${CLAUDE_PLUGIN_ROOT}`. Report each check as PASS / WARN / FAIL with a short remedy when anything is off.

## Checks to perform

For every file path below, use the **Read** tool (or **Glob** for directory listings). The plugin install is outside the project working directory, so do NOT use `cat` or `ls` via Bash — Claude Code's command permissions will block those. The Read tool works fine on any absolute path.

1. **Plugin manifest sanity**
   - Read `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json` — verify it parses as JSON and `name` is `"hp-wp"`.
   - Read `${CLAUDE_PLUGIN_ROOT}/manifest.json` — verify it parses and contains `version_endpoint`.

2. **Skill files present** — Read each:
   - `skills/generate-hp-wp-page/SKILL.md`
   - `skills/generate-hp-wp-page/references/module-purpose-guide.md`
   - `skills/generate-hp-wp-page/references/module-config-guide.md`
   - `skills/generate-hp-wp-page/references/few-shot-examples.md`
   - `skills/generate-hp-wp-page/references/acf-schemas.md`
   - `skills/generate-hp-wp-page/references/color-system.md`
   - `skills/generate-hp-wp-page/references/page-patterns.md`

3. **Command files present** (Glob `${CLAUDE_PLUGIN_ROOT}/commands/*.md`):
   - `hp-page.md`, `hp-update.md`, `hp-status.md`, `hp-doctor.md`, `hp-sync.md`

4. **Hooks registered** — Read `${CLAUDE_PLUGIN_ROOT}/hooks/hooks.json`. WARN if `session-start-version-check.sh` isn't referenced.

5. **WP plugin reachable** — run via Bash:
   ```
   curl -sI --max-time 5 https://hp-wp.hattenbergerpartner.de/wp-json/hp-skill/v1/skill-version
   ```
   PASS if HTTP 200, WARN otherwise (network failure is not a hard fail).

6. **Marketplace reachable** — run via Bash:
   ```
   curl -sI --max-time 5 https://hp-wp.hattenbergerpartner.de/wp-content/hp-skill-files/marketplace.json
   ```
   PASS if HTTP 200, WARN otherwise.

## Output format

```
hp-wp doctor
────────────
[PASS] Plugin manifest         (.claude-plugin/plugin.json valid, name=hp-wp)
[PASS] Runtime manifest        (manifest.json valid)
[PASS] Skill SKILL.md          (present)
[PASS] References              (6/6 present)
[PASS] Commands                (5/5 present)
[PASS] Hooks                   (session-start hook registered)
[PASS] WP API reachable        (HTTP 200 from /skill-version)
[PASS] Marketplace reachable   (HTTP 200)

Summary: 8 PASS, 0 WARN, 0 FAIL → all healthy.
```

If any check fails, include a one-line remedy under the failing line. Example for a missing reference file:

```
[FAIL] References              (5/6 present — missing acf-schemas.md)
       → Run /hp-update to refetch, or /hp-sync if you're a maintainer.
```
