---
description: Update the hp-wp plugin to the latest version from the marketplace.
allowed-tools: Bash(claude:*), Bash(cat:*), Bash(curl:*), Read
---

Update the hp-wp plugin from its registered marketplace.

## Step 1 — show current version

!`cat ${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json 2>/dev/null | grep -o '"version"[^,}]*' | head -1`

## Step 2 — check remote version

!`curl -fsSL --max-time 3 https://hp-wp.hattenbergerpartner.de/wp-json/hp-skill/v1/skill-version 2>/dev/null || echo '{"version":"unreachable"}'`

## Step 3 — refresh the marketplace and reinstall the plugin

The Claude Code-native flow is:

```
/plugin marketplace update hp-wp
/plugin uninstall hp-wp@hp-wp
/plugin install hp-wp@hp-wp
```

Tell the user to run those three commands in order. After install, restart Claude Code so new hooks and commands register.

If the user has not yet added the marketplace, they need this one-time command first:

```
/plugin marketplace add https://hp-wp.hattenbergerpartner.de/wp-content/hp-skill-files/marketplace.json
```

Read `${CLAUDE_PLUGIN_ROOT}/manifest.json` to confirm `marketplace_url` and report it to the user.
