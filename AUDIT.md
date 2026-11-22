# Omkar Software Studio CSS / Layout Audit

Scope: all 20 HTML files, `css/style.css`, `js/main.js`, and browser checks at 320, 375, 425, 768, 1024, 1440 and 1920px.

## Baseline

- 20/20 pages have a valid viewport meta, one `h1`, a skip link, `main#main-content`, correct local CSS/JS paths, and no duplicate IDs.
- No horizontal scroll was reported at the required widths. However, `body { overflow-x: hidden; }` in `css/style.css:159` masks overflow and can break sticky positioning/scroll containers; it must not be treated as a layout fix.
- No JS console exceptions were reported.
- Footer text differs on one page (`index.html` uses "Business Software"; the other 19 pages use "Custom Business Software").
- Canonical and Open Graph URLs still use `https://www.example.com/` placeholders.
- 60 footer social links point to `#` placeholders (3 per page).

## Foundation / architecture

- `css/style.css` is 2,055 lines with 24 broadly named sections; responsive rules are duplicated across five unrelated breakpoints (`640`, `768`, `992`, `1024`, `360`) instead of a coherent mobile-first scale.
- Many repeated grid declarations reappear in several media queries: `.steps-grid`, `.card-grid`, `.footer__grid`, `.values-grid`, `.team-grid`, `.related-grid`, `.stats-grid`.
- Fixed widths are common (`760px`, `720px`, `610px`, `820px`, `850px`, `860px`, `520px`, `440px`, `360px`, `250px`); several would be better as `max-width`/`minmax()`/container-driven values.
- `css/style.css:159` globally hides horizontal overflow instead of fixing layout pressure.
- `.reveal` starts at `opacity: 0` (`css/style.css:1789`) with no no-JS fallback, so content can be invisible if JS fails.
- Reduced-motion handling is duplicated in CSS and JS, and `main.js:8` samples the preference only once.
- Z-index values are ad hoc (`20`, `90`, `100`, `200`) with no room for a mobile overlay.
- No `color-scheme` token, so native controls stay light in dark mode.
- Several CSS tokens are unused (`--space-5xl`, `--shadow-lg`, `--color-navy-600/700`); literal colors are used where tokens should be used.

## Navigation

- The desktop nav uses `.nav { display: block !important; }` (`css/style.css:1907`) to override the mobile state; this is brittle and makes `.nav--open` meaningless above 992px.
- Two submenu models coexist: mobile `display` toggling (`css/style.css:508-519`) and desktop opacity/visibility/transform (`css/style.css:1928-1955`), both keyed to `.nav__item--expanded`.
- Mobile/desktop nav targets are inconsistent and often under 44px: `.nav__link`/`.nav__subtoggle` padding (`css/style.css:473-488`, `1921-1926`), `.nav__sublink` (`523`), and the `≤360px` overrides (`2027-2031`).
- No mobile menu close button exists anywhere in the HTML/CSS/JS.
- No body scroll lock exists while the menu is open.
- Focus is restored to the toggle only on Escape (`main.js:123-128`); link clicks and outside clicks leave focus behind.
- No focus trap and no `inert`/`aria-hidden` handling for background content while the overlay is open.
- No resize/`matchMedia` listener closes the menu when crossing the desktop breakpoint.
- Active-link logic (`main.js:134-155`) does not strip query/hash from URLs and does not set active state on dropdown parents via aria.

## Header / branding

- `.logo { flex-shrink: 0; }` (`css/style.css:333`) plus theme/menu buttons leaves very little room at 320px; the `≤360px` block shrinks logo and controls to 32–38px, below 44px tap targets.
- `.logo__text span` is 0.6rem and then 0.5rem at `≤360px` (`css/style.css:355`, `2019`), too small for legibility.
- Header logo SVG differs slightly: `index.html:35-36` has two extra tick paths that other pages lack.
- Theme and menu toggles are 42px normally and 38px at `≤360px` (`css/style.css:371-372`, `2029-2030`).

## Typography / accessibility

- Input font-size is 0.95rem (`css/style.css:1571`), below 16px and therefore likely to trigger iOS zoom on focus.
- Placeholder opacity 0.75 (`css/style.css:1575-1578`) reduces contrast.
- Dark `--color-danger: #b3261e` (`css/style.css:37`) on dark surfaces fails contrast for `.form-error` and required asterisks.
- `.btn--light:hover` uses a dark token with fixed navy text (`css/style.css:91`, `598`) and has no dark-mode correction.
- Many small text sizes recur: 0.75rem hero badge, 0.8rem eyebrows/errors, and many 0.85–0.95rem component texts.
- `.form-success.focus()` (`main.js:501`) targets a non-focusable element.

## Components / layout consistency

- Card icon tiles use 48/52/46/44/84px and mixed radii (`css/style.css:826-838`, `854-865`, `890-904`, `1475-1488`, `1622-1631`, `1659-1664`).
- Card body text varies between 0.9, 0.92, 0.94 and 0.96rem; card titles vary between 1rem, 1.1rem, 1.15rem and the heading clamp.
- Hover lifts vary between -2px, -3px and -5px (`css/style.css:566`, `821`, `973`, `1219`).
- `.testimonial__text { min-height: 150px; }` (`css/style.css:1038`) forces empty space at some widths; animating dot width (`1074-1079`) causes layout thrash, and dot hit areas are only 11px.
- `.process__track { repeat(5, ...) }` (`css/style.css:1863`) assumes exactly five steps; the connector line uses magic values `top: 27px; left/right: 10%` (`1852-1860`) tied to the 54px marker.
- Marker background differs between `surface` and `bg` (`css/style.css:931`, `1875`).
- `.footer__grid { 1.4fr repeat(3, 1fr) }` (`css/style.css:1888`) hardcodes four columns.
- `.contact-details .contact-card:last-child { grid-column: 1 / -1; }` (`css/style.css:1994`) depends on DOM order.
- `.overview-card .service-card__link` (`css/style.css:1516`) is a fragile descendant-specific rule; `.overview-card` is not used directly in HTML.
- Bare `.logo__text span` and `.site-footer .logo` selectors are overly broad.
- `.faq__item { overflow: hidden; }` (`css/style.css:1392`) clips focus rings.
- Hero, CTA and page-banner decorations use fixed circles (`460px`, `520px`, `300px`, `360px`) with hardcoded rgba values instead of tokens (`css/style.css:669-683`, `1094-1104`, `1261-1271`).
- Page banners use fixed max widths `850px`/`700px` (`css/style.css:1303-1309`) rather than fluid containers.
- Legal content uses `max-width: 860px` (`css/style.css:1687`) and a fixed 5px left border; this can be tokenized.
- Social links are 38px (`css/style.css:1209`) and below the 44px minimum.
- `.btn--small` is 40px (`css/style.css:616`) and below the 44px minimum.
- Back-to-top is 46px with `z-index: 90`, below the header at `100` (`css/style.css:1754-1772`, `308`).

## Dark mode / visual polish

- Dark mode globally mutates brand tokens (`css/style.css:91-92`) instead of using dedicated semantic tokens.
- Footer colors are hardcoded in both themes (`css/style.css:1128-1236`).
- Theme is applied in the inline head script for one key only (`index.html:21` and equivalents), but `initTheme()` can override it at DOMContentLoaded, causing a flash/inconsistency for stored `light`.
- Accent underline on section headings (`css/style.css:273`) is a very short line and headings are not consistently centered across page types.
- No shared utility for centered headings, eyebrow rules, or consistent section spacing across all page types.

## JS-applied classes with no matching CSS/HTML definition

The following are intentionally applied by JS but not declared in static HTML: `back-to-top--visible`, `form-input--error`, `form-success--visible`, `nav--open`, `nav__item--expanded`, `nav__link--active`, `nav__sublink--active`, `reveal--visible`, `site-header--scrolled`, `testimonial__dot`, `testimonial__dot--active`. These are not errors, but the state model should be unified and documented in the rewritten CSS.

`testimonial__slide` and `testimonials` are queried by JS but have no CSS rules; `hero__content` exists only in `index.html:100`. `btn--light` and `btn--outline` are defined in CSS but never used.

## Responsive risk summary

- **320px:** highest risk; header pressure, sub-44px targets, tiny logo text, input zoom, no menu scroll lock.
- **375/425px:** high risk; single-column until 768px, 42px targets, overlay submenu scroll behavior unverified.
- **768px:** high risk; hero becomes two columns while process forces five columns with magic connector geometry; footer jumps to four columns.
- **1024px:** medium risk; desktop navigation has two dropdowns plus CTA with sub-44px links.
- **1440px:** low risk; 1200px container is stable, but dark contrast/focus issues remain.
- **1920px:** low risk; same 1200px cap with large gutters and no wide-screen treatment.

## Remediation implemented

1. Rewrote `css/style.css` with the requested commented section order, semantic tokens, fluid type/spacing, a single `.container`, mobile-first breakpoints, and `auto-fit`/`minmax()` card grids.
2. Removed `overflow-x: hidden` masking, replaced fixed widths with fluid constraints, normalized interactive targets to at least 44px, and made inputs at least 16px.
3. Split mobile overlay navigation from desktop navigation and added a close button, body scroll lock, focus trap/management, dropdown handling and `matchMedia` reset.
4. Normalized repeated header/footer markup across all pages and moved footer colors to tokens.
5. Added a no-JS reveal fallback, dynamic reduced-motion handling, and a flash-free theme bootstrap on every page.

## Verification results

- 20/20 pages: no horizontal overflow and no JS exceptions at 320, 375, 425, 768, 1024, 1440 and 1920px.
- 20/20 pages: 1 `h1`, no duplicate IDs, consistent header/footer text, correct CSS/JS paths.
- 1,053 internal links checked; no broken local links or anchors.
- 20 unique titles, descriptions, canonicals and matching Open Graph metadata.
- Interaction checks pass: menu open/close, close-button focus restoration, body scroll lock, dropdowns, Escape handling, desktop resize reset, 44px tap targets, 16px inputs, dark mode persistence, testimonial slider, FAQ accordion and reduced motion.
- `node --check js/main.js` passes; CSS audit reports 0 duplicate selectors and 0 HTML classes without CSS.
