---
description: (Maintainers only) Regenerate skill references from the live WordPress site.
allowed-tools: Read, Bash(node:*), Bash(test:*), Bash(pwd), Glob
---

Maintainer-only command. Refreshes `references/acf-schemas.md`, `references/color-system.md`, and `references/page-patterns.md` from the live WordPress REST API.

## Pre-flight

Verify you're in the maintainer repo by checking three things via Bash and Read:

1. Run `pwd` — confirm the working directory.
2. Run `test -f sync-acf-context.js` — must exit 0.
3. Run `test -f .env` — must exit 0.

If either of the `test` checks fails, abort with this exact message and STOP:

> **This command must be run from the content-wp-skill maintainer repo.**
> You need both `sync-acf-context.js` and a `.env` file with `WP_URL`, `WP_USER`, `WP_PASS` set.
> Open the repo in Claude Code (`cd /path/to/content-wp-skill`) and try again.

## Sync from live WP

If pre-flight passed, run via Bash:

```
node sync-acf-context.js --wp-env
```

This pulls live ACF schemas, theme colors, and page patterns. The sync script writes to both `wp-page-builder/references/` (legacy) and `plugin/skills/generate-hp-wp-page/references/` (canonical) automatically.

## Post-sync reminder

After the sync completes, tell the maintainer:

1. Review the diff in `plugin/skills/generate-hp-wp-page/references/` (and `wp-page-builder/references/` mirror).
2. If references look right, bump the `version` field in **all four** of these files:
   - `plugin/.claude-plugin/plugin.json`
   - `plugin/.claude-plugin/marketplace.json` (the `plugins[0].version` field)
   - `wp-plugin/hp-skill-api.php` (`HP_SKILL_VERSION`)
   - `package.json`
3. Commit and push to the working repo.
4. Publish the plugin: `git subtree push --prefix=plugin public main`
5. Deploy the WP plugin: `./deploy-plugin.sh`
6. Deploy the marketplace catalog: `./deploy.sh`
7. Team members get a passive update notification on next Claude Code session start.
