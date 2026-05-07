---
description: (Maintainers only) Regenerate skill references from the live WordPress site.
allowed-tools: Read, Bash(node:*), Bash(test:*), Bash(pwd), Bash(ls:*), Bash(find:*)
---

Maintainer-only command. Refreshes `references/acf-schemas.md`, `references/color-system.md`, and `references/page-patterns.md` from the live WordPress REST API.

## Pre-flight

!`pwd`
!`test -f sync-acf-context.js && echo "found sync script in cwd" || echo "MISSING sync-acf-context.js in cwd"`
!`test -f .env && echo "found .env" || echo "MISSING .env file"`

If either of the above is missing, abort with:

> **Run this command from the content-wp-skill maintainer repo, not from an installed plugin.** You need both `sync-acf-context.js` and a `.env` file with `WP_URL`, `WP_USER`, `WP_PASS` set.

## Sync from live WP

!`node sync-acf-context.js --wp-env`

## Post-sync reminder

After the sync completes, tell the maintainer:

1. Review the diff in `wp-page-builder/references/` and `plugin/skills/generate-hp-wp-page/references/`.
2. If references look right, bump `version` in:
   - `plugin/.claude-plugin/plugin.json`
   - `plugin/.claude-plugin/marketplace.json` (the plugin entry's `version`)
   - `wp-plugin/hp-skill-api.php` (`HP_SKILL_VERSION`)
   - `package.json`
3. Commit the changes and push to GitHub.
4. Run `bash deploy.sh` to upload `marketplace.json` and the WP plugin to the distribution server.
5. Team members will be notified on next Claude Code session start.
