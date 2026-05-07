# Page Structure Patterns

*Auto-generated from 25 published pages/posts on the live WordPress site.*
*Do not edit manually — regenerate with `npm run sync-wp`.*

---

## Real Page Blueprints

These are the actual module sequences used on published pages. Use them as reference when planning new pages.

### Pages

**new-modules** (`/new-modules`):
`subheader → texttext → textbadges → image → textbullets → textlinks → accordion → casesingle → teasertext → contactextended(bg-primary-dark) → cardsextended → cardsfull → textimage`

**Modules-Overview** (`/modules-overview`):
`subheader → video → textmodule → textimage → teaserboxes → tabs(type:icon) → tabs(type:numbered) → tabs(type:none) → steps → steps → quote → quotation → quicklinks → logoslider → latestposts → homeheader → highlighttext(variant:column) → highlighttext(variant:row) → gallerywallsimple → contact(bg-primary-dark) → cards → cards → cards → cards → cards → accordion`

**WordPress-Agentur** (`/wordpress-entwicklung-und-betreuung`):
`subheader → badges → quote → numbers(bg-primary-green) → postsslider → cards → video → teaserboxes → highlighttext(variant:column) → textmodule → divider → contact(bg-primary-green) → latestposts`

**Home** (`/home`):
`homeheader → postsslider(bg-primary) → logoslider → highlighttext(variant:row) → cards → divider → highlighttext(bg-primary-green, variant:column) → quote(bg-light-yellow) → quicklinks(bg-light-yellow) → divider(bg-light-yellow) → contact(bg-primary) → highlighttext(bg-primary, variant:column) → latestposts(bg-light-yellow)`

### Insights (Blog Posts)

**User-Rollen-Konzepte**:
`textmodule → textmodule → textmodule → textmodule → endsidecontent → contact(bg-primary-green) → latestposts`

**Was ist ein technischer Relaunch?**:
`textmodule → textmodule → textimage → accordion → endsidecontent → contact(bg-primary-green) → textmodule → highlighttext(variant:column) → latestposts`

**Relaunch: Brauche ich ein Archiv für die alte Website?**:
`textmodule → textmodule → textmodule → quotation → image → textmodule → endsidecontent → contact(bg-primary-green) → teaserboxes → latestposts`

**Was ist SSL und HTTPS?**:
`textmodule → textmodule → image → textmodule → endsidecontent → contact(bg-primary-green) → highlighttext(variant:column) → latestposts`

**Warum brauchen WordPress-Seiten regelmäßige Updates?**:
`quotation → textmodule → textmodule → textmodule → image → textmodule → gallerywallsimple(bg-primary-green) → textmodule → endsidecontent → contact(bg-primary-green) → highlighttext(variant:column) → accordion → image → accordion → latestposts(bg-primary-green)`

### Cases

**Kurz Kunze**:
`highlighttext(variant:row) → divider → gallerywallsimple(bg-primary-green)`

**5SWAN**:
`highlighttext(variant:column) → divider → textimage(bg-primary-green) → gallerywallsimple(bg-primary-green)`

**Karo Events**:
`highlighttext(variant:row) → divider → textimage(bg-primary-green)`

**Brigitte Vielhaus**:
`gallerywallsimple`

**Hautmedizin Schillerstraße**:
`highlighttext(bg-light-yellow, variant:column) → gallerywallsimple(bg-light-yellow)`

---

## Block Usage Frequency

| Block | Usage Count |
| :--- | :--- |
| `acf/textmodule` | 27 |
| `acf/highlighttext` | 25 |
| `acf/divider` | 13 |
| `acf/gallerywallsimple` | 12 |
| `acf/textimage` | 11 |
| `acf/latestposts` | 10 |
| `acf/contact` | 10 |
| `acf/accordion` | 9 |
| `acf/image` | 8 |
| `acf/cards` | 7 |
| `acf/endsidecontent` | 7 |
| `acf/teaserboxes` | 4 |
| `acf/subheader` | 3 |
| `acf/tabs` | 3 |
| `acf/quote` | 3 |
| `acf/quotation` | 3 |
| `acf/video` | 2 |
| `acf/steps` | 2 |
| `acf/quicklinks` | 2 |
| `acf/logoslider` | 2 |
| `acf/homeheader` | 2 |
| `acf/postsslider` | 2 |
| `acf/texttext` | 1 |
| `acf/textbadges` | 1 |
| `acf/textbullets` | 1 |
| `acf/textlinks` | 1 |
| `acf/casesingle` | 1 |
| `acf/teasertext` | 1 |
| `acf/contactextended` | 1 |
| `acf/cardsextended` | 1 |
| `acf/cardsfull` | 1 |
| `acf/badges` | 1 |
| `acf/numbers` | 1 |

## Common Block Adjacency Patterns

These pairs appear frequently together in sequence:

| Pattern | Occurrences |
| :--- | :--- |
| `acf/highlighttext → acf/divider` | 10 |
| `acf/textmodule → acf/textmodule` | 9 |
| `acf/divider → acf/textimage` | 8 |
| `acf/endsidecontent → acf/contact` | 7 |
| `acf/textmodule → acf/endsidecontent` | 5 |
| `acf/highlighttext → acf/gallerywallsimple` | 4 |
| `acf/cards → acf/cards` | 4 |
| `acf/contact → acf/latestposts` | 3 |
| `acf/contact → acf/highlighttext` | 3 |
| `acf/highlighttext → acf/latestposts` | 3 |
| `acf/image → acf/textmodule` | 3 |
| `acf/textmodule → acf/image` | 3 |
| `acf/textmodule → acf/gallerywallsimple` | 3 |
| `acf/image → acf/accordion` | 3 |
| `acf/textimage → acf/gallerywallsimple` | 3 |

## Observed Design Rules

Based on analysis of real pages:

- **Contact placement**: The `acf/contact` module is consistently placed near the end of pages, typically as the second-to-last or third-to-last block.
- **LatestPosts as closer**: `acf/latestposts` frequently appears as the final block on pages.
- **Page opening**: Pages use `acf/homeheader` (homepage) or `acf/subheader` (inner pages) as the first block.
- **Visual breaks**: `acf/divider`, `acf/highlighttext`, and `acf/quote` are used to break up sequences of content-heavy modules.
- **Color alternation**: Consecutive blocks rarely share the same non-default background color.
