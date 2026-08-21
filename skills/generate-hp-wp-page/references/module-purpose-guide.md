# Module Semantic Purpose and Application Guide

Use this guide to determine which ACF Gutenberg Module to deploy based on the user's briefing.

> **Only modules in the live registry exist.** Step 0.5 returns `registered_modules`; a module not in that list (or not in `acf-schemas.md`) must never be emitted — WordPress stores it and renders nothing. Removed in June 2026 and **no longer available**: `acf/contact` → use `acf/contactextended`; `acf/quote` / `acf/quotation` → use `acf/quotereveal`; `acf/steps` / `acf/tabs` → use `acf/stepsscroll` (process) or `acf/texttext` / `acf/textbullets` (categorised content); `acf/numbers` → use `acf/textbadges`; `acf/highlighttext` → use `acf/cardsanimated` or `acf/quotereveal`; `acf/textlinks` → use `acf/quicklinks`.

## Header Modules

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **HomeHeader (`acf/homeheader`)** | Primary above-the-fold entry point for a landing page. Captures immediate attention and drives a single primary CTA. Use only once per site on the main homepage. | Concise main headline (supports `<br>` and `<span>` for styling), optional subline, one high-priority routing link (button). |
| **SubHeader (`acf/subheader`)** | Transitional hero section for secondary/inner pages. Structural hierarchy below root. Use on every page that is not the homepage. | HTML tag selector, descriptive paragraph, featured image, up to two actionable links (buttons repeater). |

## Content Modules

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **TextModule (`acf/textmodule`)** | Standard body copy section. Most versatile module for articles, descriptions, and general text content. Supports background images. | Overline, headline, subline, WYSIWYG text body, buttons repeater, background type (color/image), alignment controls. |
| **TextImage (`acf/textimage`)** | Pairing text with an image in a side-by-side layout. Use for feature descriptions, service explanations, or storytelling where visual context is needed. | Overline, headline, subline, repeater of rows (each with image, overline, headline, description, button), image position (left/right alternating), image ratio, content box background. |
| **TextText (`acf/texttext`)** | Two-column text section: headline + description on one side, a list of short items (optional titles) on the other. Use for pain-point lists, "what you get" lists, or FAQ-style statements without accordion. | Background/text colors, headline + tag selector, description, button + variation, items repeater (title, text). |
| **TextBullets (`acf/textbullets`)** | Headline with titled bullet points and a CTA. Use for requirement lists, feature checklists, or categorised arguments (replaces the removed Tabs for non-sequential content). | Headline + tag selector, description, headline_alignment, bullets repeater (title, wysiwyg text), cta link, button_variation. |
| **TextBadges (`acf/textbadges`)** | Short statement with up to three large stat badges (e.g. "100 %", "20+"). The module for quantitative proof points — replaces the removed Numbers module. | Background/text colors, overline, main_text (wysiwyg), badges repeater (stat, label) — exactly 3 recommended. |
| **CardsAnimated (`acf/cardsanimated`)** | Three animated claim cards with highlighted words in the title. Use for promises/USPs or "what's included" sections; also works as a visual break between text-heavy modules. | Text color, headline + tag selector, subline, button + variation, cards repeater (title with `<strong>` highlights, text) — exactly 3 recommended. |
| **StickyColumn (`acf/stickycolumn`)** | Split layout with a sticky sidebar (text) and scrolling content blocks on the opposite side. Use for detailed service descriptions or feature breakdowns. | Overline, headline, subline, main text (WYSIWYG), button, repeater of blocks (title, description, button), module variation, separate bg/text colors for main and blocks. |

## Social Proof & Testimonials

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **QuoteReveal (`acf/quotereveal`)** | The testimonial/statement module. One large quote with optional image; attribution goes at the end of the quote text. Optional reveal overlay animation over the following module. | Background/text colors, quote (textarea), image, reveal_overlay (true_false). |
| **CaseSingle (`acf/casesingle`)** | Teaser for a single reference project with photo, badge, client name and CTA to the case page. Use as social proof after a value proposition. | Image, case_study_highlight (badge text), overline, subline (client), tekst (wysiwyg), cta link. |

## Navigation & Discovery

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **TeaserBoxes (`acf/teaserboxes`)** | Primary navigational hub directing users to distinct service pillars or sub-pages. Typically displays 3 boxes with individual styling. | Headline, teasers repeater (each with headline, subline, button, background type color/image, per-teaser bg and text colors, mobile visibility toggle). |
| **Cards (`acf/cards`)** | Versatile content grid for feature lists, team grids, blog rollups, or service overviews. Highly configurable with per-card color control. | Headline, cards repeater (title, text, image, per-card bg and text color), cards_per_row (2-4), numbered_cards toggle, narrow_container, cards_size (auto/fixed), image_first toggle, title font toggle. |
| **QuickLinks (`acf/quicklinks`)** | Columnar link navigation hub. Use for sitemap-style sections, resource hubs, or organized link collections. | Headline, menus_repeater (each with title and nested links_repeater of single_link items), menus_in_one_row (3-5), alignment controls. |
| **StepsScroll (`acf/stepsscroll`)** | Scroll-driven process timeline with numbered steps, optional timeframe and link per step. The module for sequential processes and project phases (replaces the removed Steps / Tabs). | Headline + tag selector, steps repeater (title, timeframe, wysiwyg description, link, digit_image, per-step accent/background/text colors), background/digit/text colors. |
| **CardsExtended (`acf/cardsextended`)** | Comparison cards for offers/models with introduction text. Use when presenting 2–3 delivery models or packages side by side. | Background/text colors, headline + tag selector, introduction, extended_cards repeater (see schema). |
| **CardsFull (`acf/cardsfull`)** | Full-width pricing cards with price text, description and link, plus optional "included" / "influences price" lists. Use for price communication. | Background/text colors, headline + tag selector, introduction, full_cards repeater (title, price_text, description, card_link), included/influences headings + items. |
| **CardsFullText (`acf/cardsfulltext`)** | Text-focused variant of CardsFull for longer card copy without pricing. | See schema. |
| **TeaserText (`acf/teasertext`)** | Text teaser with CTA pointing to a related page or offer. | See schema. |
| **StepsExtended (`acf/stepsextended`)** | Pricing/feature comparison cards with rich content. Use for pricing tables, plan comparisons, or detailed feature showcases. | Overline, headline, subline, cards repeater (title, subline, price, WYSIWYG text, button, icon, features repeater with icon+text), card_signature style, separate card/accent colors, button variation. |

## Media Modules

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **Video (`acf/video`)** | Prominent video embed section. Supports YouTube videos with full surrounding text context. | Overline, headline, subline, button, video_id (YouTube ID only), video_type, alignment controls. |
| **GalleryWallSimple (`acf/gallerywallsimple`)** | Visual grid/mosaic of related images. Use for portfolio displays, event recaps, or product showcases. | Headline, images gallery, layout_width (boxed/full), image_ratio, images_gap, images_in_one_line (grid columns count). |
| **Image (`acf/image`)** | Simple standalone image placement with layout control. Use when only an image is needed without accompanying text. | Image, background_color, layout_width, image_ratio. |
| **LogoSlider (`acf/logoslider`)** | Infinite-scroll logo marquee for client/partner logos. Use for social proof through brand association. | Background color, headline, logos gallery. |

## Dynamic Content Modules

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **LatestPosts (`acf/latestposts`)** | Dynamic grid of latest insights/blog posts. Typically the final content section on a page before the footer. | Background/text colors, headline, posts_selection (`auto` or `manual`), category filter, posts_to_display count, promo_text, button link. |
| **PostsSlider (`acf/postsslider`)** | Dynamic horizontal post carousel. Filters by post type (insights/cases) and category. Use for "latest work" or "recent articles" in a slider format. | Background/text colors, post_type selector, category filters (insights/cases), title, button, variation. |

## Conversion & Contact

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **ContactExtended (`acf/contactextended`)** | Terminal conversion CTA with HELLO wordmark, intro text, CTA button and one or more contact person cards. The only contact module — place near the end of every page. | Background color (typically `bg-primary-dark`), text color (typically `text-white`), hello_gradient_color + hello_gradient_end_color, headline + tag selector, introduction, cta + button_variation, partner_section_label, contacts repeater (photo, person_name, role, nested contact_entries repeater of label/value). |

## Utility & Structural Modules

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **Divider (`acf/divider`)** | Visual separator between sections. Use between sections that share the same background color or to create visual breathing room. | Background color, divider_color, direction. |
| **EndSideContent (`acf/endsidecontent`)** | Structural marker for insights/blog posts. Marks the end of main article content for sidebar layout purposes. No user-visible fields. | Message field only (no configurable content). |
| **Badges (`acf/badges`)** | Award/certification gallery with optional links. Use for displaying certifications, partner badges, or award logos with optional click-through. | Headline, badges_gallery (simple gallery), badges_repeater (image + link pairs for clickable badges). |
