# Module Semantic Purpose and Application Guide

Use this guide to determine which ACF Gutenberg Module to deploy based on the user's briefing.

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
| **HighlightText (`acf/highlighttext`)** | Eye-catching statement section to break up text flows and draw attention to critical value propositions or thematic shifts. Supports two layout variants. | Background color, variant (`row` for text+image side-by-side, `column` for stacked), headline, subline, button, image with ratio selector. |
| **StickyColumn (`acf/stickycolumn`)** | Split layout with a sticky sidebar (text) and scrolling content blocks on the opposite side. Use for detailed service descriptions or feature breakdowns. | Overline, headline, subline, main text (WYSIWYG), button, repeater of blocks (title, description, button), module variation, separate bg/text colors for main and blocks. |

## Social Proof & Testimonials

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **Quotation (`acf/quotation`)** | Formal single-quote testimonial with full attribution. Use for executive statements, client testimonials, or key stakeholder quotes. | Overline, headline, subline, quote text, person image, person name, person position, alignment control. |
| **Quote (`acf/quote`)** | Multi-quote carousel with images. Use when showcasing multiple testimonials or team quotes in a slider format. Differs from Quotation (single, formal). | Headline, quotes repeater (each with image, image ratio, quote text, name, position). |

## Navigation & Discovery

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **TeaserBoxes (`acf/teaserboxes`)** | Primary navigational hub directing users to distinct service pillars or sub-pages. Typically displays 3 boxes with individual styling. | Headline, teasers repeater (each with headline, subline, button, background type color/image, per-teaser bg and text colors, mobile visibility toggle). |
| **Cards (`acf/cards`)** | Versatile content grid for feature lists, team grids, blog rollups, or service overviews. Highly configurable with per-card color control. | Headline, cards repeater (title, text, image, per-card bg and text color), cards_per_row (2-4), numbered_cards toggle, narrow_container, cards_size (auto/fixed), image_first toggle, title font toggle. |
| **QuickLinks (`acf/quicklinks`)** | Columnar link navigation hub. Use for sitemap-style sections, resource hubs, or organized link collections. | Headline, menus_repeater (each with title and nested links_repeater of single_link items), menus_in_one_row (3-5), alignment controls. |
| **Tabs (`acf/tabs`)** | Progressive disclosure of complex information using tabbed cards. Ideal for features, services, or categorized content without vertical scrolling. | Headline, card_type (`icon` for visual tabs, `numbered` for sequential, `none` for plain text), cards repeater (icon, title, description). |
| **Steps (`acf/steps`)** | Sequential process steps or workflow instructions. Simpler than Tabs, focused on linear progression. | Headline, numbered_cards toggle, cards repeater (title, description). |
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
| **Contact (`acf/contact`)** | Terminal conversion CTA section. Provides direct routing to a team member with high-contrast styling. Almost always placed near the end of a page. | Background color (typically `bg-primary-dark`), text color (typically `text-white`), headline, subline, headline/subline tag selectors, button, team_member (post object reference to Team CPT). |

## Utility & Structural Modules

| ACF Gutenberg Module | Semantic Purpose and Editorial Application | Structural Data Requirements |
| :--- | :--- | :--- |
| **Divider (`acf/divider`)** | Visual separator between sections. Use between sections that share the same background color or to create visual breathing room. | Background color, divider_color, direction. |
| **EndSideContent (`acf/endsidecontent`)** | Structural marker for insights/blog posts. Marks the end of main article content for sidebar layout purposes. No user-visible fields. | Message field only (no configurable content). |
| **Numbers (`acf/numbers`)** | Statistics/metrics display with animated counters. Use for quantitative proof points (years of experience, projects completed, team size). | Headline, numbers repeater (title as the number value, description as label), background/text colors. |
| **Badges (`acf/badges`)** | Award/certification gallery with optional links. Use for displaying certifications, partner badges, or award logos with optional click-through. | Headline, badges_gallery (simple gallery), badges_repeater (image + link pairs for clickable badges). |
