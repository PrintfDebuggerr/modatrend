# Modatrend — Shopify Theme

Rebuild of [modatrend.com.tr](https://www.modatrend.com.tr/) (a Turkish footwear store, currently on Ticimax) as a custom **Shopify Online Store 2.0** theme.

Built on top of Shopify's [skeleton-theme](https://github.com/Shopify/skeleton-theme) starter.

## Structure

```
.
├── assets/        # CSS, JS, SVG icons
├── blocks/        # Theme blocks
├── config/        # settings_schema.json, settings_data.json
├── layout/        # theme.liquid, password.liquid
├── locales/       # Translations (tr + en)
├── sections/      # Section files
├── snippets/      # Reusable snippets (product-card, price, badges, …)
├── templates/     # JSON templates
└── docs/          # Design research & rebuild plan
    ├── site-analysis.md          # Full visual/UX analysis of the source site
    ├── shopify-rebuild-plan.md   # File-by-file build plan + checklists
    └── screenshots/              # Reference screenshots (desktop/mobile/tablet)
```

## Design reference

Start with [`docs/site-analysis.md`](docs/site-analysis.md) for design tokens
(brand magenta `#E1137D`, Quicksand type, flat/square components) and
[`docs/shopify-rebuild-plan.md`](docs/shopify-rebuild-plan.md) for the build order.

## Local development

```bash
# Requires the Shopify CLI (https://shopify.dev/docs/themes/tools/cli)
shopify theme dev --store your-store.myshopify.com
```

Lint with [Theme Check](https://shopify.dev/docs/themes/tools/theme-check):

```bash
shopify theme check
```
