# MurhoPrints

A self-contained streetwear frontend in HTML, CSS, and browser JavaScript. It carries over the original layout, responsive styling, local fonts, scroll reveals, springs, hover effects, drawers, and dialogs, with new MurhoPrints branding and streetwear imagery.

## Run

```sh
npm start
```

Open **http://localhost:5173**. No dependency installation or build is required. Node is used only for the optional static preview server. Use `PORT=5175 npm start` to choose another port.

For hosting, serve this folder and rewrite clean routes to `index.html`. Netlify (`_redirects`) and Vercel (`vercel.json`) configurations are included. Use an HTTP server rather than opening `index.html` directly, because browser modules and clean routes need a site origin.

## Explore

- Home, catalog, Women/Men collections, and tees/hoodies/cargos/sets categories.
- Six product detail pages with colour and size selection, measurement guides, image zoom, product accordions, and related pieces.
- Search, sorting, filters, saved pieces, and a collection bag with quantity controls.
- About, Drop Culture, FAQ, contact preview, and demo information pages.
- Browser back/forward and direct route refresh.

There are **no admin, authentication, database, or checkout features**. There are no external API requests. Products and categories are hardcoded in `js/data/products.js`; see [PRODUCTS.md](PRODUCTS.md) for the collection outline. Images and fonts are local.

Bag and saved pieces persist across navigation within the current visit, then reset on reload. Drop concepts and review previews belong to the current page. Contact and review forms only show local previews; they send nothing. No orders, payments, tracking, cookies, or browser storage are used.

## Edit

- `index.html` — document and stylesheet entry points.
- `js/app.js` — routes and app composition.
- `js/app/` and `js/components/` — page and component functions using native DOM helpers.
- `js/runtime/dom.js` — small native DOM view layer; no React or Next.js runtime.
- `js/runtime/motion.js` — DOM animation adapter using the same Motion animation engine as the original frontend.
- `css/` — ready-to-use plain CSS; no CSS compiler needed.
- `js/data/products.js` — product descriptions, prices, sizes, images, variants, and categories.
- `images/streetwear/` — generated streetwear concept imagery; generation prompts in `PROMPTS.md`.

## Verify

```sh
npm run check
```

Checks JavaScript syntax, local imports, required assets, catalog consistency, and removal of backend modules. Browser validation also covers routes, mobile navigation, search, filters, bag and saved-piece interactions, dialogs, forms, and FAQ panels.

The original Murho project is a read-only reference and was not modified. The existing repository license is retained. See [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for bundled library and font attribution.
