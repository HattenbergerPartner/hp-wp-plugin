---
description: Diagnose the hp-wp plugin install — verify reference files, manifest sanity, server reachability.
allowed-tools: Read, Bash(ls:*), Bash(find:*), Bash(stat:*), Bash(test:*), Bash(curl:*), Bash(wc:*), Bash(grep:*)
---

Run a structured health check on the hp-wp plugin at `${CLAUDE_PLUGIN_ROOT}`. Report each check as PASS / WARN / FAIL with a short remedy.

## Checks to perform

1. **Plugin manifest sanity**
   - `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json` exists and contains `"name": "hp-wp"`.
   - `${CLAUDE_PLUGIN_ROOT}/manifest.json` exists and is valid JSON.

2. **Skill files present** — verify every file:
   - `skills/generate-hp-wp-page/SKILL.md`
   - `skills/generate-hp-wp-page/references/module-purpose-guide.md`
   - `skills/generate-hp-wp-page/references/module-config-guide.md`
   - `skills/generate-hp-wp-page/references/few-shot-examples.md`
   - `skills/generate-hp-wp-page/references/acf-schemas.md`
   - `skills/generate-hp-wp-page/references/color-system.md`
   - `skills/generate-hp-wp-page/references/page-patterns.md`

3. **Command files present** — `commands/hp-page.md`, `commands/hp-update.md`, `commands/hp-status.md`, `commands/hp-doctor.md`, `commands/hp-sync.md`.

4. **Hooks registered** — `hooks/hooks.json` exists and `hooks/session-start-version-check.sh` is executable.

5. **Reference freshness** — warn if `acf-schemas.md` mtime is older than 30 days (likely needs `/hp-sync`).

6. **WP plugin reachable** — curl `https://hp-wp.hattenbergerpartner.de/wp-json/hp-skill/v1/skill-version` with 3s timeout. PASS if HTTP 200, WARN otherwise.

7. **Marketplace reachable** — curl `https://hp-wp.hattenbergerpartner.de/wp-content/hp-skill-files/marketplace.json` with 3s timeout. PASS if HTTP 200.

8. **Legacy skill cleanup** — if `~/.claude/skills/generate-hp-wp-page/` still exists alongside the plugin, WARN with cleanup hint.

## Commands you may invoke

!`ls -la ${CLAUDE_PLUGIN_ROOT}/`
!`ls -la ${CLAUDE_PLUGIN_ROOT}/skills/generate-hp-wp-page/references/ 2>/dev/null`
!`ls -la ${CLAUDE_PLUGIN_ROOT}/commands/ 2>/dev/null`
!`ls -la ${CLAUDE_PLUGIN_ROOT}/hooks/ 2>/dev/null`
!`stat -f "%Sm %N" ${CLAUDE_PLUGIN_ROOT}/skills/generate-hp-wp-page/references/acf-schemas.md 2>/dev/null`
!`curl -sI --max-time 3 https://hp-wp.hattenbergerpartner.de/wp-content/hp-skill-files/marketplace.json | head -1`
!`curl -sI --max-time 3 https://hp-wp.hattenbergerpartner.de/wp-json/hp-skill/v1/skill-version | head -1`
!`test -d $HOME/.claude/skills/generate-hp-wp-page && echo "legacy skill found at $HOME/.claude/skills/generate-hp-wp-page" || echo "no legacy skill"`

## Output format

```
hp-wp doctor
────────────
[PASS] Plugin manifest         (.claude-plugin/plugin.json valid)
[PASS] Skill SKILL.md          ()
[PASS] References              (6/6 present)
[WARN] References stale        (acf-schemas.md is 47 days old → run /hp-sync)
[PASS] Commands                (5/5 present)
[PASS] Hooks                   (session-start-version-check.sh executable)
[PASS] WP API reachable        (HTTP 200 from /skill-version)
[PASS] Marketplace reachable   (HTTP 200)
[WARN] Legacy skill present    (~/.claude/skills/generate-hp-wp-page — safe to delete)

Summary: 7 PASS, 2 WARN, 0 FAIL → run /hp-sync to refresh references.
```
