# Few-Shot Syntax Examples

Verified examples of how the JSON data must be wrapped in HTML comments. Every semantic field (e.g., `"headline"`) is accompanied by an `"_headline"` field containing the exact `field_xxxx` key. Configuration fields like `background_color`, `text_color`, `headline_tag_selector` must use valid values from the schema.

> **CRITICAL RULES**:
> - The payload is ONE LINE, no line breaks inside the `<!-- wp:acf/... /-->` block.
> - Ensure `"mode":"edit"` is present so the block opens correctly in Gutenberg.
> - ALWAYS wrap the entire output inside a Markdown fenced code block (using \`\`\`html).
> - Do not output conversational filler.

---

## Header Modules

### HomeHeader
Use as the first block on the homepage only. Supports `<br>` and `<span>` in headline for styling.
```html
<!-- wp:acf/homeheader {"name":"acf/homeheader","data":{"headline":"Home Header Headline","_headline":"field_68de70b5603b0","subline":"Lorem ipsum subline","_subline":"field_68de70bd603b1","button":{"title":"Read more","url":"#","target":""},"_button":"field_68de70c4603b2"},"mode":"edit"} /-->
```

### SubHeader
Use as the first block on all inner pages. Note: `buttons` is a repeater — use `buttons_0_button`, `buttons_1_button` etc. with the same field key.
```html
<!-- wp:acf/subheader {"name":"acf/subheader","data":{"headline_tag_selector":"h2","_headline_tag_selector":"field_6909be50bb7ab","headline":"SubHeader","_headline":"field_6909be40bb7aa","description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et ","_description":"field_6909be69bb7ac","image":4869,"_image":"field_6909be81bb7ad","buttons_0_button":{"title":"Mehr erfahren","url":"https://hp-wp.hattenbergerpartner.de/team/lara-dinkela/","target":""},"_buttons_0_button":"field_6909bea2bb7af","buttons_1_button":{"title":"Mehr erfahren","url":"#","target":""},"_buttons_1_button":"field_6909bea2bb7af","buttons":2,"_buttons":"field_6909be94bb7ae"},"mode":"edit"} /-->
```

---

## Content Modules

### TextModule (Full Configuration)
Note: `background_type` controls whether background is `color` or `image`. `headline_tag_selector` should be `h2` for sections (only one `h1` per page). `headline_size` can be `big` or default.
```html
<!-- wp:acf/textmodule {"name":"acf/textmodule","data":{"overline":"Lorem ipsum","_overline":"field_691c6df67921b","headline":"Text Module","_headline":"field_667a7c119884b","subline":"Lorem ipsum","_subline":"field_667a7c199884c","text":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.","_text":"field_667a7f279884d","buttons":"","_buttons":"field_63e9fa4a03b7f","background_type":"color","_background_type":"field_6891cb10a227a","background_color":"bg-default","_background_color":"field_61af68e3a9eec","text_color":"text-default","_text_color":"field_636278ff657b7","overlineheadlinesubline_alignment":"left","_overlineheadlinesubline_alignment":"field_667a7f809884f","headline_tag_selector":"h2","_headline_tag_selector":"field_667a812ef45dd","headline_size":"big","_headline_size":"field_691c74447f79f","text_element_position":"left","_text_element_position":"field_667a801b98850","text_element_alignment":"left","_text_element_alignment":"field_667a806998851"},"mode":"edit"} /-->
```

### TextImage (With Repeater Row)
Note: `single_row` is a repeater — use `single_row_0_image`, `single_row_0_single_row_headline` etc. `first_row_image_position` alternates `left`/`right` across consecutive TextImage modules.
```html
<!-- wp:acf/textimage {"name":"acf/textimage","data":{"overline":"Lorem ipsum dolor sit amet,","_overline":"field_6661a5662eba2","headline":"Headline TextImage","_headline":"field_6661a56e2eba3","subline":"Lorem ipsum dolor sit amet,","_subline":"field_6661a5742eba4","single_row_0_image":4694,"_single_row_0_image":"field_6661a5e32eba8","single_row_0_single_row_overline":"Single Row Overline","_single_row_0_single_row_overline":"field_69283546c76e6","single_row_0_single_row_headline":"Single Row Headline","_single_row_0_single_row_headline":"field_6661a5932eba5","single_row_0_single_row_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.","_single_row_0_single_row_description":"field_6661a59c2eba6","single_row_0_row_button":"","_single_row_0_row_button":"field_6661a5cf2eba7","single_row":1,"_single_row":"field_6661a17a6e209","background_color":"bg-default","_background_color":"field_627905a55a913","text_color":"text-default","_text_color":"field_636278df301d7","headline_tag_selector":"h2","_headline_tag_selector":"field_6661a003119e4","overlineheadlinesubline_alignment":"left","_overlineheadlinesubline_alignment":"field_667411f7914d0","row_headline_tag_selector":"h4","_row_headline_tag_selector":"field_6661a0eb6e208","text_colors":"text-default","_text_colors":"field_6890c2032f28d","image_ratio":"16-9","_image_ratio":"field_6661a014119e5","first_row_image_position":"left","_first_row_image_position":"field_6661a1d66e20b","content_box_background_color":"bg-default","_content_box_background_color":"field_6661a20e6e20c","image_wider":"0","_image_wider":"field_692836c257785"},"mode":"edit"} /-->
```

### HighlightText (Column Variant)
Note: `variant` controls layout — `column` for stacked headline+image, `row` for side-by-side. The headline supports `<br>` for line breaks.
```html
<!-- wp:acf/highlighttext {"name":"acf/highlighttext","data":{"background_color":"bg-default","_background_color":"field_68dfa358034b6","variant":"column","_variant":"field_68dfa3bd034bd","text_color":"text-default","_text_color":"field_68dfa364034b7","headline":"Highlight Text dolor sit amet, consetetur sadipscing elitr","_headline":"field_68dfa379034b8","headline_tag_selector":"h2","_headline_tag_selector":"field_68dfa381034b9","subline":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.","_subline":"field_68dfa38c034ba","button":"","_button":"field_68dfa39b034bb","image":4831,"_image":"field_68dfa3a6034bc","image_ratio":"auto","_image_ratio":"field_68dfa87d8e6ee"},"mode":"edit"} /-->
```

### HighlightText (Row Variant)
```html
<!-- wp:acf/highlighttext {"name":"acf/highlighttext","data":{"background_color":"bg-primary","_background_color":"field_68dfa358034b6","variant":"row","_variant":"field_68dfa3bd034bd","text_color":"text-white","_text_color":"field_68dfa364034b7","headline":"Highlight Text row layout","_headline":"field_68dfa379034b8","headline_tag_selector":"h2","_headline_tag_selector":"field_68dfa381034b9","subline":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_subline":"field_68dfa38c034ba","button":"","_button":"field_68dfa39b034bb","image":4831,"_image":"field_68dfa3a6034bc","image_ratio":"auto","_image_ratio":"field_68dfa87d8e6ee"},"mode":"edit"} /-->
```

### StickyColumn
Note: `blocks` is a repeater for the scrolling side. `module_variation` controls layout style. Has separate color controls for main section and inner blocks.
```html
<!-- wp:acf/stickycolumn {"name":"acf/stickycolumn","data":{"overline":"Overline","_overline":"field_698dd603885a8","headline":"Sticky Column Headline","_headline":"field_698dd615885a9","headline_tag_selector":"h2","_headline_tag_selector":"field_698dd61c885aa","subline":"Lorem ipsum dolor sit amet","_subline":"field_698dd658885ab","text":"<p>Lorem ipsum dolor sit amet, consetetur sadipscing elitr.</p>","_text":"field_698dd690885ac","button":{"title":"Learn more","url":"#","target":""},"_button":"field_698dd746885b1","blocks_0_title":"Block Title 1","_blocks_0_title":"field_698dd6d0885ae","blocks_0_description":"<p>Block description text here.</p>","_blocks_0_description":"field_698dd6f4885af","blocks_0_button":"","_blocks_0_button":"field_698dd724885b0","blocks_1_title":"Block Title 2","_blocks_1_title":"field_698dd6d0885ae","blocks_1_description":"<p>Second block description.</p>","_blocks_1_description":"field_698dd6f4885af","blocks_1_button":"","_blocks_1_button":"field_698dd724885b0","blocks":2,"_blocks":"field_698dd6ae885ad","module_variation":"default","_module_variation":"field_698dd833885b8","background_color":"bg-default","_background_color":"field_698dd7b4885b4","text_color":"text-default","_text_color":"field_698dd7c4885b5","block_background_color":"bg-primary-green","_block_background_color":"field_698dd7e3885b6","block_text_color":"text-default","_block_text_color":"field_698dd804885b7"},"mode":"edit"} /-->
```

---

## Social Proof & Testimonials

### Quotation (Single Quote, Formal)
Note: Full attribution with person image, name, and position. `module_alignment` controls left/center/right.
```html
<!-- wp:acf/quotation {"name":"acf/quotation","data":{"overline":"Overline","_overline":"field_66754e5c04a55","headline":"Quotation Headline","_headline":"field_66754e6404a56","subline":"Lorem ipsum","_subline":"field_66754e6a04a57","quote":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.","_quote":"field_61a48dce56d41","person_image":4859,"_person_image":"field_66754eb504a58","person_name":"Name","_person_name":"field_66754edc6dff8","person_position":"Position","_person_position":"field_66754f0c6dff9","background_color":"bg-default","_background_color":"field_61af27bc6cdf6","text_color":"text-default","_text_color":"field_63627254973cf","headline_tag_selector":"h2","_headline_tag_selector":"field_66754ff66dffb","subline_tag_selector":"h4","_subline_tag_selector":"field_66755373bfc06","module_alignment":"left","_module_alignment":"field_66754f456dffa"},"mode":"edit"} /-->
```

### Quote (Multi-Quote Carousel)
Note: `quotes` is a repeater — use `quotes_0_quote`, `quotes_0_name` etc. Each quote has its own image with ratio control.
```html
<!-- wp:acf/quote {"name":"acf/quote","data":{"background_color":"bg-default","_background_color":"field_68df8a1c5c022","text_color":"text-default","_text_color":"field_68df8a285c023","headline":"Headline Quote","_headline":"field_68df89db5c020","headline_tag_selector":"h2","_headline_tag_selector":"field_68df89e95c021","quotes_0_image":4869,"_quotes_0_image":"field_68df8a3a5c025","quotes_0_image_ratio":"1-1","_quotes_0_image_ratio":"field_68df92c3516d7","quotes_0_quote":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_quotes_0_quote":"field_68df8a435c026","quotes_0_name":"Name","_quotes_0_name":"field_68df8a595c027","quotes_0_position":"Position","_quotes_0_position":"field_68df8a5e5c028","quotes":1,"_quotes":"field_68df8a335c024"},"mode":"edit"} /-->
```

---

## Navigation & Discovery

### TeaserBoxes (3 Teasers with Individual Colors)
Note: Each teaser has independent `background_colors` and `text_colors`. `background_type` per teaser supports `color` or `image`. `show_teaser_on_mobile` controls responsive visibility.
```html
<!-- wp:acf/teaserboxes {"name":"acf/teaserboxes","data":{"headline":"TeaserBoxes","_headline":"field_68b6e5c9fa698","teasers_0_single_headline":"Headline","_teasers_0_single_headline":"field_68b6e53ffa694","teasers_0_single_subline":"Lorem ipsum dolor sit amet,","_teasers_0_single_subline":"field_68b6e559fa695","teasers_0_button":"","_teasers_0_button":"field_68b6e56cfa696","teasers_0_background_type":"color","_teasers_0_background_type":"field_68b6e6e2fa69f","teasers_0_background_colors":"bg-primary-green","_teasers_0_background_colors":"field_68b6e707fa6a0","teasers_0_text_colors":"text-default","_teasers_0_text_colors":"field_68b84b0ccd8e3","teasers_0_show_teaser_on_mobile":"1","_teasers_0_show_teaser_on_mobile":"field_68b6e759ed7cd","teasers_1_single_headline":"Headline","_teasers_1_single_headline":"field_68b6e53ffa694","teasers_1_single_subline":"Lorem ipsum dolor sit amet,","_teasers_1_single_subline":"field_68b6e559fa695","teasers_1_button":"","_teasers_1_button":"field_68b6e56cfa696","teasers_1_background_type":"color","_teasers_1_background_type":"field_68b6e6e2fa69f","teasers_1_background_colors":"bg-light-yellow","_teasers_1_background_colors":"field_68b6e707fa6a0","teasers_1_text_colors":"text-default","_teasers_1_text_colors":"field_68b84b0ccd8e3","teasers_1_show_teaser_on_mobile":"1","_teasers_1_show_teaser_on_mobile":"field_68b6e759ed7cd","teasers_2_single_headline":"Headline","_teasers_2_single_headline":"field_68b6e53ffa694","teasers_2_single_subline":"Lorem ipsum dolor sit amet,","_teasers_2_single_subline":"field_68b6e559fa695","teasers_2_button":"","_teasers_2_button":"field_68b6e56cfa696","teasers_2_background_type":"color","_teasers_2_background_type":"field_68b6e6e2fa69f","teasers_2_background_colors":"bg-primary-green","_teasers_2_background_colors":"field_68b6e707fa6a0","teasers_2_text_colors":"text-default","_teasers_2_text_colors":"field_68b84b0ccd8e3","teasers_2_show_teaser_on_mobile":"1","_teasers_2_show_teaser_on_mobile":"field_68b6e759ed7cd","teasers":3,"_teasers":"field_680f6833f0421","background_color":"bg-default","_background_color":"field_68b84af8cd8e2","text_color":"text-default","_text_color":"field_68b6e5f3fa69a","headline_tag_selector":"h2","_headline_tag_selector":"field_68b6e642fa69c","headline_alignment":"left","_headline_alignment":"field_68b6e616fa69b","content_box_alignment":"left","_content_box_alignment":"field_68b6e686fa69d","teaser_box_content_alignment":"left","_teaser_box_content_alignment":"field_68b6e6aafa69e"},"mode":"edit"} /-->
```

### Cards (3 Cards with Per-Card Colors, Image First)
Note: Each card has `card_background_color` and `card_text_color`. `narrow_container` + `cards_size:"fixed"` creates a contained layout. `cards_image_first` controls image/text order.
```html
<!-- wp:acf/cards {"name":"acf/cards","data":{"background_color":"bg-default","_background_color":"field_68df8d9b875e0","text_color":"text-default","_text_color":"field_68df8da8875e1","cards_per_row":"3","_cards_per_row":"field_68df7b4d7263e","numbered_cards":"0","_numbered_cards":"field_68df7b637263f","narrow_container":"1","_narrow_container":"field_690e0f996052c","cards_size":"fixed","_cards_size":"field_690e115ebdafd","cards_container_alignment":"left","_cards_container_alignment":"field_690e0fd06052d","cards_image_first":"1","_cards_image_first":"field_691b24853e4f4","cards_title_font_primary":"0","_cards_title_font_primary":"field_691b24aa3e4f5","headline":"Cards Lorem ipsum dolor","_headline":"field_68df7abe72635","headline_tag_selector":"h2","_headline_tag_selector":"field_68df7ac572636","cards_0_title":"Lorem ipsum dolor","_cards_0_title":"field_68df7af072638","cards_0_text":"Lorem ipsum dolor","_cards_0_text":"field_68df7afc72639","cards_0_image":4825,"_cards_0_image":"field_68df7b117263a","cards_0_card_background_color":"bg-primary-green","_cards_0_card_background_color":"field_68df7b217263b","cards_0_card_text_color":"text-primary","_cards_0_card_text_color":"field_68df7b327263c","cards_1_title":"Lorem ipsum dolor","_cards_1_title":"field_68df7af072638","cards_1_text":"Lorem ipsum dolor","_cards_1_text":"field_68df7afc72639","cards_1_image":4825,"_cards_1_image":"field_68df7b117263a","cards_1_card_background_color":"bg-primary","_cards_1_card_background_color":"field_68df7b217263b","cards_1_card_text_color":"text-white","_cards_1_card_text_color":"field_68df7b327263c","cards_2_title":"Lorem ipsum dolor","_cards_2_title":"field_68df7af072638","cards_2_text":"Lorem ipsum dolor","_cards_2_text":"field_68df7afc72639","cards_2_image":4825,"_cards_2_image":"field_68df7b117263a","cards_2_card_background_color":"bg-primary-green","_cards_2_card_background_color":"field_68df7b217263b","cards_2_card_text_color":"text-default","_cards_2_card_text_color":"field_68df7b327263c","cards":3,"_cards":"field_68df7ada72637"},"mode":"edit"} /-->
```

### Cards (Numbered, Centered)
Note: `numbered_cards:"1"` adds sequential numbers. `cards_container_alignment:"center"` centers the card grid.
```html
<!-- wp:acf/cards {"name":"acf/cards","data":{"background_color":"bg-default","_background_color":"field_68df8d9b875e0","text_color":"text-default","_text_color":"field_68df8da8875e1","cards_per_row":"3","_cards_per_row":"field_68df7b4d7263e","numbered_cards":"1","_numbered_cards":"field_68df7b637263f","narrow_container":"1","_narrow_container":"field_690e0f996052c","cards_size":"fixed","_cards_size":"field_690e115ebdafd","cards_container_alignment":"center","_cards_container_alignment":"field_690e0fd06052d","headline":"Cards Lorem ipsum dolor","_headline":"field_68df7abe72635","headline_tag_selector":"h2","_headline_tag_selector":"field_68df7ac572636","cards_0_title":"Lorem ipsum dolor","_cards_0_title":"field_68df7af072638","cards_0_text":"Lorem ipsum dolor","_cards_0_text":"field_68df7afc72639","cards_0_image":4825,"_cards_0_image":"field_68df7b117263a","cards_0_card_background_color":"bg-primary-green","_cards_0_card_background_color":"field_68df7b217263b","cards_0_card_text_color":"text-primary","_cards_0_card_text_color":"field_68df7b327263c","cards_1_title":"Lorem ipsum dolor","_cards_1_title":"field_68df7af072638","cards_1_text":"Lorem ipsum dolor","_cards_1_text":"field_68df7afc72639","cards_1_image":4825,"_cards_1_image":"field_68df7b117263a","cards_1_card_background_color":"bg-primary","_cards_1_card_background_color":"field_68df7b217263b","cards_1_card_text_color":"text-white","_cards_1_card_text_color":"field_68df7b327263c","cards_2_title":"Lorem ipsum dolor","_cards_2_title":"field_68df7af072638","cards_2_text":"Lorem ipsum dolor","_cards_2_text":"field_68df7afc72639","cards_2_image":4825,"_cards_2_image":"field_68df7b117263a","cards_2_card_background_color":"bg-primary-green","_cards_2_card_background_color":"field_68df7b217263b","cards_2_card_text_color":"text-default","_cards_2_card_text_color":"field_68df7b327263c","cards":3,"_cards":"field_68df7ada72637"},"mode":"edit"} /-->
```

### Tabs (Icon Variant)
Note: `card_type:"icon"` requires an image ID for each card's `icon` field. Use `"numbered"` for sequential steps or `"none"` for plain text tabs.
```html
<!-- wp:acf/tabs {"name":"acf/tabs","data":{"headline_tag_selector":"h2","_headline_tag_selector":"field_6915b2df08ae3","headline":"Tabs Headline","_headline":"field_6915b2bc08ae1","card_type":"icon","_card_type":"field_6909c66d865da","headline_alignment":"left","_headline_alignment":"field_6915b2c608ae2","cards_0_icon":2703,"_cards_0_icon":"field_6909c6b8865dc","cards_0_title":"Lorem ipsum dolor","_cards_0_title":"field_6909c6cd865dd","cards_0_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_cards_0_description":"field_6909c6d3865de","cards_1_icon":2703,"_cards_1_icon":"field_6909c6b8865dc","cards_1_title":"Lorem ipsum dolor","_cards_1_title":"field_6909c6cd865dd","cards_1_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_cards_1_description":"field_6909c6d3865de","cards_2_icon":2703,"_cards_2_icon":"field_6909c6b8865dc","cards_2_title":"Lorem ipsum dolor","_cards_2_title":"field_6909c6cd865dd","cards_2_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_cards_2_description":"field_6909c6d3865de","cards":3,"_cards":"field_6909c6b2865db"},"mode":"edit"} /-->
```

### Tabs (Numbered Variant)
Note: When `card_type:"numbered"`, omit the `icon` fields from each card.
```html
<!-- wp:acf/tabs {"name":"acf/tabs","data":{"headline_tag_selector":"h2","_headline_tag_selector":"field_6915b2df08ae3","headline":"Tabs Headline","_headline":"field_6915b2bc08ae1","card_type":"numbered","_card_type":"field_6909c66d865da","headline_alignment":"left","_headline_alignment":"field_6915b2c608ae2","cards_0_title":"Lorem ipsum dolor","_cards_0_title":"field_6909c6cd865dd","cards_0_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_cards_0_description":"field_6909c6d3865de","cards_1_title":"Lorem ipsum dolor","_cards_1_title":"field_6909c6cd865dd","cards_1_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_cards_1_description":"field_6909c6d3865de","cards_2_title":"Lorem ipsum dolor","_cards_2_title":"field_6909c6cd865dd","cards_2_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_cards_2_description":"field_6909c6d3865de","cards":3,"_cards":"field_6909c6b2865db"},"mode":"edit"} /-->
```

### Steps (Numbered)
Note: `numbered_cards:"1"` shows step numbers. Simpler than Tabs — no icons, no card_type.
```html
<!-- wp:acf/steps {"name":"acf/steps","data":{"headline_tag_selector":"h2","_headline_tag_selector":"field_6915f158f7f4b","headline":"Steps headline lorem ipsum","_headline":"field_6915f14df7f4a","headline_alignment":"left","_headline_alignment":"field_6915f173f7f4c","numbered_cards":"1","_numbered_cards":"field_6915f1d2f7f50","cards_0_title":"Lorem ipsum dolor sit amet","_cards_0_title":"field_6915f18cf7f4e","cards_0_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_cards_0_description":"field_6915f191f7f4f","cards_1_title":"Lorem ipsum dolor sit amet","_cards_1_title":"field_6915f18cf7f4e","cards_1_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_cards_1_description":"field_6915f191f7f4f","cards_2_title":"Lorem ipsum dolor sit amet","_cards_2_title":"field_6915f18cf7f4e","cards_2_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr.","_cards_2_description":"field_6915f191f7f4f","cards":3,"_cards":"field_6915f184f7f4d"},"mode":"edit"} /-->
```

### QuickLinks (Nested Repeaters)
Note: Double-nested repeater — `menus_repeater` contains `links_repeater` which contains `single_link` items. `menus_in_one_row` controls columns (3-5).
```html
<!-- wp:acf/quicklinks {"name":"acf/quicklinks","data":{"headline":"Headline Quick Links","_headline":"field_68dbed8c6481f","menus_repeater_0_title":"Lorem ipsum","_menus_repeater_0_title":"field_68dbed8c6c05d","menus_repeater_0_links_repeater_0_single_link":{"title":"Lorem ipsum","url":"#","target":""},"_menus_repeater_0_links_repeater_0_single_link":"field_68dbee8199c4a","menus_repeater_0_links_repeater_1_single_link":{"title":"Lorem ipsum","url":"#","target":""},"_menus_repeater_0_links_repeater_1_single_link":"field_68dbee8199c4a","menus_repeater_0_links_repeater":2,"_menus_repeater_0_links_repeater":"field_68dbee4099c49","menus_repeater_1_title":"Lorem ipsum","_menus_repeater_1_title":"field_68dbed8c6c05d","menus_repeater_1_links_repeater_0_single_link":{"title":"Lorem ipsum","url":"#","target":""},"_menus_repeater_1_links_repeater_0_single_link":"field_68dbee8199c4a","menus_repeater_1_links_repeater":1,"_menus_repeater_1_links_repeater":"field_68dbee4099c49","menus_repeater_2_title":"Lorem ipsum","_menus_repeater_2_title":"field_68dbed8c6c05d","menus_repeater_2_links_repeater_0_single_link":{"title":"Lorem ipsum","url":"#","target":""},"_menus_repeater_2_links_repeater_0_single_link":"field_68dbee8199c4a","menus_repeater_2_links_repeater":1,"_menus_repeater_2_links_repeater":"field_68dbee4099c49","menus_repeater":3,"_menus_repeater":"field_68dbed8c64828","background_color":"bg-default","_background_color":"field_68dbed8c64831","text_color":"text-default","_text_color":"field_68dbed8c64836","headline_alignment":"left","_headline_alignment":"field_68dbed8c6483a","links_alignment":"left","_links_alignment":"field_68dbed8c6483f","headline_tag_selector":"h2","_headline_tag_selector":"field_68dbed8c64844","menus_in_one_row":"3","_menus_in_one_row":"field_68dd1775214b1"},"mode":"edit"} /-->
```

---

## Media Modules

### Video
Note: `video_id` is the YouTube video ID only (not the full URL). `video_type` defaults to `"youtube"`.
```html
<!-- wp:acf/video {"name":"acf/video","data":{"overline":"Lorem ipsum dolorum","_overline":"field_667ac8629bde1","headline":"Video-Modul","_headline":"field_667ac86c9bde2","subline":"Lorem ipsum dolorum","_subline":"field_667ac8729bde3","button":{"title":"Kontakt","url":"#","target":""},"_button":"field_6973842cb6648","video_id":"cfYezXDyAA","_video_id":"field_61dea0ef449a3","background_color":"bg-default","_background_color":"field_636279a89d5b6","text_color":"text-default","_text_color":"field_667ac80758f51","headline_tag_selector":"h2","_headline_tag_selector":"field_667ac82558f52","overlineheadlinesubline_alignment":"left","_overlineheadlinesubline_alignment":"field_667ac83758f53","video_type":"youtube","_video_type":"field_61dea0d0449a2"},"mode":"edit"} /-->
```

### GalleryWallSimple
Note: `images` is a gallery field with an array of image IDs. `images_in_one_line` sets grid columns. `images_gap` controls spacing (`gap` or `no-gap`).
```html
<!-- wp:acf/gallerywallsimple {"name":"acf/gallerywallsimple","data":{"headline":"Gallery Wall Simple","_headline":"field_66719075b70a5","images":["4076","4074","4072","4070","4068","4066","4064"],"_images":"field_61dd5b9bdab3b","background_color":"bg-default","_background_color":"field_63625e87a9cb9","text_color":"text-default","_text_color":"field_667190aab70a7","headline_tag_selector":"h2","_headline_tag_selector":"field_667412775ddc3","headline_alignment":"left","_headline_alignment":"field_6911f207d4a4c","layout_width":"boxed","_layout_width":"field_654a469f96e27","image_ratio":"1-1","_image_ratio":"field_654a46bb96e29","images_gap":"gap","_images_gap":"field_654a46c896e2a","images_in_one_line":"4","_images_in_one_line":"field_61dd5fd464687"},"mode":"edit"} /-->
```

### LogoSlider
Note: `logos` is a gallery field with an array of logo image IDs. Renders as an infinite-scroll marquee.
```html
<!-- wp:acf/logoslider {"name":"acf/logoslider","data":{"background_color":"bg-default","_background_color":"field_68df6a193204b","headline_tag_selector":"h2","_headline_tag_selector":"field_68df6a2a3204c","headline":"Logo Slider","_headline":"field_68df6b2b8def9","logos":["4689","4690","4687","4688","4685","4686","4684","4683"],"_logos":"field_68df6a3c3204d"},"mode":"edit"} /-->
```

---

## Dynamic Content Modules

### LatestPosts
Note: `posts_selection:"auto"` pulls latest posts automatically. Use `"manual"` with `insights_posts` to hand-pick. `posts_to_display` limits the count.
```html
<!-- wp:acf/latestposts {"name":"acf/latestposts","data":{"background_color":"bg-default","_background_color":"field_68fa00706b38f","text_color":"text-default","_text_color":"field_68fa008a6b390","headline_tag_selector":"h2","_headline_tag_selector":"field_68fa00ceba944","headline":"Headline latest Posts","_headline":"field_68fa00946b391","posts_selection":"auto","_posts_selection":"field_6911bd86f2818","insights_category":"","_insights_category":"field_6911bc99f2817","posts_to_display":"3","_posts_to_display":"field_6911be18f281a","promo_text":"This is the PromoText","_promo_text":"field_68fa1ebe7a2c4","button":{"title":"Lorem ipsum","url":"#","target":""},"_button":"field_68fa1ec37a2c5"},"mode":"edit"} /-->
```

### PostsSlider
Note: `post_type` selects between insights/cases. Category filters are optional — leave empty for all.
```html
<!-- wp:acf/postsslider {"name":"acf/postsslider","data":{"background_color":"bg-default","_background_color":"field_68ee59152bcfb","text_color":"text-default","_text_color":"field_68ee59282bcfc","post_type":"insights","_post_type":"field_68ee3d2d956f1","insights_category":"","_insights_category":"field_690cbf013cb7f","title":"Latest Insights","_title":"field_68ee40af423e4","button":{"title":"Alle Insights","url":"#","target":""},"_button":"field_68ee40be423e5"},"mode":"edit"} /-->
```

---

## Conversion & Contact

### Contact (High-Contrast CTA)
Note: Typically uses `bg-primary-dark` with `text-white` for maximum contrast. `team_member` is a post object ID referencing the Team CPT.
```html
<!-- wp:acf/contact {"name":"acf/contact","data":{"background_color":"bg-primary-dark","_background_color":"field_68df955c0465b","text_color":"text-white","_text_color":"field_68df95660465c","headline":"Contact orem ipsum dolor is","_headline":"field_68df95730465d","subline":"Lorem ipsum dolor","_subline":"field_68df95790465e","headline_tag_selector":"h2","_headline_tag_selector":"field_68df95810465f","subline_tag_selector":"p","_subline_tag_selector":"field_68df958d04660","button":{"title":"Mehr erfahren","url":"#","target":""},"_button":"field_68df959c04661","team_member":4075,"_team_member":"field_68df95a604662"},"mode":"edit"} /-->
```

---

## Utility & Structural

### Divider
Note: Simple visual separator. `direction` controls horizontal/vertical. Use between sections sharing the same background color.
```html
<!-- wp:acf/divider {"name":"acf/divider","data":{"background_color":"bg-default","_background_color":"field_68e380f9d75b2","divider_color":"bg-primary","_divider_color":"field_68e38109d75b3","direction":"horizontal","_direction":"field_68e3824186293"},"mode":"edit"} /-->
```

### Accordion
Note: `accordion_repeater` contains expandable items. `first_item_open:"1"` opens the first accordion by default.
```html
<!-- wp:acf/accordion {"name":"acf/accordion","data":{"overline":"Overline Lorem ipsum dolor","_overline":"field_6672a2782ca4f","headline":"Accordion Headline","_headline":"field_617bdcb05d9ac","subline":"Lorem ipsum dolor","_subline":"field_617bdcbc5d9ad","accordion_repeater_0_title":"Lorem ipsum dolor","_accordion_repeater_0_title":"field_617bde635d9b0","accordion_repeater_0_content":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.","_accordion_repeater_0_content":"field_617bde6b5d9b1","accordion_repeater":1,"_accordion_repeater":"field_617bde205d9ae","background_color":"bg-default","_background_color":"field_6362598d3bf39","text_color":"text-default","_text_color":"field_636259a13bf3a","overlineheadlinesubline_alignment":"left","_overlineheadlinesubline_alignment":"field_6672a0f52ca4e","accordion_position":"left","_accordion_position":"field_654a2d360fc52","headline_tag_selector":"h2","_headline_tag_selector":"field_64ac067935d33","first_item_open":"0","_first_item_open":"field_626be5c9218fb"},"mode":"edit"} /-->
```

### Numbers
Note: `numbers` repeater — `title` is the numeric value (e.g., "150+"), `description` is the label.
```html
<!-- wp:acf/numbers {"name":"acf/numbers","data":{"headline":"Unsere Zahlen","_headline":"field_698df203967d6","headline_tag_selector":"h2","_headline_tag_selector":"field_698df27089125","numbers_0_title":"150+","_numbers_0_title":"field_698df215967d8","numbers_0_description":"Projekte","_numbers_0_description":"field_698df222967d9","numbers_1_title":"10+","_numbers_1_title":"field_698df215967d8","numbers_1_description":"Jahre Erfahrung","_numbers_1_description":"field_698df222967d9","numbers_2_title":"25","_numbers_2_title":"field_698df215967d8","numbers_2_description":"Teammitglieder","_numbers_2_description":"field_698df222967d9","numbers":3,"_numbers":"field_698df20b967d7","background_color":"bg-primary","_background_color":"field_698df235967da","text_color":"text-white","_text_color":"field_698df244967db"},"mode":"edit"} /-->
```

### EndSideContent
Note: Structural marker only. Place in insights/blog posts after the main content to mark where sidebar content ends. No configurable fields.
```html
<!-- wp:acf/endsidecontent {"name":"acf/endsidecontent","data":{},"mode":"edit"} /-->
```
