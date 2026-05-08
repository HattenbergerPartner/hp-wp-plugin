---
description: Generate a WordPress ACF page from a briefing. Use --interactive for clarifying questions and a plan summary, --fast for one-shot generation. --draft uploads as a WP draft, --clipboard copies to clipboard, --both does both (default = ask).
argument-hint: "[briefing text or path] [--interactive | --fast] [--draft | --clipboard | --both]"
allowed-tools: Read, AskUserQuestion, Bash(grep:*), Bash(find:*), Bash(pbcopy), Bash(node:*)
---

You are about to generate a WordPress page using the `generate-hp-wp-page` skill at `${CLAUDE_PLUGIN_ROOT}/skills/generate-hp-wp-page/SKILL.md`.

User input: $ARGUMENTS

**Routing rules:**

1. Parse `$ARGUMENTS` for flags. Strip them before treating the rest as the briefing.
   - **Mode flags** (mutually exclusive — last one wins):
     - `--interactive` → interactive mode (Step 0 Briefing Triage runs first)
     - `--fast` → one-shot mode (skip Step 0)
     - none → one-shot mode (default)
   - **Output flags** (mutually exclusive — last one wins):
     - `--draft` → push the result straight into WordPress as a draft page (skip clipboard)
     - `--clipboard` → copy markup to clipboard only (legacy behavior, no network call)
     - `--both` → clipboard AND WordPress draft
     - none → ask the user after generation (Step 9 prompts)

2. If the remaining argument looks like a file path (ends in `.md`/`.txt`, contains `/`, or exists on disk), Read it. Otherwise treat as inline briefing text.

3. If empty briefing → ask the user for one before doing anything.

4. Invoke the skill at `${CLAUDE_PLUGIN_ROOT}/skills/generate-hp-wp-page/SKILL.md`:
   - Interactive mode: execute Step 0 (Briefing Triage), wait for plan approval, then Steps 1–8.
   - One-shot mode: skip Step 0 entirely, run Steps 1–8 directly.
   - **Always** run Step 9 (Output Routing) at the end. Pass the output flag (`clipboard` / `draft` / `both` / `ask`) and the raw briefing text into Step 9 — the skill needs the briefing to extract a title for `--draft` and `--both`.

5. Final output is HTML comment blocks in an ```html``` fenced code block. Step 9 handles the delivery (clipboard, WP draft via `${CLAUDE_PLUGIN_ROOT}/scripts/hp-wp-publish.mjs`, or both). Never put blank lines between `<!-- wp:acf/... /-->` blocks.

Read the skill file now and follow its Chain-of-Verification.
