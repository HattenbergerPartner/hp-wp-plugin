---
description: Show installed hp-wp plugin version and check for updates from the WP server.
allowed-tools: Read, Bash(curl:*)
---

Report the installed hp-wp plugin version vs the latest version on the distribution server.

Steps to perform:

1. **Read the plugin manifest.** Use the Read tool on `${CLAUDE_PLUGIN_ROOT}/.claude-plugin/plugin.json` to extract the local `version`.

2. **Read the runtime manifest.** Use the Read tool on `${CLAUDE_PLUGIN_ROOT}/manifest.json` to extract `version_endpoint` and `marketplace_url`.

3. **Fetch the remote version.** Run via Bash:
   ```
   curl -fsSL --max-time 5 https://hp-wp.hattenbergerpartner.de/wp-json/hp-skill/v1/skill-version
   ```
   If the request fails, treat the remote version as unreachable — do NOT error out.

4. **Compare and report.** Print this format exactly:

   ```
   hp-wp plugin status
   ───────────────────
   Installed: <X.Y.Z>
   Latest:    <X.Y.Z>  (updated <ISO date>)
   Status:    up to date | update available | server unreachable | ahead of server
   ```

5. If an update is available, append:

   > Run `/hp-update` to install the latest version.

   If the server was unreachable, append:

   > Server check failed (network or DNS). Local version still valid.
