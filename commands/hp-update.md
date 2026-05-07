---
description: Update the hp-wp plugin to the latest version from the marketplace.
allowed-tools: Read, Bash(curl:*)
---

Update the hp-wp plugin from the registered marketplace.

## Steps

1. **Read the current installed version.** Use the Read tool on `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json` to extract `version`.

2. **Read the runtime manifest.** Use the Read tool on `${CLAUDE_PLUGIN_ROOT}/manifest.json` to extract `marketplace_url` and `version_endpoint`.

3. **Check the remote version.** Run via Bash:
   ```
   curl -fsSL --max-time 5 https://hp-wp.hattenbergerpartner.de/wp-json/hp-skill/v1/skill-version
   ```

4. **Tell the user what to do.** The Claude Code-native flow is to run these three commands in order from inside Claude Code:

   ```
   /plugin marketplace update hp-wp
   /plugin uninstall hp-wp@hp-wp
   /plugin install hp-wp@hp-wp
   ```

   After install, restart Claude Code so commands and hooks register.

   If the user has not yet added the marketplace, they need this one-time command first:

   ```
   /plugin marketplace add https://hp-wp.hattenbergerpartner.de/wp-content/hp-skill-files/marketplace.json
   ```

5. **Report.** Print a clean summary like:

   ```
   hp-wp update
   ────────────
   Currently installed: 2.0.0
   Available remotely:  2.0.1 (updated 2026-05-12)
   Status:              update available

   To install, paste these into Claude Code:
     /plugin marketplace update hp-wp
     /plugin uninstall hp-wp@hp-wp
     /plugin install hp-wp@hp-wp
   ```

   If versions match, just print "Already on the latest version (X.Y.Z)" and stop.
   If the server is unreachable, print "Cannot reach update server — network or DNS issue. Try again later."
