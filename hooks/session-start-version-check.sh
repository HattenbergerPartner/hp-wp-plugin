#!/usr/bin/env bash
# hp-wp plugin — SessionStart hook
# Lightweight version check. Silent on every failure path (network, throttle, missing files).
# Emits a single-line "update available" notification ONLY when the server has a newer version.
#
# Output protocol: Claude Code SessionStart `hookSpecificOutput.additionalContext` JSON.
# Throttle: skips if last check was within 6 hours.

set -u

PLUGIN_ROOT="${CLAUDE_PLUGIN_ROOT:-$(cd "$(dirname "$0")/.." && pwd)}"
PLUGIN_JSON="$PLUGIN_ROOT/.claude-plugin/plugin.json"
MANIFEST="$PLUGIN_ROOT/manifest.json"
CACHE_DIR="${CLAUDE_PLUGIN_DATA:-$PLUGIN_ROOT}"
CACHE_FILE="$CACHE_DIR/.last-check"

# Silent-exit helpers
exit_silent() { exit 0; }
trap exit_silent ERR

# Throttle: 6h = 21600s
if [ -f "$CACHE_FILE" ]; then
    LAST=$(cat "$CACHE_FILE" 2>/dev/null || echo 0)
    NOW=$(date +%s)
    if [ $((NOW - LAST)) -lt 21600 ]; then
        exit 0
    fi
fi

[ -f "$PLUGIN_JSON" ] || exit 0
[ -f "$MANIFEST" ] || exit 0

# Local version (from plugin.json)
LOCAL=$(grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$PLUGIN_JSON" | head -1 | sed 's/.*"\([^"]*\)"$/\1/')

# Endpoint (from manifest.json)
ENDPOINT=$(grep -o '"version_endpoint"[[:space:]]*:[[:space:]]*"[^"]*"' "$MANIFEST" | sed 's/.*"\(https[^"]*\)"$/\1/')

[ -n "$LOCAL" ] && [ -n "$ENDPOINT" ] || exit 0

# Hard 1.5s timeout — never block session start
RESPONSE=$(curl -fsSL --max-time 1.5 "$ENDPOINT" 2>/dev/null) || exit 0
REMOTE=$(echo "$RESPONSE" | grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/')

[ -n "$REMOTE" ] || exit 0

# Update cache regardless of comparison outcome
mkdir -p "$CACHE_DIR" 2>/dev/null
date +%s > "$CACHE_FILE"

# Compare versions with sort -V (semver-aware)
HIGHEST=$(printf '%s\n%s\n' "$LOCAL" "$REMOTE" | sort -V | tail -1)

if [ "$HIGHEST" = "$REMOTE" ] && [ "$LOCAL" != "$REMOTE" ]; then
    # Emit Claude Code SessionStart additionalContext
    cat <<EOF
{"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":"hp-wp plugin update available ($LOCAL → $REMOTE) — run /hp-update"}}
EOF
fi

exit 0
