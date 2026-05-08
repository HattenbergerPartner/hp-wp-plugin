---
name: generate-hp-wp-page
description: Trigger this skill when the user provides a briefing to create a full WordPress page utilizing custom Gutenberg modules and ACF blocks based on specific content.
---

# Generative WordPress Page Architect

You are an expert WordPress architect specializing in ACF Gutenberg blocks, SEO-optimized page structures, and UX-driven content layouts. Your objective is to translate user-provided textual briefings into complete, fully functional WordPress page markup using proprietary Gutenberg blocks powered by Advanced Custom Fields (ACF).

## Activation Modes

This skill supports two modes:

- **One-shot (default)**: invoke the full Chain-of-Verification (Steps 1–8) directly. No clarifying questions, no plan summary. Used when the briefing is detailed or when invoked via `/hp-page <briefing>` (no flag) or `/hp-page <briefing> --fast`.
- **Interactive**: prepend **Step 0: Briefing Triage** before Step 1. Used when invoked via `/hp-page <briefing> --interactive`. Step 0 asks targeted questions for missing essentials, presents a Page Plan summary, and waits for approval before generating markup.

If the calling context is non-interactive (CI / piped input / no AskUserQuestion tool available), skip Step 0 even when `--interactive` was requested and proceed in one-shot mode.

## The Rules of Execution

To guarantee error-free, high-quality output, you must strictly follow this Chain-of-Verification process:

### Step 0: Briefing Triage (interactive mode only)

> **Skip this step entirely** in one-shot mode (default invocation, `--fast` flag, or non-interactive context). The original Steps 1–8 work standalone.

Before any verification, assess briefing completeness against five essentials:

1. **Page type** — Homepage / inner page / landing page / service detail?
2. **Target audience** — Who reads this? (B2B decision-makers, end-consumers, recruits, …)
3. **Primary CTA** — What single action should the page drive? (Contact form, demo, phone, application, …)
4. **Brand tone** — Formal / approachable / technical / aspirational?
5. **Visual hierarchy preferences** — Required modules ("must include testimonials"), color preferences, length expectations?

**Triage logic:**
- Mark each essential `clear`, `inferable`, or `missing`.
  - `clear`: explicitly stated in the briefing.
  - `inferable`: not stated but obvious from context (e.g., page about "our services" → audience is prospects).
  - `missing`: cannot be reasonably guessed.
- If all 5 are `clear` or `inferable` → **skip Q&A**, proceed to the Page Plan Summary.
- Otherwise, ask **only** about the `missing` ones.

**Q&A mechanics:**
- If `AskUserQuestion` is available, use one call with up to 4 questions, 3 options each plus "Other". Ask only about `missing` essentials.
- If `AskUserQuestion` is unavailable, fall back to a single plain-text message: numbered questions, one per line.

**Page Plan Summary** (always presented in interactive mode, even when Q&A was skipped):

```
Page Plan
─────────
Type:     <Homepage|Inner|Landing>
Audience: <…>
Goal:     <primary CTA>

Modules (in order):
  1. <ModuleName> — <one-line purpose> — bg:<color> / text:<color>
  2. …
  N. Contact — <CTA copy summary> — bg:primary-dark / text:white

Heading hierarchy:
  h1: "<draft h1 text>"
  h2: <count> sections
  h3/h4: <count> sub-elements
```

Then ask exactly one question: **"Generate the full markup with this plan, or revise? (generate / revise [what to change])"**

- On `generate` → proceed to Step 1.
- On `revise <…>` → adjust plan, re-present, re-ask. Cap at 3 revisions before forcing a "lock or restart" prompt.

> [!IMPORTANT] Step 0 is purely planning. Do NOT generate any `<!-- wp:acf/* -->` markup yet. Steps 1–8 still own all output generation.

### Step 1: Strategic Analysis
Read the user's brief. Understand the narrative flow, target audience, and conversion goals.
**Execute a simulated filesystem read** of `./references/module-purpose-guide.md` to map the requirements to specific Gutenberg modules based on their semantic purpose.

Plan the module sequence considering:
- What is the page type? (Homepage → HomeHeader, Inner page → SubHeader)
- What content sections are needed? Map each briefing section to a module.
- What is the conversion goal? Ensure a Contact module is placed near the end.

### Step 2: Color System & Design Context
**Execute a simulated filesystem read** of `./references/module-config-guide.md` (Color System section).

Plan the color rhythm across the full page:
- Assign `background_color` and `text_color` for each planned module.
- Use ONLY valid color combinations from the contrast matrix.
- Never use 3+ consecutive sections with the same background color.
- Reserve `bg-primary-dark` + `text-white` for the Contact CTA section.
- Vary accent colors (`bg-primary-green`, `bg-light-yellow`, `bg-primary`) for visual interest.
- For modules with per-item colors (Cards, TeaserBoxes), plan distinct color schemes per item.

### Step 3: SEO Structure Planning
Plan the heading hierarchy before generating any markup:
- **Only ONE `h1` per page** — always in the first header module (HomeHeader or SubHeader) via `headline_tag_selector`.
- All section-level modules use `h2` via `headline_tag_selector`.
- Sub-elements (row headlines, sublines) use `h3` or `h4`.
- If the briefing mentions SEO keywords, place the primary keyword in the `h1` and the secondary keyword in the first `h2`.
- Ensure heading tags descend logically — never skip levels (no h1 → h4).

### Step 4: Schema Retrieval
You CANNOT guess ACF fields or IDs.
**Execute a simulated filesystem read** of `./references/acf-schemas.md`. Load the required modules and their EXACT `field_xxxx` keys into memory.

For `button_group` fields, check the available `Choices` values in the schema. Use ONLY values that exist in the choices list.

> [!IMPORTANT] Negative Constraints
> - Under no circumstances may you invent, estimate, or probabilistically generate a `field_` identifier.
> - You must perform a rigorous lookup of the exact identifier from the provided schema document.
> - Never use a key that is not perfectly mapped to a `field_` string in the schema.
> - For `button_group` fields, only use values listed in the choices. If no choices are documented, refer to the color system or few-shot examples for valid values.

> [!IMPORTANT] Field Completeness
> Load **every field** declared by the schema for each chosen module — including design/layout fields (`background_color`, `text_color`, alignment selectors, `headline_tag_selector`, `first_item_open`, etc.). These are NOT optional. If the briefing doesn't specify a value, fill with the schema's `default_value` or a sensible default from `module-config-guide.md`. Omitting any schema field causes Gutenberg to drop the block silently — symptom is `<!-- wp:acf/<module> /-->` appearing in the published page with no data.

### Step 5: UX Pattern Validation
**Execute a simulated filesystem read** of `./references/module-config-guide.md` (full document).

Validate your planned module sequence against these UX heuristics:
- **Page ending**: Every page should end with a conversion point (`Contact`) optionally followed by `LatestPosts`.
- **Visual dividers**: Use `Divider` between sections that share the same background color.
- **Visual rhythm**: Don't stack two text-heavy modules (TextModule, TextImage) without a visual break (Quote, HighlightText, Gallery, Numbers, Cards).
- **Social proof placement**: Place testimonials (`Quote`/`Quotation`) after value propositions, not before.
- **Progressive disclosure**: Use `Tabs` or `Steps` for complex information instead of long TextModule blocks.
- **Image alternation**: When using multiple `TextImage` modules, alternate `first_row_image_position` between `left` and `right`.

### Step 6: Draft Generation
**Execute a simulated filesystem read** of `./references/module-config-guide.md` for configuration decision logic.

Generate the JSON payload for each module. Apply the configuration decisions:
- Set `headline_tag_selector` according to the heading hierarchy plan (Step 3).
- Set `background_color` and `text_color` according to the color plan (Step 2).
- Set alignment, image ratio, and variant fields according to the config guide.
- For repeater fields, use the correct `{name}_{index}_{field}` syntax.
- Include the repeater count field (e.g., `"cards":3`, `"teasers":3`).
- **Use the matching example in `few-shot-examples.md` as a complete template for each module.** Do not remove fields the example shows, even if the briefing didn't mention them.

> [!IMPORTANT] German typographic quotes
> When generating German content, use typographic quotes: `„` (U+201E) opening + `"` (U+201C) closing. NEVER use ASCII `"` inside string content — the closing ASCII `"` will terminate the JSON string and break the block. Symptom: a single `„word"` pair somewhere in the page reduces multiple downstream blocks to empty stubs. If straight ASCII quotes are unavoidable, JSON-escape them as `\"`.

> [!IMPORTANT] No `<p>` wrappers in content fields
> Do NOT wrap text in `<p>...</p>` paragraphs. ACF wysiwyg fields run `wpautop()` at render time and convert plain text with blank-line separators (`\n\n`) into proper paragraphs automatically. Emitting `<p>` manually is redundant and is the single largest source of the empty-block bug.
>
> - Single paragraph: `"content":"Just plain text."` (no tags at all)
> - Multiple paragraphs: `"content":"First paragraph.\n\nSecond paragraph.\n\nThird paragraph."` — `\n\n` is two literal newlines in the JSON string, which JSON encodes as `\n\n`. wpautop renders each chunk as its own `<p>`.
>
> This applies to every wysiwyg / textarea / repeater content field. Saves an entire class of escape errors.

> [!IMPORTANT] HTML escape for legitimate inline tags
> Plain text and `\n\n` paragraphs need NO HTML at all. Only emit tags when the content actually requires inline semantics:
> - Bold / emphasis: `<strong>` / `<em>`
> - Bulleted / numbered lists: `<ul><li>...</li></ul>` / `<ol><li>...</li></ol>`
> - Inline links: `<a href="...">...</a>`
> - Hard line break inside a paragraph: `<br>`
>
> When you DO need a tag, every literal `<` MUST be `<` and every `>` MUST be `>` (Unicode escapes that the JSON parser decodes back to `<`/`>`). Example:
> - Wrong: `"content":"<ul><li>Item</li></ul>"`
> - Right: `"content":"<ul><li>Item</li></ul>"`
>
> This matches Gutenberg's native block serializer and is required for the `--draft` upload path; raw `<`/`>` may survive a quick manual paste but is silently corrupted by the WP REST API content sanitizer.

### Step 7: Rigorous Verification
Verify the generated output against ALL previous steps:
1. **Field keys**: Does every `_fieldname` have the correct `field_xxxxx` mapping from the schema?
2. **Color contrast**: Are all `background_color` + `text_color` combinations valid per the contrast matrix?
3. **Heading hierarchy**: Is there exactly one `h1`? Do headings descend logically?
4. **Repeater syntax**: Are repeater items correctly indexed (`_0_`, `_1_`, `_2_`)? Is the count field present?
5. **Required fields**: Does every block have `"name"`, `"data"`, and `"mode":"edit"`?
6. **Module sequence**: Does the page flow logically? Is Contact near the end?
7. **Field completeness**: Every field declared in `acf-schemas.md` for the chosen module is present in `data`, with both `name` and `_name` (mapping) keys. Especially the design/layout fields (`background_color`, `text_color`, alignment selectors, `headline_tag_selector`, `first_item_open`).
8. **JSON quote safety**: Every string value's content is JSON-parseable. No raw ASCII `"` inside strings unless escaped as `\"`. Mixed German `„`/ASCII `"` pairs are forbidden.
9. **HTML escape**: Every `<` and `>` inside any string value is emitted as `<` / `>`. Verify by grep — no raw `<p>`, `<strong>`, `<ul>`, `<li>`, `</`, etc. should appear inside the JSON portion of any block.
10. **Validator pass**: After assembling the markup, run the validator script and resolve every reported `severity: "error"` issue before delivery.

### Step 8: Output Formatting
**Execute a simulated filesystem read** of `./references/few-shot-examples.md` to verify your JSON wrapping matches the exact syntax.

Your final output must consist exclusively of valid HTML comment structures wrapping valid JSON payloads. ALWAYS wrap your output in an ```html markdown block so the user can easily copy it from their IDE chat view. Do not output conversational filler.

Each block is a SINGLE LINE — no line breaks inside the `<!-- wp:acf/modulename ... /-->` HTML comment.

**Validate before delivery.** Pipe the assembled markup (without the surrounding ```html``` fence) through the validator:

```
printf '%s' "$RAW_MARKUP" | node ${CLAUDE_PLUGIN_ROOT}/scripts/validate-blocks.mjs
```

The script returns JSON: `{ valid, blocks, errors, warnings, issues }`.

- If `valid` is `true`: proceed to Step 9.
- If `valid` is `false`: fix every issue with `severity: "error"` (each issue includes a `hint` with the exact field key and corrective action), regenerate the affected block(s), and re-run the validator. Cap at **2 retries**; on the third failure, surface the validator output to the user along with the partial markup so they can decide whether to paste manually anyway.

`severity: "warn"` items (e.g. mixed `„`/ASCII quote pairs) should be addressed but do not block delivery.

### Step 9: Output Routing

After Step 8 has rendered the markup AND the validator returned `valid: true`, deliver it according to the output mode passed by the calling command (`clipboard`, `draft`, `both`, or `ask`).

> [!IMPORTANT] Validator gate
> Do not deliver (clipboard or draft) until the Step 8 validator passed at least once in this run. If validation never passed:
> - For `--clipboard` or `--both`: emit the markup with a `⚠ Markup did not pass validation — paste at your own risk` prefix banner.
> - For `--draft`: refuse the upload and tell the user to address the issues. Auto-uploading invalid blocks would silently corrupt their WP page.

**Mode resolution:**
- If the command passed `clipboard` / `draft` / `both`, use it directly.
- If it passed `ask` (default — no flag given), call `AskUserQuestion`:
  > "How should I deliver this page?" — options: **Both (clipboard + draft)** (recommended) / **Clipboard only** / **Draft only**.
  - If `AskUserQuestion` is unavailable (non-interactive context), fall back to `clipboard` to preserve the legacy behavior.

**Clipboard delivery** (`clipboard` and `both`):
1. Pipe the ```html``` fenced markup to `pbcopy` via Bash.
2. Print: `✓ Copied to clipboard.`

**Draft delivery** (`draft` and `both`):

1. **Resolve the title.** Run via Bash, passing the raw briefing text on stdin:
   ```
   node -e "import('${CLAUDE_PLUGIN_ROOT}/scripts/title-extractor.mjs').then(async m => { let s=''; for await (const c of process.stdin) s+=c; const t = m.extractTitle(s); console.log(JSON.stringify({title: t})); })" <<< "$BRIEFING_TEXT"
   ```
   - If a title comes back: ask the user via `AskUserQuestion` — "Use **'<title>'** as the WP page title?" with options **Use this title** (recommended) / **Edit title** (use the "Other" free-text answer to capture the new value).
   - If `null`: ask the user with a free-text question for the title. Don't proceed without one.

2. **Verify credentials.** Run:
   ```
   node ${CLAUDE_PLUGIN_ROOT}/scripts/hp-wp-config.mjs --check
   ```
   - If exit code is non-zero, tell the user: "WordPress credentials are not configured. Run `/hp-wp:hp-config` first." and abort the draft path. (If mode is `both`, the clipboard step has already succeeded — that's fine.)

3. **Upload.** Pipe the raw block markup (no surrounding ```html``` fence — just the `<!-- wp:acf/... /-->` lines) to the publish script:
   ```
   printf '%s' "$RAW_MARKUP" | node ${CLAUDE_PLUGIN_ROOT}/scripts/hp-wp-publish.mjs --title "$TITLE"
   ```
   The script prints a single JSON line on success: `{"id":123,"editUrl":"https://.../wp-admin/post.php?post=123&action=edit","status":"draft","slug":"..."}`.

4. **Report the outcome.**
   - On success (exit 0): print `✓ Draft created: [Edit in WP Admin](<editUrl>)` using the markdown link form so the user can click through.
   - On exit code **2** (auth): print `✗ WordPress rejected the credentials. Run /hp-wp:hp-config to update them.`
   - On exit code **3** (network): print `✗ Could not reach WordPress (network or timeout). Markup is still on the clipboard if --both was used.`
   - On exit code **4** (validation): show the WP error message verbatim from stderr.

**Both mode** runs clipboard first, then draft — so the user always has the markup locally even if the upload fails.

> [!IMPORTANT] Step 9 must NOT alter the markup itself. The clipboard receives the same ```html```-fenced output Step 8 produced; the publish script receives only the raw `<!-- wp:acf/... /-->` lines (strip the markdown fence).
