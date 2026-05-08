# Page Structure Patterns

*Auto-generated from 27 published pages/posts on the live WordPress site.*
*Do not edit manually — regenerate with `npm run sync-wp`.*

---

## Real Page Blueprints

These are the actual module sequences used on published pages. Use them as reference when planning new pages.

### Pages

**Test-Uli_Website-Relaunch-Agentur_v2** (`/test-uli_website-relaunch-agentur_v2`):
`homeheader → badges(bg-light-yellow) → cards(bg-primary-green) → stickycolumn → cards → textmodule(bg-primary) → tabs(type:numbered) → stickycolumn(bg-light-yellow) → stepsextended → highlighttext(bg-light-yellow, variant:row) → tabs(type:none) → contactextended(bg-primary-dark)`

**Test-Uli_Website-Relaunch-Agentur_v1** (`/test-uli_website-relaunch-agentur_v1`):
`subheader → logoslider(bg-light-yellow) → numbers(bg-primary-green) → textmodule → textmodule → highlighttext(bg-primary, variant:column) → textimage → steps → cards(bg-light-yellow) → textimage(bg-light-yellow) → accordion(bg-light-yellow) → contact(bg-primary-dark)`

**new-modules** (`/new-modules`):
`subheader → texttext → textbadges → image → textbullets → textlinks → accordion → casesingle → teasertext → contactextended(bg-primary-dark) → cardsextended → cardsfull → textimage → cardsfulltext`

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
| `acf/textmodule` | 30 |
| `acf/highlighttext` | 27 |
| `acf/textimage` | 13 |
| `acf/divider` | 13 |
| `acf/gallerywallsimple` | 12 |
| `acf/contact` | 11 |
| `acf/cards` | 10 |
| `acf/accordion` | 10 |
| `acf/latestposts` | 10 |
| `acf/image` | 8 |
| `acf/endsidecontent` | 7 |
| `acf/tabs` | 5 |
| `acf/subheader` | 4 |
| `acf/teaserboxes` | 4 |
| `acf/homeheader` | 3 |
| `acf/logoslider` | 3 |
| `acf/steps` | 3 |
| `acf/quote` | 3 |
| `acf/quotation` | 3 |
| `acf/badges` | 2 |
| `acf/stickycolumn` | 2 |
| `acf/contactextended` | 2 |
| `acf/numbers` | 2 |
| `acf/video` | 2 |
| `acf/quicklinks` | 2 |
| `acf/postsslider` | 2 |
| `acf/stepsextended` | 1 |
| `acf/texttext` | 1 |
| `acf/textbadges` | 1 |
| `acf/textbullets` | 1 |
| `acf/textlinks` | 1 |
| `acf/casesingle` | 1 |
| `acf/teasertext` | 1 |
| `acf/cardsextended` | 1 |
| `acf/cardsfull` | 1 |
| `acf/cardsfulltext` | 1 |

## Common Block Adjacency Patterns

These pairs appear frequently together in sequence:

| Pattern | Occurrences |
| :--- | :--- |
| `acf/textmodule → acf/textmodule` | 10 |
| `acf/highlighttext → acf/divider` | 10 |
| `acf/divider → acf/textimage` | 8 |
| `acf/endsidecontent → acf/contact` | 7 |
| `acf/textmodule → acf/endsidecontent` | 5 |
| `acf/highlighttext → acf/gallerywallsimple` | 4 |
| `acf/cards → acf/cards` | 4 |
| `acf/textmodule → acf/highlighttext` | 3 |
| `acf/contact → acf/latestposts` | 3 |
| `acf/contact → acf/highlighttext` | 3 |
| `acf/highlighttext → acf/latestposts` | 3 |
| `acf/image → acf/textmodule` | 3 |
| `acf/textmodule → acf/image` | 3 |
| `acf/textmodule → acf/gallerywallsimple` | 3 |
| `acf/image → acf/accordion` | 3 |

## Observed Design Rules

Based on analysis of real pages:

- **Contact placement**: The `acf/contact` module is consistently placed near the end of pages, typically as the second-to-last or third-to-last block.
- **LatestPosts as closer**: `acf/latestposts` frequently appears as the final block on pages.
- **Page opening**: Pages use `acf/homeheader` (homepage) or `acf/subheader` (inner pages) as the first block.
- **Visual breaks**: `acf/divider`, `acf/highlighttext`, and `acf/quote` are used to break up sequences of content-heavy modules.
- **Color alternation**: Consecutive blocks rarely share the same non-default background color.
