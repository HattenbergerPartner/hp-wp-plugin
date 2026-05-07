#!/usr/bin/env bash
# Shared helpers for hp-wp version checks. Sourced by other scripts.
# Pure POSIX where possible — depends only on curl, grep, sed, sort.

VERSION_ENDPOINT_DEFAULT="https://hp-wp.hattenbergerpartner.de/wp-json/hp-skill/v1/skill-version"

# read_local_version <plugin_json_path>
#   Echoes the version field, or empty string on failure.
read_local_version() {
    local f="$1"
    [ -f "$f" ] || return 0
    grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' "$f" | head -1 | sed 's/.*"\([^"]*\)"$/\1/'
}

# fetch_remote_version <endpoint_url> <timeout_seconds>
#   Echoes the remote version, or empty string on network/parse failure.
fetch_remote_version() {
    local url="${1:-$VERSION_ENDPOINT_DEFAULT}"
    local timeout="${2:-3}"
    local response
    response=$(curl -fsSL --max-time "$timeout" "$url" 2>/dev/null) || return 0
    echo "$response" | grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"$/\1/'
}

# version_compare <a> <b>
#   Echoes "older", "same", or "newer" — whether a is older/same/newer than b.
version_compare() {
    local a="$1" b="$2"
    if [ "$a" = "$b" ]; then echo "same"; return; fi
    local highest
    highest=$(printf '%s\n%s\n' "$a" "$b" | sort -V | tail -1)
    if [ "$highest" = "$a" ]; then echo "newer"; else echo "older"; fi
}
