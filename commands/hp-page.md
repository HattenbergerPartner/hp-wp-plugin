---
description: Generate a WordPress ACF page from a briefing. Use --interactive for clarifying questions and a plan summary, --fast for one-shot generation.
argument-hint: "[briefing text or path] [--interactive | --fast]"
allowed-tools: Read, AskUserQuestion, Bash(grep:*), Bash(find:*), Bash(pbcopy)
---

You are about to generate a WordPress page using the `generate-hp-wp-page` skill at `${CLAUDE_PLUGIN_ROOT}/skills/generate-hp-wp-page/SKILL.md`.

User input: $ARGUMENTS

**Routing rules:**

1. Parse `$ARGUMENTS` for flags. Strip them before treating the rest as the briefing.
   - `--interactive` → interactive mode (Step 0 Briefing Triage runs first)
   - `--fast` → one-shot mode (skip Step 0)
   - no flag → one-shot mode (default)

2. If the remaining argument looks like a file path (ends in `.md`/`.txt`, contains `/`, or exists on disk), Read it. Otherwise treat as inline briefing text.

3. If empty briefing → ask the user for one before doing anything.

4. Invoke the skill at `${CLAUDE_PLUGIN_ROOT}/skills/generate-hp-wp-page/SKILL.md`:
   - Interactive mode: execute Step 0 (Briefing Triage), wait for plan approval, then Steps 1–8.
   - One-shot mode: skip Step 0 entirely, run Steps 1–8 directly.

5. Final output is HTML comment blocks in an ```html``` fenced code block. Pipe the output through `pbcopy` so it lands on the clipboard cleanly. Never put blank lines between `<!-- wp:acf/... /-->` blocks.

Read the skill file now and follow its Chain-of-Verification.
