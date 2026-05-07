#!/usr/bin/env bash
# Migration helper: detects users still on the legacy ~/.claude/skills/generate-hp-wp-page/ install
# and prepares them for the plugin layout.
#
# Safe to run multiple times. Never deletes user data — just backs up and stubs.
# Called by the bootstrap installer; can also be run by hand: bash migrate-from-skill.sh

set -u

OLD_SKILL="$HOME/.claude/skills/generate-hp-wp-page"

if [ ! -d "$OLD_SKILL" ]; then
    exit 0
fi

# Check whether we're already migrated (stub SKILL.md present)
if grep -q "Migrated to plugin" "$OLD_SKILL/SKILL.md" 2>/dev/null; then
    exit 0
fi

echo "  → Detected legacy skill at $OLD_SKILL"

# Backup with date suffix so re-runs don't clobber
BACKUP_BASE="$HOME/.claude/skills/generate-hp-wp-page.pre-plugin-backup"
DATE_SUFFIX="$(date +%Y%m%d-%H%M%S)"
BACKUP="$BACKUP_BASE-$DATE_SUFFIX"

if cp -R "$OLD_SKILL" "$BACKUP" 2>/dev/null; then
    echo "  → Backed up legacy skill to $BACKUP"
else
    echo "  ! Failed to back up legacy skill; aborting migration"
    exit 1
fi

# Replace the legacy SKILL.md with a stub pointing at the plugin
cat > "$OLD_SKILL/SKILL.md" <<'EOF'
---
name: generate-hp-wp-page
description: Migrated to plugin. Use /hp-page instead. This stub left in place to prevent stale skill triggering.
---

# Migrated to plugin

This skill moved into the **hp-wp Claude Code plugin**.

Use one of:

- `/hp-page <briefing>` — one-shot generation (default, fastest path)
- `/hp-page <briefing> --interactive` — clarifying questions and a plan summary first
- `/hp-status` — check installed version and updates
- `/hp-doctor` — verify the plugin install is healthy

The skill body now lives at `~/.claude/plugins/<marketplace>/hp-wp/skills/generate-hp-wp-page/SKILL.md`.

To remove this stub directory once you've confirmed the plugin works:

```
rm -rf ~/.claude/skills/generate-hp-wp-page
```
EOF

echo "  ✓ Legacy SKILL.md replaced with redirect stub"
echo "    Run \`rm -rf $OLD_SKILL\` after verifying /hp-page works."
