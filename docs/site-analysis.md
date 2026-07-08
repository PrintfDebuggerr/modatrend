# Modatrend.com.tr — Site Analysis & Shopify Rebuild Reference

> Source site: <https://www.modatrend.com.tr/> — a women's/men's/kids **footwear** e-commerce store (Turkish, ₺ TRY).
> Current platform: **Ticimax** (SaaS storefront) with **Insider** (web-push / personalization) and a **coddepo** cargo-tracking widget. The checkout is a separate **React SPA** at `/checkout`.
> Goal of this document: capture the visual design + user flows precisely enough to rebuild the storefront (home, collection, product, cart) in **Shopify (Liquid + CSS + minimal JS)** with high visual fidelity. Mobile is the priority.

All screenshots referenced live under [`/screenshots`](screenshots/). Viewports captured: **Desktop 1440×900**, **Mobile 390×844**, **Tablet 768×1024**.

---

## 1. Overall design summary

- **Aesthetic:** Clean, bright, feminine, minimal-commercial. White canvas, lots of whitespace, flat cards (no borders/shadows), product photography on very light gray backgrounds. A single strong accent color (magenta/pink) drives all price/CTA emphasis.
- **Brand accent:** Magenta/pink `#E1137D` (≈ measured `#DF147B`–`#DF267B` across elements). Used for: logo second word ("**trend**"), active nav link, sale prices, discount badges, the "Extra %10" pill, the primary **SEPETE EKLE** (Add to cart) button, and favorite/heart icons.
- **Typography:** **Quicksand** (rounded geometric sans) for the entire UI. Notably small base size (12px body), 15px nav, 20px bold prices.
- **Layout system:** Centered fixed container ≈ **1250px** content width (max page ≈ 1440). Flat design language — **0px border-radius** on buttons/cards/size boxes; rounded only on pills/badges.
- **Personality cues:** Editorial italic serif headline *inside hero images* (e.g. "YENİ SEZON / SUMMER COLLECTION 2026", "ÇOCUK KOLEKSİYONU") — this is baked into the campaign artwork, not live text. Soft pastel gradient hero backgrounds.
- **Persistent conversion aids:** Floating WhatsApp order button (bottom-left, green), "24 Saatte Kargoda" (ships in 24h) green ribbons on cards, aggressive discount messaging (struck price + % badge + extra discount pill), installment pricing ("…'den başlayan taksitlerle").

---

## 2. Design tokens (measured from computed styles)

### Colors
| Token | Value | Usage |
|---|---|---|
| `--brand-pink` | `#E1137D` (≈ `#DF147B`) | Sale price text, active nav, size-selected border, headings accents |
| `--brand-pink-badge` | `#DF267B` | Discount % badge & "Extra %10" pill background |
| `--ink` | `#000000` / `#060606` | Primary text |
| `--muted` | `#959595` | Struck (regular) price, secondary text |
| `--line` | `#E1E1E1` | Size-box borders, dividers |
| `--bg` | `#FFFFFF` | Page background |
| `--bg-alt` | `~#F2F2F2 / #F5F5F5` | Utility bar, footer, filter bar, price box, section bands |
| `--product-bg` | `~#F5F5F5` | Image area behind product photos |
| `--ship-green` | `~#3DBE29` | "24 Saatte Kargoda" ribbon |
| `--checkout-green` | `~#1FA84D` | Primary CTA on the **/checkout** SPA (green, not magenta) |
| `--whatsapp-green` | `#25D366` | Floating WhatsApp button |
| `--voucher-lilac` | light purple pill | "%10 İndirim" / gift-voucher accents in cart |

> ⚠️ The magenta is inconsistent across the live site (`#DF147B`, `#DF267B`, `#E1137D`). **Standardize on one** (`#E1137D`) in the rebuild.

### Typography
- **Family:** `Quicksand, sans-serif` (Google Font). Fallback stacks also touch Arial/Calibri in a few legacy widgets.
- **Base body:** `12px` (very small — consider bumping to 14px for accessibility, see Risks).
- **Nav links:** `15px / 400`, padding `0 15px`.
- **Sale price:** `20px / 700` magenta.
- **Struck price:** `12px / 400` gray, `line-through`.
- **Extra-discount pill price:** `16px / 700` white on magenta.
- **Buttons (SEPETE EKLE):** uppercase, ~white, bold.

### Shape / spacing
- **Border radius:** Buttons `0px`, cards `0px`, size boxes `0px`. Pills/badges rounded (`5px`+ / full). Price mini-badge on cards is a **square** magenta block.
- **Shadows:** None on cards (flat). Slight elevation only on floating buttons and drawers.
- **Container width:** ~`1250px` inner content, centered.
- **Card grid:** Desktop 3-up default (toggle to 4-up); Tablet 2-up; Mobile 2-up.

### Buttons
| Button | Style |
|---|---|
| Primary add-to-cart (PDP/card) | Full-width, magenta `#E1137D`, white uppercase text, square corners, tall (~56px) |
| Qty stepper | `– [ 1 ] +` pill/box, light gray |
| Cart drawer CTAs | **Black** full-width bars: "Alışverişe Devam Et", "Sipariş Tamamla" |
| Checkout SPA CTA | **Green** "Alışverişi Tamamla" |
| Text/ghost links | Underlined magenta or black (e.g. "ALIŞVERİŞE BAŞLA", "Ölçü Tablosu", "Ödeme Seçenekleri") |

---

## 3. Global components

### 3.1 Header
**Desktop** — 3 stacked rows ([global/header.png](screenshots/global/header.png)):
1. **Utility bar** (gray bg): left links `Yardım` · `Blog` · `🚚 Kargom Nerede?`; right: `📞 Whatsapp Sipariş Hattı 0553 836 16 65` and `♡ FAVORİLERİM`.
2. **Main bar** (white): **logo** (modatrend, "trend" in magenta) · centered **search** field with magenta search icon · `👤 ÜYE GİRİŞİ / ÜYE OL` · `🛍 SEPETİM` with count badge.
3. **Nav bar** (white): `Yeni Ürünler` (magenta = active) · `Terlik` · `Sandalet` · `Spor & Sneaker` · `Günlük` · `Babet` · `Topuklu` · `Erkek Ayakkabı` · `Çocuk Ayakkabı` · `Bot` · `Çizme`. Several parents open a **mega-menu with images** ("ResimliMenu").

**Mobile** — compact **fixed** bar (40px tall, `z-index:999`, stays pinned on scroll) ([home/mobile-viewport.png](screenshots/home/mobile-viewport.png)):
- Left cluster: `☰ Menü` (hamburger) · `🔍` search · `🚚` cargo.
- Center: logo.
- Right: `👤` account · `🛍` cart (with count badge).

**Scroll behavior:** Desktop header is **NOT sticky** (scrolls away). Mobile header **IS fixed/sticky**.

### 3.2 Mobile menu (hamburger)
[home/mobile-menu-open.png](screenshots/home/mobile-menu-open.png) — Left slide-in **drawer**, white, full-height, with dark page overlay + `✕` close (top-right on the overlay). Uppercase category list; `YENİ ÜRÜNLER` highlighted magenta at top. Items with subcategories show a `»` chevron (drill-in). Order matches desktop nav.

### 3.3 Footer
[global/footer.png](screenshots/global/footer.png) — light gray band:
- **5 columns:** `ALIŞVERİŞ BİLGİLERİ` (Hesabım, Siparişlerim, Beğendiklerim, İade Taleplerim, Kargom Nerede?) · `MÜŞTERİ HİZMETLERİ` (Kullanıcı Sözleşmesi, İade-İptal, Kargo & Teslimat, SSS, Sipariş) · `KURUMSAL` (Hakkımızda, Mağazalarımız, İletişim, Blog, İşlem Rehberi, Gizlilik & KVKK) · `ETBIS` (gov verification **QR code**) · `SOSYAL MEDYA` (FB, X, Instagram, TikTok, Pinterest, YouTube) + `MOBİL UYGULAMALARIMIZ` (App Store, Google Play badges).
- **Trust/payment strip:** "İNTERNETTE GÜVENLİ ALIŞVERİŞ" + logos (RapidSSL, World, Maximum, Bonus, Axess, CardFinans, Paraf, Advantage, Visa, Mastercard, Express).
- **SEO paragraph** (long descriptive brand copy).
- **Copyright bar:** "©2026 Modatrend Ayakkabı Tekstil San ve Tic A.Ş." + Ticimax credit.
- **Mobile footer** collapses each column into a `+` accordion.

### 3.4 Newsletter ("E-bülten Üyelik")
Full-width gray band with heading + email input + `Gönder` submit. Appears above the footer on inner pages ([search/search-results-desktop.png](screenshots/search/search-results-desktop.png), [product/mobile-full.png](screenshots/product/mobile-full.png)).

### 3.5 Floating / overlay elements
- **WhatsApp button** — fixed bottom-left, green circle, deep-links to WhatsApp with a prefilled order message (and product URL on PDPs).
- **Insider web-push opt-in** — third-party banner on first visit: *"modatrend.com.tr masaüstü bildirimlerine ekleyin… özel fırsatlardan haberiniz olsun ister misiniz?"* with `Daha Sonra` / `Evet`. Cookie-gated (fires once). **Third-party — out of scope for the Liquid theme.**
- **coddepo** "Kargom Nerede?" cargo-tracking popup (third-party widget).

---

## 4. Page-by-page breakdown

### 4.1 Home — [home/desktop-full.png](screenshots/home/desktop-full.png) · [home/mobile-full.png](screenshots/home/mobile-full.png)
**Structure (top→bottom):**
1. Header (see §3.1).
2. **Hero slider** — full-width, soft pastel gradient background, editorial serif headline burned into the artwork, product cut-outs, left/right arrows, `ALIŞVERİŞE BAŞLA` (Start shopping) text-link CTA. Multiple slides (e.g. "ÇOCUK KOLEKSİYONU", "KADIN KOLEKSİYONU", "YENİ SEZON").
3. **Category promo grid** — large image cards linking to categories (Kadın Terlik, Kadın Sandalet, Spor, Günlük, Topuklu, Erkek, Çocuk…). Pastel gradient tiles with centered labels; 2-up on mobile/tablet, multi-column on desktop.
4. **Featured product carousel(s)** — horizontal rows of product cards (New Products / best sellers) using the standard product card (§5).
5. **Newsletter band** (§3.4).
6. Footer (§3.3).

**Mobile behavior:** Fixed compact header; hero and promo tiles stack; product cards go 2-up.

### 4.2 Collection / category — [collection/desktop-full.png](screenshots/collection/desktop-full.png) · [collection/mobile-full.png](screenshots/collection/mobile-full.png)
- **Breadcrumb** (Anasayfa > Bayan Ayakkabı > Topuklu).
- **Filter bar** (gray panel): dropdowns `NUMARA` (size) · `RENK` (color) · `MATERYAL` · `TOPUK BOYU` (heel height) · `TOPUK TİPİ` (heel type) · `Sıralama Seçiniz` (sort) · checkbox `Tükenen Ürünleri Gösterme` (hide sold-out).
- **Toolbar:** product count ("591 Ürün listeleniyor") + **grid-density toggle** (3-up / 4-up, active icon magenta).
- **Product grid** (§5). Long category **SEO text** with "Devamını Gör" (read more) + newsletter + footer at bottom. Pagination/lazy-load for 500+ items.
- **Mobile:** filter bar collapses into two buttons **`FİLTRELEME`** and **`SIRALAMA`**; tapping Filter expands inline accordion dropdowns; each dropdown opens a **checkbox list** ([collection/filters-open.png](screenshots/collection/filters-open.png), e.g. NUMARA → 35–42). Grid is 2-up.

### 4.3 Product (PDP) — [product/desktop-full.png](screenshots/product/desktop-full.png) · [product/mobile-full.png](screenshots/product/mobile-full.png)
**Desktop — two columns:**
- **Left (gallery):** large main image with a **product-code badge** (`Ü-KODU EL239`) overlaid top-right; thumbnail rail; a floating **3D/AR view** + download control on the far right. A rotated **`%24 İndirim`** square badge overlays on mobile.
- **Right (buy box):**
  - Breadcrumb + `‹ Önceki Sayfaya Dön`.
  - **Title** (`<h1>`) + **Stok Kodu** (SKU).
  - **Price block** in a light-gray box: struck regular price (gray), **sale price** (magenta 20px bold), **`%24 İndirim`** square badge, installment line ("₺117,64 'den başlayan taksitlerle"), **`Extra %10 İndirim 836,99 TL`** magenta pill. Link `Ödeme Seçenekleri` (payment options popup).
  - **`Renkler`** (colors) — variant thumbnails linking to sibling products (each color is a separate product/URL).
  - `Ölçü Tablosu` (size chart) link.
  - **`Numara`** (size) — row of square size boxes (36–40). Selected = **magenta border** (`#E1137D`); border gray otherwise. A WhatsApp "ask" button + "+" sit alongside.
  - **Qty stepper** (`– 1 +`) + **`SEPETE EKLE`** full-width magenta button + **Favorilere Ekle** (add to favorites).
  - **Accordions:** `Ürün Özellikleri` (open by default — bullet spec list + spec table: Renk, Materyal, Topuk Boyu, Topuk Tipi) · `Yorumlar(0)` (reviews) · `Ürün Önerileri` (product suggestions).
- **`Benzer Ürünler`** (similar products) carousel — product cards with green "24 Saatte Kargoda" ribbon + arrows + dots.
- Newsletter + footer.

**Interactions verified:**
- **Variant (size) select** → box gains magenta border ([product/variant-selected.png](screenshots/product/variant-selected.png)).
- **Add to cart** → opens a **mini-cart drawer/modal** ([product/cart-after-add.png](screenshots/product/cart-after-add.png)).
- Color variants are **separate product URLs** (not JS variant swaps).

### 4.4 Cart drawer (mini-cart) — [cart/drawer-open.png](screenshots/cart/drawer-open.png)
Slides in after add-to-cart. Contents: product thumbnail, **magenta title**, SKU + product code + `Numara: 38`, unit price + qty, `Toplam Ürün Adedi` (item count), **`Ara Toplam`** (subtotal), and two **black** full-width CTAs: `Alışverişe Devam Et` (keep shopping) and `Sipariş Tamamla` (complete order → /checkout).

### 4.5 Cart page / checkout SPA — [cart/cart-page-desktop.png](screenshots/cart/cart-page-desktop.png) · [cart/cart-page-mobile.png](screenshots/cart/cart-page-mobile.png)
Separate **React app** at `/checkout` with a **stripped header** (logo + account only).
- **Left:** `Sepet (1)` + `Sepeti Temizle` (clear); cart line with image, title, `Tahmini Teslim Süresi: 1 Gün` (est. delivery), size chip, qty stepper (trash + `1` + `+`), struck + **green** price, `%10 İndirim` lilac pill; `Alışverişe Devam Et` link; **`Hediye Çeki Kullan`** (gift voucher) card.
- **Right (desktop):** **`Sipariş Özeti`** summary card — `Sepet Tutarı`, `%10 İndirim (−₺93,00)`, `Toplam Tutar`, big **green `Alışverişi Tamamla`** button.
- **Mobile:** single column with a **sticky bottom bar** (total + green CTA).
> This entire flow is Ticimax's checkout. In Shopify it is replaced by **Shopify's native cart + checkout** (do not rebuild in Liquid).

### 4.6 Search — [search/search-results-desktop.png](screenshots/search/search-results-desktop.png)
`GET /Arama?kelime=<term>`. Results page **reuses the collection template** (same filter bar + product grid + count, e.g. "564 Ürün listeleniyor"). Header search field autosubmits on Enter.

### 4.7 Content pages
Standard CMS pages exist for: Hakkımızda (About), İletişim (Contact), Sıkça Sorulan Sorular (FAQ), Mağazalarımız (Stores), Kargo & Teslimat, İade-İptal, Kullanıcı Sözleşmesi, Gizlilik & KVKK, İşlem Rehberi, plus an external Blog (`blog.modatrend.com.tr`). These are simple rich-text/legal pages → Shopify **Pages** + a generic `page` template.

---

## 5. Product card (the most-reused component)
[collection/desktop-card-hover.png](screenshots/collection/desktop-card-hover.png)

- **Container:** flat, no border/shadow/radius; image sits on light-gray (`~#F5F5F5`).
- **Overlays:** green **`🚚 24 Saatte Kargoda`** ribbon (top-left) · gray **`Ü-KODU <code>`** pill (top-right) · **♡ favorite** heart (bottom-right, magenta outline).
- **Body:** product **title** (small, centered) · **`%NN İNDİRİM`** square magenta badge + **sale price** (magenta bold) + **struck** regular price (gray) · full-width **`Extra %10 İndirim <price> TL`** magenta bar.
- **Hover (desktop):** reveals **quick size boxes** (36–40) for fast selection/add.
- Whole card links to the PDP.

---

## 6. Component inventory → Shopify section/snippet mapping

| # | Component | Reuse | Shopify target |
|---|---|---|---|
| 1 | Utility/announcement bar | global | `sections/announcement-bar.liquid` (or header group) |
| 2 | Header (3-row desktop / fixed mobile) + search + cart count | global | `sections/header.liquid` + `snippets/` |
| 3 | Mega-menu (imaged) + mobile drawer | global | Header section + `snippets/mega-menu.liquid`, `snippets/mobile-nav.liquid` |
| 4 | Hero slider | home | `sections/hero-slider.liquid` (blocks = slides) |
| 5 | Category promo grid | home | `sections/collection-list.liquid` / `image-banner-grid` |
| 6 | Featured product carousel | home, PDP | `sections/featured-collection.liquid` + `snippets/product-card.liquid` |
| 7 | **Product card** | everywhere | `snippets/product-card.liquid` (badges, prices, quick-size) |
| 8 | Collection filter bar + sort + density toggle | collection, search | `sections/main-collection.liquid` + `snippets/facets.liquid` |
| 9 | Mobile filter/sort drawers | collection | `snippets/facets-mobile.liquid` |
| 10 | PDP gallery + thumbnails | product | `sections/main-product.liquid` (media block) |
| 11 | PDP buy box (price/variant/size/qty/ATC) | product | `main-product` blocks |
| 12 | Size selector (square boxes) | product, card hover | `snippets/size-swatches.liquid` |
| 13 | Discount/percent badges + "Extra %10" pill | card, PDP | `snippets/price.liquid`, `snippets/badges.liquid` |
| 14 | PDP accordions (specs/reviews/suggestions) | product | `snippets/collapsible.liquid` |
| 15 | Similar products carousel | product | `sections/related-products.liquid` |
| 16 | Mini-cart drawer | global | `snippets/cart-drawer.liquid` + Cart AJAX API |
| 17 | Newsletter band | inner pages | `sections/newsletter.liquid` |
| 18 | Footer (5-col + trust + SEO + accordions) | global | `sections/footer.liquid` |
| 19 | Trust/payment logo strip | footer | footer block |
| 20 | Floating WhatsApp button | global | `snippets/whatsapp-fab.liquid` (theme setting) |
| 21 | Cart / checkout | global | **Shopify native cart + checkout** (not rebuilt) |

---

## 7. Rebuild priority list (mobile-first)
1. **Design tokens + base CSS** (Quicksand, color vars, flat/square button system, container).
2. **Product card snippet** (badges, dual price, quick-size) — highest reuse.
3. **Header + mobile fixed nav + hamburger drawer + search.**
4. **Collection template** (grid + filters/sort + density toggle) — also powers Search.
5. **PDP** (gallery, buy box, size boxes, qty, ATC, accordions, related).
6. **Cart drawer** (AJAX) → hand off to Shopify cart/checkout.
7. **Home** (hero slider, category promo grid, featured carousels).
8. **Footer + newsletter + WhatsApp FAB.**
9. **Content pages** (About/Contact/FAQ/legal).

---

## 8. Risks / hard parts
- **Color variants = separate products.** Ticimax models each color as its own product/URL, linked via "Renkler". In Shopify the natural model is **one product, color as a variant option**. Decide: (a) replicate "linked separate products" via a metafield/"grouped products" list, or (b) consolidate to true variants (cleaner, but requires data remapping + URL redirects). This affects catalog import and the "Renkler" UI.
- **Size as the purchasable variant.** Sizes (35–42) are the real variants → straightforward Shopify option, but must combine with the color decision above (single vs multi-option).
- **Checkout is external now.** Current `/checkout` is a Ticimax SPA (green CTA). Shopify replaces it — the **green** cart CTA and gift-voucher/"Hediye Çeki" map to Shopify discount codes / gift cards; the "%10 extra" logic maps to Shopify **automatic/script discounts** (or Functions).
- **"Extra %10 İndirim" pricing.** Shown as a computed second price everywhere. Reproduce via automatic discount + display logic; the *displayed* extra price on cards/PDP may need a metafield or JS calc to match exactly.
- **Installment text** ("…'den başlayan taksitlerle") is a TR payment-gateway feature; Shopify TR gateways differ — treat as static/estimated messaging.
- **Small base font (12px)** and low-contrast grays → accessibility concern; recommend nudging to 14px base and checking contrast during rebuild.
- **Mega-menu with images** ("ResimliMenu") needs a custom block model in the header section.
- **Tablet breakpoint is rough** on the current site (nav wraps, utility bar crowds search) — opportunity to improve, define a clean 768px layout.
- **Third-party widgets** (Insider web-push, coddepo cargo tracking, WhatsApp) are integrations, not theme code — re-add via app embeds/script tags, not Liquid.
- **Turkish characters & currency** (₺, İ/ı casing) — ensure UTF-8 + locale-correct formatting/`money` filter.

---

## 9. Fastest Shopify implementation strategy
- **Start from Dawn** (Shopify's reference OS 2.0 theme). It already ships header, mega-menu, cart drawer (AJAX), collection facets, PDP media/variant picker, and a footer — ~70% of the structure. Reskin to match rather than build from zero.
- **Reskin via `settings_data.json` + a token CSS layer** first (font = Quicksand, accent = `#E1137D`, radius = 0, flat cards), then override the few components that differ (square size boxes, dual-price + "Extra %10" pill, badge overlays, green ribbon).
- **Rewrite `product-card.liquid`** to match badges/prices/quick-size — this single snippet carries most of the visual identity across home/collection/search/PDP-related.
- **Use Dawn's native facets** for the filter bar; restyle to the horizontal dropdown look on desktop and the `FİLTRELEME`/`SIRALAMA` drawers on mobile.
- **Keep cart/checkout native** (drawer + Shopify checkout); don't port the Ticimax SPA.
- **Catalog decision up front** (variants vs linked products) — it gates the importer and the PDP "Renkler" UI, so resolve it before building the PDP.
