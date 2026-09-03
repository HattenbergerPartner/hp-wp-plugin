# Few-Shot Syntax Examples

> **Field lists here are illustrative.** The authoritative, always-current template for every module is `schema_paths.module_skeletons` from Step 0.5. Use this file for wording and typical values only.

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
<!-- wp:acf/textmodule {"name":"acf/textmodule","data":{"overline":"Lorem ipsum","_overline":"field_691c6df67921b","headline":"Text Module","_headline":"field_667a7c119884b","subline":"Lorem ipsum","_subline":"field_667a7c199884c","text":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.","_text":"field_667a7f279884d","buttons":"","_buttons":"field_63e9fa4a03b7f","background_image":"","_background_image":"field_6891cb2fa227b","background_type":"color","_background_type":"field_6891cb10a227a","background_color":"bg-default","_background_color":"field_61af68e3a9eec","text_color":"text-default","_text_color":"field_636278ff657b7","overlineheadlinesubline_alignment":"left","_overlineheadlinesubline_alignment":"field_667a7f809884f","headline_tag_selector":"h2","_headline_tag_selector":"field_667a812ef45dd","headline_size":"big","_headline_size":"field_691c74447f79f","text_element_position":"left","_text_element_position":"field_667a801b98850","text_element_alignment":"left","_text_element_alignment":"field_667a806998851"},"mode":"edit"} /-->
```

### TextImage (With Repeater Row)
Note: `single_row` is a repeater — use `single_row_0_image`, `single_row_0_single_row_headline` etc. `first_row_image_position` alternates `left`/`right` across consecutive TextImage modules.
```html
<!-- wp:acf/textimage {"name":"acf/textimage","data":{"overline":"Lorem ipsum dolor sit amet,","_overline":"field_6661a5662eba2","headline":"Headline TextImage","_headline":"field_6661a56e2eba3","subline":"Lorem ipsum dolor sit amet,","_subline":"field_6661a5742eba4","single_row_0_image":4694,"_single_row_0_image":"field_6661a5e32eba8","single_row_0_single_row_overline":"Single Row Overline","_single_row_0_single_row_overline":"field_69283546c76e6","single_row_0_single_row_headline":"Single Row Headline","_single_row_0_single_row_headline":"field_6661a5932eba5","single_row_0_single_row_description":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.","_single_row_0_single_row_description":"field_6661a59c2eba6","single_row_0_row_button":"","_single_row_0_row_button":"field_6661a5cf2eba7","single_row":1,"_single_row":"field_6661a17a6e209","layout_width":"boxed","_layout_width":"field_6982b04a7e401","background_color":"bg-default","_background_color":"field_627905a55a913","text_color":"text-default","_text_color":"field_636278df301d7","headline_tag_selector":"h2","_headline_tag_selector":"field_6661a003119e4","overlineheadlinesubline_alignment":"left","_overlineheadlinesubline_alignment":"field_667411f7914d0","row_headline_tag_selector":"h4","_row_headline_tag_selector":"field_6661a0eb6e208","text_colors":"text-default","_text_colors":"field_6890c2032f28d","image_ratio":"16-9","_image_ratio":"field_6661a014119e5","first_row_image_position":"left","_first_row_image_position":"field_6661a1d66e20b","content_box_background_color":"bg-default","_content_box_background_color":"field_6661a20e6e20c","image_wider":"0","_image_wider":"field_692836c257785"},"mode":"edit"} /-->
```

### StickyColumn
Note: `blocks` is a repeater for the scrolling side. `module_variation` controls layout style. Has separate color controls for main section and inner blocks.
```html
<!-- wp:acf/stickycolumn {"name":"acf/stickycolumn","data":{"overline":"Overline","_overline":"field_698dd603885a8","headline":"Sticky Column Headline","_headline":"field_698dd615885a9","headline_tag_selector":"h2","_headline_tag_selector":"field_698dd61c885aa","subline":"Lorem ipsum dolor sit amet","_subline":"field_698dd658885ab","text":"\u003cp\u003eLorem ipsum dolor sit amet, consetetur sadipscing elitr.\u003c/p\u003e","_text":"field_698dd690885ac","button":{"title":"Learn more","url":"#","target":""},"_button":"field_698dd746885b1","blocks_0_title":"Block Title 1","_blocks_0_title":"field_698dd6d0885ae","blocks_0_description":"\u003cp\u003eBlock description text here.\u003c/p\u003e","_blocks_0_description":"field_698dd6f4885af","blocks_0_button":"","_blocks_0_button":"field_698dd724885b0","blocks_1_title":"Block Title 2","_blocks_1_title":"field_698dd6d0885ae","blocks_1_description":"\u003cp\u003eSecond block description.\u003c/p\u003e","_blocks_1_description":"field_698dd6f4885af","blocks_1_button":"","_blocks_1_button":"field_698dd724885b0","blocks":2,"_blocks":"field_698dd6ae885ad","module_variation":"default","_module_variation":"field_698dd833885b8","background_color":"bg-default","_background_color":"field_698dd7b4885b4","text_color":"text-default","_text_color":"field_698dd7c4885b5","block_background_color":"bg-primary-green","_block_background_color":"field_698dd7e3885b6","block_text_color":"text-default","_block_text_color":"field_698dd804885b7"},"mode":"edit"} /-->
```

### TextText (Headline + Item List)
Note: Two-column text layout — description left, `items` repeater right. Items can have an empty `title` for plain statements. `button_variation` is `primary` / `secondary` / `link`.
```html
<!-- wp:acf/texttext {"name":"acf/texttext","data":{"background_color":"bg-default","_background_color":"field_680a4b8f3c90a","text_color":"text-default","_text_color":"field_680a4b8f3c90b","headline_tag_selector":"h2","_headline_tag_selector":"field_680a4b8f3c903","headline":"Die Sorgen sind in fast jedem Erstgespräch dieselben","_headline":"field_680a4b8f3c904","description":"Die meisten Anfragen kommen von Marketing-Verantwortlichen, die schon einen schiefen Relaunch hinter sich haben.","_description":"field_680a4b8f3c905","button":"","_button":"field_680a4b8f3c906","button_variation":"secondary","_button_variation":"field_680a4b8f3c90c","items_0_title":"Budget","_items_0_title":"field_680a4b8f3c908","items_0_text":"Beim letzten Mal ist das Budget aus dem Ruder gelaufen und der Termin gerissen.","_items_0_text":"field_680a4b8f3c909","items_1_title":"Abhängigkeit","_items_1_title":"field_680a4b8f3c908","items_1_text":"Die alte Agentur hat in einem proprietären System gebaut. Seitdem geht nichts ohne sie.","_items_1_text":"field_680a4b8f3c909","items_2_title":"Pflege","_items_2_title":"field_680a4b8f3c908","items_2_text":"Das Marketing-Team will Inhalte selbst pflegen, ohne nach jeder Änderung anzurufen.","_items_2_text":"field_680a4b8f3c909","items":3,"_items":"field_680a4b8f3c907"},"mode":"edit"} /-->
```

### TextBullets (Bullets with Titles + CTA)
Note: First bullet may carry an empty `title` to act as an intro paragraph. `text` is wysiwyg — plain text with `\n\n` paragraphs, no `<p>`.
```html
<!-- wp:acf/textbullets {"name":"acf/textbullets","data":{"headline_tag_selector":"h2","_headline_tag_selector":"field_67e2a1b4c5d69","headline":"Was eine gute Relaunch-Agentur mitbringt","_headline":"field_67e2a1b4c5d6a","description":"Vier Anforderungen, die in fast jedem Briefing stehen.","_description":"field_67e2a1b4c5d70","headline_alignment":"left","_headline_alignment":"field_67e2a1b4c5d71","bullets_0_title":"Klares Timing und Budget","_bullets_0_title":"field_67e2a1b4c5d6c","bullets_0_text":"Eine Website muss sauber geplant werden, ein Dienstleister sich an Zeitraum und Preis halten.","_bullets_0_text":"field_67e2a1b4c5d6d","bullets_1_title":"Das Rad nicht neu erfinden","_bullets_1_title":"field_67e2a1b4c5d6c","bullets_1_text":"Wo es passt, werden bewährte Standards genutzt statt Eigenentwicklungen ohne Mehrwert.","_bullets_1_text":"field_67e2a1b4c5d6d","bullets":2,"_bullets":"field_67e2a1b4c5d6b","cta":{"title":"Mehr zur Vorgehensweise","url":"/leistungen/","target":""},"_cta":"field_67e2a1b4c5d6e","button_variation":"secondary","_button_variation":"field_67e2a1b4c5d6f"},"mode":"edit"} /-->
```

### TextBadges (Statement + 3 Stat Badges)
Note: The replacement for the removed Numbers module when you need 1–3 quantitative proof points. `badges` are placed by the design in a fixed order (1 top-right, 2 middle-left, 3 bottom-right). Use `\n` inside `label` for two-line labels. Exactly 3 badges recommended.
```html
<!-- wp:acf/textbadges {"name":"acf/textbadges","data":{"background_color":"bg-light-yellow","_background_color":"field_680f2a8b4c1d2","text_color":"text-default","_text_color":"field_680f2a8b4c1d3","overline":"Referenzen","_overline":"field_680f2a8b4c1d4","main_text":"Genutzt von Konzernen, öffentlicher Hand und Mittelstand: Emil Frey, TankE, 11880, Delight Eventtechnik, Berliner Seilfabrik.","_main_text":"field_680f2a8b4c1d5","badges_0_stat":"Ø 2","_badges_0_stat":"field_680f2a8b4c1d7","badges_0_label":"Livegänge\npro Woche","_badges_0_label":"field_680f2a8b4c1d8","badges_1_stat":"100 %","_badges_1_stat":"field_680f2a8b4c1d7","badges_1_label":"Code-Übergabe\nbei Go-live","_badges_1_label":"field_680f2a8b4c1d8","badges_2_stat":"Festpreis","_badges_2_stat":"field_680f2a8b4c1d7","badges_2_label":"Preis & Zeitplan fix","_badges_2_label":"field_680f2a8b4c1d8","badges":3,"_badges":"field_680f2a8b4c1d6"},"mode":"edit"} /-->
```

### CardsAnimated (3 Animated Claim Cards)
Note: Best for 3 promises/USPs. Highlight words inside `title` with `<strong>` (escaped). Recommended: exactly 3 cards.
```html
<!-- wp:acf/cardsanimated {"name":"acf/cardsanimated","data":{"text_color":"text-default","_text_color":"field_cardsanimated_text_color","headline":"Das beinhaltet unser Festpreis-Angebot","_headline":"field_cardsanimated_headline","headline_tag_selector":"h2","_headline_tag_selector":"field_cardsanimated_headline_tag","subline":"Drei Zusagen, die für jedes Projekt gelten.","_subline":"field_cardsanimated_subline","button":"","_button":"field_cardsanimated_button","button_variation":"primary","_button_variation":"field_cardsanimated_button_variation","cards_0_title":"Alles bis zum \u003cstrong\u003eGo-live\u003c/strong\u003e","_cards_0_title":"field_cardsanimated_card_title","cards_0_text":"Festpreis vom Erstangebot bis zum Livegang. Wächst der Aufwand, schlagen wir Reduktionen an anderer Stelle vor.","_cards_0_text":"field_cardsanimated_card_text","cards_1_title":"Vollständige \u003cstrong\u003eCode-Übergabe\u003c/strong\u003e","_cards_1_title":"field_cardsanimated_card_title","cards_1_text":"Standard-WordPress ohne proprietäre Komponenten. Sie behalten Code, Zugänge und Dokumentation.","_cards_1_text":"field_cardsanimated_card_text","cards_2_title":"Persönliche \u003cstrong\u003eBeratung\u003c/strong\u003e","_cards_2_title":"field_cardsanimated_card_title","cards_2_text":"Sie sprechen vom ersten Termin an mit Geschäftsführung oder Teamleitung.","_cards_2_text":"field_cardsanimated_card_text","cards":3,"_cards":"field_cardsanimated_cards"},"mode":"edit"} /-->
```

---

## Social Proof & Testimonials

### QuoteReveal (Single Statement Quote)
Note: The only testimonial/quote module. Put the attribution at the end of `quote` ("… – Name, Rolle"). `reveal_overlay:1` lets the block overlay the next module with a reveal animation — use `0` unless the design explicitly calls for it.
```html
<!-- wp:acf/quotereveal {"name":"acf/quotereveal","data":{"background_color":"bg-light-yellow","_background_color":"field_691c5a1e8f0a3","text_color":"text-default","_text_color":"field_691c5a1e8f0a4","quote":"Seit dem Relaunch finden uns Kunden über die Gerätenamen im Katalog, nicht mehr nur über Empfehlungen. – Max Mustermann, Geschäftsführer","_quote":"field_691c5a1e8f0a5","image":"","_image":"field_691c5a1e8f0a6","reveal_overlay":0,"_reveal_overlay":"field_691c5a1e8f0a8"},"mode":"edit"} /-->
```

### CaseSingle (Reference Teaser)
Note: Teaser for one reference/case with image, uppercase badge (`case_study_highlight`), overline, subline (client name), wysiwyg `tekst` and a CTA link to the case page.
```html
<!-- wp:acf/casesingle {"name":"acf/casesingle","data":{"image":"","_image":"field_69904a171aaa2","case_study_highlight":"Case Study","_case_study_highlight":"field_69904a183aaa8","overline":"So sieht ein fertiges Projekt aus","_overline":"field_69904a182aaa4","subline":"Delight Eventtechnik","_subline":"field_69904a182aaa5","tekst":"Konzeption, Design, WordPress-Entwicklung und Wartung. Der Mietkatalog läuft als Custom Post Type mit Anbindung an die Warenwirtschaft.","_tekst":"field_69904a182aaa6","cta":{"title":"Case ansehen","url":"/referenzen/delight-eventtechnik/","target":""},"_cta":"field_69904a182aaa7"},"mode":"edit"} /-->
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
<!-- wp:acf/cards {"name":"acf/cards","data":{"background_color":"bg-default","_background_color":"field_68df8d9b875e0","text_color":"text-default","_text_color":"field_68df8da8875e1","cards_per_row":"3","_cards_per_row":"field_68df7b4d7263e","numbered_cards":"0","_numbered_cards":"field_68df7b637263f","narrow_container":"1","_narrow_container":"field_690e0f996052c","cards_size":"fixed","_cards_size":"field_690e115ebdafd","cards_container_alignment":"left","_cards_container_alignment":"field_690e0fd06052d","cards_image_first":"1","_cards_image_first":"field_691b24853e4f4","headline":"Cards Lorem ipsum dolor","_headline":"field_68df7abe72635","headline_tag_selector":"h2","_headline_tag_selector":"field_68df7ac572636","cards_0_title":"Lorem ipsum dolor","_cards_0_title":"field_68df7af072638","cards_0_text":"Lorem ipsum dolor","_cards_0_text":"field_68df7afc72639","cards_0_image":4825,"_cards_0_image":"field_68df7b117263a","cards_0_card_background_color":"bg-primary-green","_cards_0_card_background_color":"field_68df7b217263b","cards_0_card_text_color":"text-primary","_cards_0_card_text_color":"field_68df7b327263c","cards_1_title":"Lorem ipsum dolor","_cards_1_title":"field_68df7af072638","cards_1_text":"Lorem ipsum dolor","_cards_1_text":"field_68df7afc72639","cards_1_image":4825,"_cards_1_image":"field_68df7b117263a","cards_1_card_background_color":"bg-primary","_cards_1_card_background_color":"field_68df7b217263b","cards_1_card_text_color":"text-white","_cards_1_card_text_color":"field_68df7b327263c","cards_2_title":"Lorem ipsum dolor","_cards_2_title":"field_68df7af072638","cards_2_text":"Lorem ipsum dolor","_cards_2_text":"field_68df7afc72639","cards_2_image":4825,"_cards_2_image":"field_68df7b117263a","cards_2_card_background_color":"bg-primary-green","_cards_2_card_background_color":"field_68df7b217263b","cards_2_card_text_color":"text-default","_cards_2_card_text_color":"field_68df7b327263c","cards":3,"_cards":"field_68df7ada72637"},"mode":"edit"} /-->
```

### Cards (Numbered, Centered)
Note: `numbered_cards:"1"` adds sequential numbers. `cards_container_alignment:"center"` centers the card grid.
```html
<!-- wp:acf/cards {"name":"acf/cards","data":{"background_color":"bg-default","_background_color":"field_68df8d9b875e0","text_color":"text-default","_text_color":"field_68df8da8875e1","cards_per_row":"3","_cards_per_row":"field_68df7b4d7263e","numbered_cards":"1","_numbered_cards":"field_68df7b637263f","narrow_container":"1","_narrow_container":"field_690e0f996052c","cards_size":"fixed","_cards_size":"field_690e115ebdafd","cards_container_alignment":"center","_cards_container_alignment":"field_690e0fd06052d","cards_image_first":0,"_cards_image_first":"field_691b24853e4f4","headline":"Cards Lorem ipsum dolor","_headline":"field_68df7abe72635","headline_tag_selector":"h2","_headline_tag_selector":"field_68df7ac572636","cards_0_title":"Lorem ipsum dolor","_cards_0_title":"field_68df7af072638","cards_0_text":"Lorem ipsum dolor","_cards_0_text":"field_68df7afc72639","cards_0_image":4825,"_cards_0_image":"field_68df7b117263a","cards_0_card_background_color":"bg-primary-green","_cards_0_card_background_color":"field_68df7b217263b","cards_0_card_text_color":"text-primary","_cards_0_card_text_color":"field_68df7b327263c","cards_1_title":"Lorem ipsum dolor","_cards_1_title":"field_68df7af072638","cards_1_text":"Lorem ipsum dolor","_cards_1_text":"field_68df7afc72639","cards_1_image":4825,"_cards_1_image":"field_68df7b117263a","cards_1_card_background_color":"bg-primary","_cards_1_card_background_color":"field_68df7b217263b","cards_1_card_text_color":"text-white","_cards_1_card_text_color":"field_68df7b327263c","cards_2_title":"Lorem ipsum dolor","_cards_2_title":"field_68df7af072638","cards_2_text":"Lorem ipsum dolor","_cards_2_text":"field_68df7afc72639","cards_2_image":4825,"_cards_2_image":"field_68df7b117263a","cards_2_card_background_color":"bg-primary-green","_cards_2_card_background_color":"field_68df7b217263b","cards_2_card_text_color":"text-default","_cards_2_card_text_color":"field_68df7b327263c","cards":3,"_cards":"field_68df7ada72637"},"mode":"edit"} /-->
```

### StepsScroll (Process Steps, Scroll-Driven)
Note: Replaces the removed Steps/Tabs modules for processes. Each step: `title`, optional `timeframe`, wysiwyg `description`, optional `link`, per-step `accent_color` / `step_background` / `step_text_color`. Keep `digit_image` empty unless artwork exists.
```html
<!-- wp:acf/stepsscroll {"name":"acf/stepsscroll","data":{"headline":"So läuft ein Relaunch bei uns ab","_headline":"field_a91f02bc44ee4","headline_tag_selector":"h2","_headline_tag_selector":"field_a91f02bc44ee5","steps_0_title":"Analyse & Zielbild","_steps_0_title":"field_a91f02bc44ee8","steps_0_timeframe":"Woche 1–2","_steps_0_timeframe":"field_a91f02bc44ee9","steps_0_description":"SEO-Potentialanalyse, Wettbewerbsvergleich und Keyword-Cluster, aus denen die Seitenstruktur entsteht.","_steps_0_description":"field_a91f02bc45010","steps_0_link":"","_steps_0_link":"field_a91f02bc45011","steps_0_digit_image":"","_steps_0_digit_image":"field_a91f02bc45012","steps_0_accent_color":"bg-primary","_steps_0_accent_color":"field_a91f02bc45013","steps_0_step_background":"bg-default","_steps_0_step_background":"field_a91f02bc45014","steps_0_step_text_color":"text-default","_steps_0_step_text_color":"field_a91f02bc45015","steps_1_title":"Konzept & Design","_steps_1_title":"field_a91f02bc44ee8","steps_1_timeframe":"Woche 3–5","_steps_1_timeframe":"field_a91f02bc44ee9","steps_1_description":"Wireframes, Screendesign und ein Modulbaukasten, den die Redaktion später selbst pflegt.","_steps_1_description":"field_a91f02bc45010","steps_1_link":"","_steps_1_link":"field_a91f02bc45011","steps_1_digit_image":"","_steps_1_digit_image":"field_a91f02bc45012","steps_1_accent_color":"bg-primary-green","_steps_1_accent_color":"field_a91f02bc45013","steps_1_step_background":"bg-default","_steps_1_step_background":"field_a91f02bc45014","steps_1_step_text_color":"text-default","_steps_1_step_text_color":"field_a91f02bc45015","steps_2_title":"Umsetzung & Go-live","_steps_2_title":"field_a91f02bc44ee8","steps_2_timeframe":"Woche 6–10","_steps_2_timeframe":"field_a91f02bc44ee9","steps_2_description":"Entwicklung ohne Pagebuilder, Migration, Testing und vollständige Code-Übergabe bei Go-live.","_steps_2_description":"field_a91f02bc45010","steps_2_link":"","_steps_2_link":"field_a91f02bc45011","steps_2_digit_image":"","_steps_2_digit_image":"field_a91f02bc45012","steps_2_accent_color":"bg-primary","_steps_2_accent_color":"field_a91f02bc45013","steps_2_step_background":"bg-default","_steps_2_step_background":"field_a91f02bc45014","steps_2_step_text_color":"text-default","_steps_2_step_text_color":"field_a91f02bc45015","steps":3,"_steps":"field_a91f02bc44ee6","background_color":"bg-default","_background_color":"field_a91f02bc45017","digit_color":"bg-primary","_digit_color":"field_a91f02bc45019","text_color":"text-default","_text_color":"field_a91f02bc45018"},"mode":"edit"} /-->
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
<!-- wp:acf/latestposts {"name":"acf/latestposts","data":{"background_color":"bg-default","_background_color":"field_68fa00706b38f","text_color":"text-default","_text_color":"field_68fa008a6b390","headline_tag_selector":"h2","_headline_tag_selector":"field_68fa00ceba944","headline":"Headline latest Posts","_headline":"field_68fa00946b391","posts_selection":"auto","_posts_selection":"field_6911bd86f2818","insights_category":"","_insights_category":"field_6911bc99f2817","insights_posts":"","_insights_posts":"field_6911bdd8f2819","posts_to_display":"3","_posts_to_display":"field_6911be18f281a","promo_text":"This is the PromoText","_promo_text":"field_68fa1ebe7a2c4","button":{"title":"Lorem ipsum","url":"#","target":""},"_button":"field_68fa1ec37a2c5"},"mode":"edit"} /-->
```

### PostsSlider
Note: `post_type` selects between insights/cases. Category filters are optional — leave empty for all.
```html
<!-- wp:acf/postsslider {"name":"acf/postsslider","data":{"background_color":"bg-default","_background_color":"field_68ee59152bcfb","text_color":"text-default","_text_color":"field_68ee59282bcfc","post_type":"insights","_post_type":"field_68ee3d2d956f1","insights_category":"","_insights_category":"field_690cbf013cb7f","cases_category":"","_cases_category":"field_690cc27637baf","title":"Latest Insights","_title":"field_68ee40af423e4","button":{"title":"Alle Insights","url":"#","target":""},"_button":"field_68ee40be423e5","variation":"default","_variation":"field_699c2a3d27a8d","slider_size":"normal","_slider_size":"field_699d_slider_size"},"mode":"edit"} /-->
```

---

## Conversion & Contact

### ContactExtended (Terminal CTA with Contact Cards)
Note: The only contact/CTA module. Typically `bg-primary-dark` + `text-white`; `hello_gradient_color` / `hello_gradient_end_color` colour the HELLO wordmark. `contacts` is a repeater of cards, each with a nested `contact_entries` repeater (label/value pairs such as MAIL / DIREKT). Place second-to-last before `LatestPosts`, or last.
```html
<!-- wp:acf/contactextended {"name":"acf/contactextended","data":{"background_color":"bg-primary-dark","_background_color":"field_ce2a8f1100bg1","text_color":"text-white","_text_color":"field_ce2a8f1100tg1","hello_gradient_color":"bg-primary-green","_hello_gradient_color":"field_ce2a8f1100hg1","hello_gradient_end_color":"bg-primary","_hello_gradient_end_color":"field_ce2a8f1100hg2","headline":"Lassen Sie uns über Ihr Projekt sprechen","_headline":"field_ce2a8f11001e2","headline_tag_selector":"h2","_headline_tag_selector":"field_ce2a8f11001e3","introduction":"Im Erstgespräch klären wir Ziele, Umfang und Zeitplan. Sie erhalten danach ein Festpreisangebot.","_introduction":"field_ce2a8f1100int","cta":{"title":"Erstgespräch vereinbaren","url":"/kontakt/","target":""},"_cta":"field_ce2a8f11001e5","button_variation":"primary","_button_variation":"field_ce2a8f11001e6","partner_section_label":"Ihr Ansprechpartner","_partner_section_label":"field_ce2a8f1100pl1","contacts_0_photo":"","_contacts_0_photo":"field_ce2a8f1100ph1","contacts_0_person_name":"Uli Hattenberger","_contacts_0_person_name":"field_ce2a8f1100pn1","contacts_0_role":"Geschäftsführer","_contacts_0_role":"field_ce2a8f1100rl1","contacts_0_contact_entries_0_entry_label":"MAIL","_contacts_0_contact_entries_0_entry_label":"field_ce2a8f1100ce2","contacts_0_contact_entries_0_entry_value":"hallo@hattenbergerpartner.de","_contacts_0_contact_entries_0_entry_value":"field_ce2a8f1100ce3","contacts_0_contact_entries":1,"_contacts_0_contact_entries":"field_ce2a8f1100ce1","contacts":1,"_contacts":"field_ce2a8f11001e8"},"mode":"edit"} /-->
```

---

## Utility & Structural

### Divider
Note: Simple visual separator. `direction` is `rotate-0` or `rotate-180` (flips the diagonal). Use between sections sharing the same background color.
```html
<!-- wp:acf/divider {"name":"acf/divider","data":{"background_color":"bg-default","_background_color":"field_68e380f9d75b2","divider_color":"bg-primary","_divider_color":"field_68e38109d75b3","direction":"rotate-0","_direction":"field_68e3824186293"},"mode":"edit"} /-->
```

### Accordion
Note: `accordion_repeater` contains expandable items. `first_item_open:"1"` opens the first accordion by default.
```html
<!-- wp:acf/accordion {"name":"acf/accordion","data":{"overline":"Overline Lorem ipsum dolor","_overline":"field_6672a2782ca4f","headline":"Accordion Headline","_headline":"field_617bdcb05d9ac","subline":"Lorem ipsum dolor","_subline":"field_617bdcbc5d9ad","accordion_repeater_0_title":"Lorem ipsum dolor","_accordion_repeater_0_title":"field_617bde635d9b0","accordion_repeater_0_content":"Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.","_accordion_repeater_0_content":"field_617bde6b5d9b1","accordion_repeater":1,"_accordion_repeater":"field_617bde205d9ae","background_color":"bg-default","_background_color":"field_6362598d3bf39","text_color":"text-default","_text_color":"field_636259a13bf3a","overlineheadlinesubline_alignment":"left","_overlineheadlinesubline_alignment":"field_6672a0f52ca4e","accordion_position":"left","_accordion_position":"field_654a2d360fc52","headline_tag_selector":"h2","_headline_tag_selector":"field_64ac067935d33","first_item_open":"0","_first_item_open":"field_626be5c9218fb"},"mode":"edit"} /-->
```

### Badges (Award / Partner Logos)
Note: Either a simple `badges_gallery` (IDs) or `badges_repeater` with image + link pairs for clickable badges.
```html
<!-- wp:acf/badges {"name":"acf/badges","data":{"background_color":"bg-default","_background_color":"field_698eeb38b70aa","text_color":"text-default","_text_color":"field_698eeb46b70ab","headline":"Auszeichnungen & Partner","_headline":"field_698eeb55b70ac","headline_tag_selector":"h2","_headline_tag_selector":"field_698eeb61b70ad","badges_gallery":"","_badges_gallery":"field_698eeb7bb70ae","badges_repeater_0_image":"","_badges_repeater_0_image":"field_698eebadb70b0","badges_repeater_0_link":{"title":"Zum Partner","url":"#","target":"_blank"},"_badges_repeater_0_link":"field_698eebb9b70b1","badges_repeater":1,"_badges_repeater":"field_698eeb97b70af"},"mode":"edit"} /-->
```

### EndSideContent
Note: Structural marker only. Place in insights/blog posts after the main content to mark where sidebar content ends. No configurable fields.
```html
<!-- wp:acf/endsidecontent {"name":"acf/endsidecontent","data":{},"mode":"edit"} /-->
```
