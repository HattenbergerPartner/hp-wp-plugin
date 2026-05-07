# Module Configuration Decision Guide

This guide documents the correct values and decision logic for ACF `button_group` configuration fields. Use this to select appropriate settings based on the page context and briefing requirements.

---

## Heading Hierarchy (`headline_tag_selector`)

**Rule: Only ONE `h1` per page. All other sections use `h2` or lower.**

| Position on Page | Value | When to Use |
| :--- | :--- | :--- |
| First header module (HomeHeader/SubHeader) | `h1` | Always — the page's primary heading for SEO |
| All section-level modules | `h2` | Default for every content section |
| Sub-sections within a module | `h3` or `h4` | e.g., `row_headline_tag_selector` in TextImage, `subline_tag_selector` in Quotation |

**SEO Note:** Place the primary keyword in the `h1` headline. Secondary keywords should appear in the first `h2` section.

---

## Color System

### Available Background Colors (`background_color`)
| Value | Hex | Strategic Use |
| :--- | :--- | :--- |
| `bg-default` | `#ffffff` | White/light neutral — body content, text-heavy areas |
| `bg-primary` | `#1d47ed` | Brand blue — authority sections, key value propositions |
| `bg-primary-green` | `#dcf96b` | Yellow-green accent — warm highlights, secondary features |
| `bg-primary-dark` | `#112887` | Dark blue — high-contrast CTAs, contact sections |
| `bg-light-yellow` | `#faf9f4` | Soft yellow — gentle highlights, testimonials, warm emphasis |

### Available Text Colors (`text_color`)
| Value | Use With |
| :--- | :--- |
| `text-default` | `bg-default`, `bg-primary-green`, `bg-light-yellow` |
| `text-white` | `bg-primary`, `bg-primary-dark` |
| `text-primary` | `bg-default`, `bg-primary-green`, `bg-light-yellow` (accent text) |

### Valid Color Combinations (WCAG AA Contrast)
| Background | Text | Contrast | Status |
| :--- | :--- | :--- | :--- |
| `bg-default` | `text-default` | High | Safe |
| `bg-default` | `text-primary` | High | Safe |
| `bg-primary` | `text-white` | High | Safe |
| `bg-primary-dark` | `text-white` | High | Safe |
| `bg-primary-green` | `text-default` | Medium-High | Safe |
| `bg-light-yellow` | `text-default` | Medium-High | Safe |
| `bg-primary` | `text-default` | Low | AVOID — poor contrast |
| `bg-primary-green` | `text-white` | Low | AVOID — poor contrast |

### Color Rhythm Rules
- Never use 3+ consecutive sections with the same background color
- Alternate between light (`bg-default`) and accent/dark backgrounds
- Use `bg-primary-dark` sparingly — reserve for Contact or key CTA sections
- When adjacent sections share a background, insert a `Divider` module between them

### Per-Module Color Overrides
Some modules have per-item color controls in addition to the module-level colors:
- **Cards**: Each card has `card_background_color` and `card_text_color` — vary these across cards for visual interest
- **TeaserBoxes**: Each teaser has `background_colors` and `text_colors` — use distinct colors per teaser
- **StepsExtended**: Has `card_background_color`, `card_text_color`, and `accent_color` for detailed control
- **StickyColumn**: Has `block_background_color` and `block_text_color` for the scrolling blocks

---

## Alignment Fields

### `overlineheadlinesubline_alignment` / `headline_alignment`
| Value | When to Use |
| :--- | :--- |
| `left` | Default for most modules. Standard reading direction. |
| `center` | Standalone highlight sections, hero-like areas, single-focus content |

### `text_element_position` (TextModule)
| Value | When to Use |
| :--- | :--- |
| `left` | Default — standard text layout |
| `center` | Short centered statements, announcements |

### `module_alignment` (Quotation)
| Value | When to Use |
| :--- | :--- |
| `left` | Default for content-heavy pages |
| `center` | Standalone testimonial highlight |

---

## Image Configuration

### `image_ratio`
| Value | When to Use |
| :--- | :--- |
| `16-9` | Hero/landscape contexts, video thumbnails, wide content |
| `4-3` | General content images, balanced proportions |
| `1-1` | Portraits, team photos, square thumbnails, logo displays |
| `auto` | Let the original image proportions determine the ratio |

### `first_row_image_position` (TextImage)
| Value | Rule |
| :--- | :--- |
| `left` | Default for first TextImage on a page |
| `right` | Alternate for subsequent TextImage modules — creates visual rhythm |

**Pattern:** When using multiple TextImage modules, alternate `left` → `right` → `left`.

### `image_wider` (TextImage)
| Value | When to Use |
| :--- | :--- |
| `"0"` | Default — balanced text/image split |
| `"1"` | When the image is the primary focus and text is secondary |

---

## Card & Tab Configuration

### `card_type` (Tabs)
| Value | When to Use |
| :--- | :--- |
| `icon` | Visual tabs with icon images — use when briefing provides icons or distinct visual identifiers |
| `numbered` | Sequential/process content — "Step 1, Step 2, Step 3" flow |
| `none` | Plain text tabs — use for simple category switching |

### `cards_per_row` (Cards)
| Value | When to Use |
| :--- | :--- |
| `2` | Detailed content cards with longer text |
| `3` | Standard feature/service overview — most common |
| `4` | Quick overview, icon-based, minimal text per card |

### `cards_size` (Cards)
| Value | When to Use |
| :--- | :--- |
| `auto` | Cards fill the container width evenly (default) |
| `fixed` | Fixed-width cards — use with `narrow_container:"1"` for contained layouts |

### `numbered_cards` (Cards / Steps)
| Value | When to Use |
| :--- | :--- |
| `"0"` | Feature lists, team grids, general content cards |
| `"1"` | Process steps, ranked items, sequential content |

---

## Layout Variants

### `variant` (HighlightText)
| Value | When to Use |
| :--- | :--- |
| `row` | Text and image side-by-side — use for balanced visual weight |
| `column` | Stacked layout — use for emphasis on the headline with supporting image below |

### `layout_width` (GalleryWallSimple)
| Value | When to Use |
| :--- | :--- |
| `boxed` | Contained within page margins — use for most cases |
| `full` | Edge-to-edge gallery — use for immersive visual impact |

### `images_gap` (GalleryWallSimple)
| Value | When to Use |
| :--- | :--- |
| `gap` | Default — standard spacing between images |
| `no-gap` | Seamless mosaic — use for tightly composed visual grids |

### `background_type` (TextModule / TeaserBoxes)
| Value | When to Use |
| :--- | :--- |
| `color` | Default — solid color background from the color system |
| `image` | When briefing provides a background image for the section |

---

## Common Anti-Patterns to Avoid

1. **Multiple `h1` tags**: Only the first header module uses `h1`. Everything else is `h2` or lower.
2. **Low-contrast color combos**: Never pair `bg-primary` with `text-default` or `bg-primary-green` with `text-white`.
3. **Contact at page top**: `Contact` module belongs near the end, typically second-to-last before `LatestPosts`.
4. **Missing `"mode":"edit"`**: Every block must include `"mode":"edit"` in the JSON payload.
5. **Stacking text-heavy modules**: Don't place 3+ TextModule/TextImage blocks consecutively — break them up with visual modules (Quote, HighlightText, Gallery, Numbers).
6. **Same background streak**: Avoid 3+ consecutive modules sharing the same `background_color`.
7. **Wrong repeater syntax**: Repeater items use `{name}_{index}_{field}` format (e.g., `cards_0_title`, `cards_1_title`). The count field uses just the repeater name (e.g., `"cards":3`).
