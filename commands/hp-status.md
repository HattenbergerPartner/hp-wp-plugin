---
description: Show installed hp-wp plugin version and check for updates from the WP server.
allowed-tools: Read, Bash(curl:*), Bash(grep:*), Bash(date:*)
---

Report the installed hp-wp plugin version vs the latest version on the distribution server.

## Local version

!`grep -o '"version"[^,}]*' ${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json | head -1`

## Remote version

!`curl -fsSL --max-time 3 https://hp-wp.hattenbergerpartner.de/wp-json/hp-skill/v1/skill-version 2>/dev/null || echo '{"version":"unreachable","updated_at":null}'`

## Manifest snapshot

!`cat ${CLAUDE_PLUGIN_ROOT}/manifest.json 2>/dev/null`

Print a clean comparison:

```
hp-wp plugin status
───────────────────
Installed: <X.Y.Z>
Latest:    <X.Y.Z>  (updated <ISO date>)
Status:    up to date | update available | server unreachable | ahead of server
```

If an update is available, append: **Run `/hp-update` to install.**
If the server is unreachable, just print the local version and note the network failure (do NOT treat this as an error).
