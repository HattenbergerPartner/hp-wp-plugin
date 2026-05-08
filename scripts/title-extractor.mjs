/**
 * title-extractor.js
 *
 * Extracts a page title from briefing markdown. Pure function, no I/O.
 *
 * Priority:
 *   1. YAML frontmatter `seite:` (German "page", project convention)
 *   2. YAML frontmatter `title:`
 *   3. First `# H1` heading
 *   4. `**Goal:**` line — first sentence, trimmed
 *   5. null (caller should prompt)
 */

const FRONTMATTER_RE = /^---\s*\n([\s\S]*?)\n---\s*\n/;
const H1_RE = /^#\s+(.+?)\s*$/m;
const GOAL_RE = /^\*\*Goal:\*\*\s*(.+?)\s*$/m;

function parseFrontmatterValue(block, key) {
    const re = new RegExp(`^${key}\\s*:\\s*(.+?)\\s*$`, 'mi');
    const m = block.match(re);
    if (!m) return null;
    let value = m[1].trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
    }
    return value || null;
}

export function extractTitle(briefingText) {
    if (typeof briefingText !== 'string' || !briefingText.trim()) return null;

    const fm = briefingText.match(FRONTMATTER_RE);
    if (fm) {
        const block = fm[1];
        const seite = parseFrontmatterValue(block, 'seite');
        if (seite) return seite;
        const title = parseFrontmatterValue(block, 'title');
        if (title) return title;
    }

    const body = fm ? briefingText.slice(fm[0].length) : briefingText;

    const h1 = body.match(H1_RE);
    if (h1) return h1[1].trim();

    const goal = body.match(GOAL_RE);
    if (goal) {
        const first = goal[1].split(/(?<=[.!?])\s/)[0].trim();
        return first.replace(/[.,;:]+$/, '') || null;
    }

    return null;
}
