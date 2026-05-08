---
description: Configure WordPress credentials for /hp-page --draft auto-upload (writes ~/.config/hp-wp/.env).
allowed-tools: AskUserQuestion, Bash(node:*)
---

Set up (or refresh) the per-user WordPress credentials at `~/.config/hp-wp/.env` (mode 600). These are used by `/hp-wp:hp-page --draft` and `--both` to publish drafts directly to WordPress.

> Generate an Application Password under WP Admin → Users → Profile → Application Passwords. The user must have `edit_pages` capability.

**Procedure:**

1. **Read current values** to use as defaults:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/hp-wp-config.mjs --print
   ```
   The output is JSON with `WP_URL`, `WP_USER`, and `WP_PASS` (masked as `***set***` if present, `null` if not). Note these for use as defaults.

2. **Ask the user for the three values** using `AskUserQuestion`. Use one call with three free-text questions — present each existing value (if any) so the user can keep it or replace it:

   - Q1: `WP_URL` — current value: `<from --print or "(none)">`. Provide options like "Keep current" / "Other" so the user can type a new URL via the Other field. If no current value, just ask freely.
   - Q2: `WP_USER` — current value: `<from --print or "(none)">`. Same pattern.
   - Q3: `WP_PASS` — current: `<"set" or "not set">`. **Never echo the actual password.** Always require fresh input here unless the user explicitly chooses "Keep current".

   Treat empty answers as "keep current". If the user has no current value AND skips a field, abort with: "All three fields are required. Re-run /hp-wp:hp-config when you have the WP credentials ready."

3. **Pipe the resolved values as JSON** into the script. Construct a JSON object (use the existing value when "Keep current" was chosen) and pipe it via stdin:

   ```
   echo '{"WP_URL":"<url>","WP_USER":"<user>","WP_PASS":"<pass>"}' | node ${CLAUDE_PLUGIN_ROOT}/scripts/hp-wp-config.mjs --from-stdin
   ```

   Use single quotes around the JSON, escape any single quotes in the values, and never log the resulting command (the password is in it).

4. **Verify** by running:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/hp-wp-config.mjs --check
   ```
   If `ok: true`, report: `✓ Credentials saved. Try /hp-wp:hp-page <briefing> --draft to test the upload.`

**Inspection-only modes** (no prompts, no writes):

- `--check` returns JSON `{ok, path, hasUrl, hasUser, hasPass, source}`, exits 0 if all set.
- `--print` returns the resolved config (password masked).

**Direct-shell fallback:**

If a user prefers to type their credentials in their actual terminal (with no Claude in the middle), they can run:

```
! node ${CLAUDE_PLUGIN_ROOT}/scripts/hp-wp-config.mjs
```

The `!` prefix gives the script a real TTY so its readline prompts work normally.
