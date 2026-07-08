# Modatrend → Shopify Rebuild Plan

Companion to [`site-analysis.md`](site-analysis.md). This is the build playbook: theme starting point, files to touch, custom sections to create, order of work, and mobile-first + testing checklists.

**Recommended base theme:** **Dawn** (latest Shopify Online Store 2.0 reference theme). It already provides header + mega-menu, AJAX cart drawer, collection filtering (facets), PDP media gallery + variant picker, and footer — reskin instead of rebuilding. Keep **cart + checkout native**.

---

## 1. Theme files that will likely need edits

> Paths assume a Dawn-based theme. "Edit" = restyle/adjust existing; "Create" = net-new (see §2).

### Config / global
- `config/settings_schema.json` — add theme settings: brand color (`#E1137D`), Quicksand font, WhatsApp number/message, announcement/utility content, badge text ("24 Saatte Kargoda", "Extra %10"), trust-logo list.
- `config/settings_data.json` — set the reskin values (colors, typography, corner-radius = 0).
- `layout/theme.liquid` — Quicksand font link/preload, global meta, `<html lang="tr">`, WhatsApp FAB + third-party embeds (Insider/cargo) placement.
- `assets/base.css` (or a new `assets/modatrend.css`) — **design-token layer** (CSS vars, flat/square buttons, product-bg gray, container width ~1250px).
- `locales/tr.json` (+ `tr.default.json`) — Turkish UI strings.

### Header / nav
- `sections/header.liquid` + `header-group.json` — 3-row desktop layout (utility bar → logo/search/account/cart → nav); **fixed compact mobile header (40px)**; cart count badge.
- `snippets/header-search.liquid`, `snippets/cart-icon-bubble.liquid` — restyle.
- Mega-menu + mobile drawer partials (Dawn: `header-drawer`, `mega-menu`) — imaged mega-menu; uppercase mobile list with `»` drill-in + magenta active item.

### Collection / search
- `sections/main-collection-product-grid.liquid` — grid, product count, **density toggle (3/4-up)**.
- `sections/facets.liquid` / `snippets/facets.liquid` — horizontal dropdown filter bar (desktop) + **`FİLTRELEME` / `SIRALAMA` drawers (mobile)**; "hide sold-out" toggle; sort.
- `templates/collection.json`, `templates/search.json` — search reuses the collection grid.

### Product
- `sections/main-product.liquid` — two-column PDP; media gallery + thumbnails + code badge overlay; buy box order (title/SKU → price box → colors → size → qty+ATC → accordions).
- `snippets/price.liquid` — struck + magenta sale price + **`%NN İndirim` badge** + **`Extra %10` pill** + installment line.
- `snippets/product-variant-picker.liquid` / `buy-buttons.liquid` — **square size boxes** (magenta border when selected), qty stepper, full-width magenta ATC, favorites.
- `sections/related-products.liquid` — "Benzer Ürünler" carousel.

### Cart
- `snippets/cart-drawer.liquid` + `assets/cart.js` — mini-cart matching the Modatrend drawer (title, SKU, size, subtotal, black CTAs) using the **Cart AJAX API**. Checkout stays native.

### Footer
- `sections/footer.liquid` + `footer-group.json` — 5-column links + ETBIS QR + socials + app badges + **trust/payment logo strip** + SEO text + copyright; **mobile `+` accordions**.

### Reused snippet
- `snippets/product-card.liquid` (aka `card-product`) — **the priority rewrite**: green ship ribbon, `Ü-KODU` pill, favorite heart, dual price + `%İndirim` badge + `Extra %10` bar, desktop hover **quick-size boxes**.

---

## 2. Custom sections/snippets to create
| File | Purpose |
|---|---|
| `sections/utility-bar.liquid` | Top gray bar: help links, WhatsApp line, favorites (blocks-driven) |
| `sections/hero-slider.liquid` | Home hero; each slide = block (image, mobile image, overlay CTA link) |
| `sections/category-promo-grid.liquid` | Home pastel category tiles (image + label + link) |
| `snippets/product-card.liquid` | Master product card (all badges/prices/quick-size) |
| `snippets/size-swatches.liquid` | Square size-box variant UI |
| `snippets/badges.liquid` | `%NN İndirim` square + `Extra %10` pill + `24 Saatte Kargoda` ribbon |
| `snippets/collapsible-row.liquid` | PDP + footer accordions |
| `snippets/facets-mobile.liquid` | `FİLTRELEME` / `SIRALAMA` mobile drawers |
| `snippets/whatsapp-fab.liquid` | Floating WhatsApp button (setting-driven, PDP passes product URL) |
| `sections/newsletter.liquid` | E-bülten band (or reuse Dawn's) |
| `snippets/trust-logos.liquid` | Payment/security logo strip |

**Catalog modeling decision (do first — see analysis §8):**
- Preferred: **one product, options = Color + Size** (true variants). Requires importer that merges the current per-color products and sets up 301 redirects from old color URLs.
- Alternative: keep color as **linked separate products** via a `product.metafields.custom.color_group` list rendered in "Renkler".
- The **displayed "Extra %10" price** likely needs a metafield or small JS calc to render on cards/PDP even before the discount applies at checkout (Shopify automatic discount handles the actual cart math).

---

## 3. Suggested implementation order
1. **Foundation** — spin up Dawn dev theme; add Quicksand + token CSS; set colors/radius; `lang="tr"` + `tr` locale.
2. **`product-card.liquid`** — build + verify on a collection (badges, dual price, quick-size, ribbon, heart).
3. **Header + mobile fixed nav + hamburger drawer + search + cart bubble.**
4. **Collection template** — grid, density toggle, desktop filter bar, mobile filter/sort drawers, sort, hide-sold-out. Point **Search** template at the same grid.
5. **PDP** — gallery/thumbnails/code badge, price box (badge + pill + installment), size boxes, qty, ATC, favorites, accordions (specs/reviews/suggestions), related carousel.
6. **Cart drawer** (AJAX) → verify hand-off to native cart/checkout; wire discounts/gift cards.
7. **Home** — utility bar, hero slider, category promo grid, featured carousels.
8. **Footer + newsletter + trust logos + WhatsApp FAB.**
9. **Content pages** (About/Contact/FAQ/Stores/legal) via Pages + `page` templates; Blog.
10. **Integrations** — re-add Insider (web-push), cargo tracking, analytics via app embeds/script tags.
11. **QA pass** — the testing checklist in §5.

---

## 4. Mobile-first checklist
- [ ] Build/verify every component at **390px first**, then scale up (do not design desktop-down).
- [ ] **Fixed compact mobile header (40px)** stays pinned on scroll; content offset by header height; cart badge updates live.
- [ ] Hamburger **drawer**: slide-in, dark overlay, `✕` close, uppercase list, magenta active, `»` drill-in for subcategories; body scroll-locked while open.
- [ ] Product grid **2-up** on mobile; tap targets ≥ 44px; quick-size accessible (tap, not hover) on touch.
- [ ] Collection filters via **`FİLTRELEME` / `SIRALAMA`** drawers; checkbox facet lists; applied-filter chips; result count updates.
- [ ] PDP: swipeable gallery + thumbnails; size boxes ≥ 44px; **sticky add-to-cart** consideration on mobile; accordions collapsed except specs.
- [ ] **Cart drawer** full-height on mobile; sticky subtotal + CTA.
- [ ] Footer columns collapse to **`+` accordions**.
- [ ] WhatsApp FAB doesn't overlap the ATC/sticky bars.
- [ ] Define a clean **768px tablet** layout (fix the nav-wrap/search-crowding seen on the source).
- [ ] Test iOS Safari + Android Chrome (100vh, fixed-header, input zoom on focus — set 16px inputs or `maximum-scale`).

## 5. Testing checklist
**Visual parity**
- [ ] Side-by-side vs `/screenshots` at 390 / 768 / 1440 for home, collection, PDP, cart.
- [ ] Tokens exact: magenta `#E1137D`, Quicksand, 0-radius buttons/cards/size-boxes, gray struck price `#959595`, green ribbon.
- [ ] Badges/pills render correctly ( `%NN İndirim`, `Extra %10`, `24 Saatte Kargoda`, `Ü-KODU`).

**Functional**
- [ ] Add to cart → drawer opens with correct image/title/size/subtotal; count badge increments.
- [ ] Size selection required before ATC; selected state = magenta border; sold-out sizes disabled.
- [ ] Color "Renkler" navigates/swaps per catalog model; canonical + redirects correct.
- [ ] Qty stepper (drawer + PDP + cart) updates line + totals.
- [ ] Collection facets filter correctly; sort; hide-sold-out; density toggle; pagination/lazy-load for 500+ products.
- [ ] Search (`/search?q=`) returns results in the collection grid.
- [ ] Cart → **native checkout**; automatic "%10 extra" discount + gift card ("Hediye Çeki") apply correctly; totals match displayed prices.
- [ ] Newsletter signup posts to Shopify customer/marketing.
- [ ] WhatsApp FAB deep-links with prefilled message (+ product URL on PDP).

**Non-visual**
- [ ] Turkish characters (İ/ı, ₺) + `money` filter formatting correct site-wide.
- [ ] Accessibility: bump base font toward 14px, check contrast, focus states, alt text, keyboard nav for menu/drawers/accordions.
- [ ] Lighthouse mobile: LCP on hero/PDP image, no CLS from badges/sticky header, lazy-load images.
- [ ] SEO: titles/meta, breadcrumb JSON-LD, product JSON-LD, 301 redirects from old Ticimax URLs (products, categories, `/Arama`).
- [ ] Third-party embeds load without blocking; consent where required (KVKK).
- [ ] Cross-browser: iOS Safari, Android Chrome, desktop Chrome/Firefox/Safari/Edge.
