// Seed test products into the dev store via the Admin GraphQL API.
// Reads credentials from .env (SHOPIFY_STORE_DOMAIN, SHOPIFY_ADMIN_API_TOKEN,
// SHOPIFY_API_VERSION). Idempotent-ish: productSet matches on handle.
//
// Usage: node scripts/seed-products.mjs

import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const env = Object.fromEntries(
  readFileSync(resolve(root, '.env'), 'utf8')
    .split('\n')
    .filter((l) => l.includes('=') && !l.trim().startsWith('#'))
    .map((l) => l.split(/=(.*)/s).slice(0, 2).map((s) => s.trim()))
);

const ENDPOINT = `https://${env.SHOPIFY_STORE_DOMAIN}/admin/api/${env.SHOPIFY_API_VERSION}/graphql.json`;

async function gql(query, variables = {}) {
  const res = await fetch(ENDPOINT, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': env.SHOPIFY_ADMIN_API_TOKEN,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, variables }),
  });
  const json = await res.json();
  if (json.errors) throw new Error(JSON.stringify(json.errors, null, 2));
  return json.data;
}

const LOCATION_ID = 'gid://shopify/Location/86140256361';
const IMG = 'https://static.ticimax.cloud/12157/Uploads/UrunResimleri/buyuk';

const sizes = (from, to) => {
  const out = [];
  for (let s = from; s <= to; s++) out.push(String(s));
  return out;
};

const PRODUCTS = [
  {
    handle: 'kadin-arkasi-acik-tokali-topuklu-ayakkabi-kahve',
    title: 'Kadın Arkası Açık Tokalı Topuklu Ayakkabı KAHVE',
    productType: 'Topuklu Ayakkabı',
    tags: ['24-saat-kargo', 'topuklu'],
    image: 'https://static.ticimax.cloud/12157/uploads/urunresimleri/buyuk/kadin-arkasi-acik-tokali-topuklu-ayakk-b7f596.jpg',
    price: '929.99',
    compareAtPrice: '1229.99',
    skuBase: 'EL239-KAHVE',
    sizes: sizes(36, 40),
    soldOutSizes: [],
    description: 'Kadın Arkası Açık Tokalı Topuklu Ayakkabı; Dış Materyal: Pu Deri; İç Materyal: Pu Deri; Taban: Poli Taban; Topuk Ölçüsü: 7 Cm; Üretim Yeri: Türkiye',
  },
  {
    handle: 'zincirli-biyeli-okce-kaplama-topuklu-ayakkabi-siyah',
    title: 'Zincirli Biyeli Ökçe Kaplama Topuklu Ayakkabı SİYAH',
    productType: 'Topuklu Ayakkabı',
    tags: ['24-saat-kargo', 'topuklu'],
    image: `${IMG}/zincirli-biyeli-okce-kaplama-topuklu-a-cd917d.jpg`,
    price: '889.99',
    compareAtPrice: '1189.99',
    skuBase: 'D180-SIYAH',
    sizes: sizes(36, 40),
    soldOutSizes: [],
    description: 'Zincirli Biyeli Ökçe Kaplama Topuklu Ayakkabı; Dış Materyal: Pu Deri; Topuk Ölçüsü: 5 Cm; Üretim Yeri: Türkiye',
  },
  {
    handle: 'tokali-onu-kapali-pimli-kadin-terlik-siyah',
    title: 'Tokalı Önü Kapalı Pimli Kadın Terlik SİYAH',
    productType: 'Terlik',
    tags: ['24-saat-kargo', 'terlik'],
    image: `${IMG}/tokali-onu-kapali-pimli-kadin-terlik-s-79e-4f.jpg`,
    price: '399.99',
    compareAtPrice: '519.99',
    skuBase: 'G310-SIYAH',
    sizes: sizes(36, 41),
    soldOutSizes: ['39'],
    description: 'Tokalı Önü Kapalı Pimli Kadın Terlik; Dış Materyal: Pu Deri; Taban: Poli Taban; Üretim Yeri: Türkiye',
    colorGroup: ['tokali-onu-kapali-pimli-kadin-terlik-siyah', 'tokali-onu-kapali-pimli-kadin-terlik-ten', 'tokali-onu-kapali-pimli-kadin-terlik-kahve'],
  },
  {
    handle: 'tokali-onu-kapali-pimli-kadin-terlik-ten',
    title: 'Tokalı Önü Kapalı Pimli Kadın Terlik TEN',
    productType: 'Terlik',
    tags: ['24-saat-kargo', 'terlik'],
    image: `${IMG}/tokali-onu-kapali-pimli-kadin-terlik-t-689bc2.jpg`,
    price: '399.99',
    compareAtPrice: '519.99',
    skuBase: 'G310-TEN',
    sizes: sizes(36, 41),
    soldOutSizes: [],
    description: 'Tokalı Önü Kapalı Pimli Kadın Terlik; Dış Materyal: Pu Deri; Taban: Poli Taban; Üretim Yeri: Türkiye',
    colorGroup: ['tokali-onu-kapali-pimli-kadin-terlik-siyah', 'tokali-onu-kapali-pimli-kadin-terlik-ten', 'tokali-onu-kapali-pimli-kadin-terlik-kahve'],
  },
  {
    handle: 'tokali-onu-kapali-pimli-kadin-terlik-kahve',
    title: 'Tokalı Önü Kapalı Pimli Kadın Terlik KAHVE',
    productType: 'Terlik',
    tags: ['24-saat-kargo', 'terlik'],
    image: `${IMG}/tokali-onu-kapali-pimli-kadin-terlik-k-e5-4a8.jpg`,
    price: '399.99',
    compareAtPrice: '519.99',
    skuBase: 'G310-KAHVE',
    sizes: sizes(36, 41),
    soldOutSizes: [],
    description: 'Tokalı Önü Kapalı Pimli Kadın Terlik; Dış Materyal: Pu Deri; Taban: Poli Taban; Üretim Yeri: Türkiye',
    colorGroup: ['tokali-onu-kapali-pimli-kadin-terlik-siyah', 'tokali-onu-kapali-pimli-kadin-terlik-ten', 'tokali-onu-kapali-pimli-kadin-terlik-kahve'],
  },
  {
    handle: 'cift-tokali-kadin-terlik-bej',
    title: 'Çift Tokalı Kadın Terlik BEJ',
    productType: 'Terlik',
    tags: ['terlik'],
    image: `${IMG}/cift-tokali-kadin-terlik-bej-902-43.jpg`,
    price: '349.90',
    compareAtPrice: null,
    skuBase: 'C215-BEJ',
    sizes: sizes(36, 40),
    soldOutSizes: [],
    description: 'Çift Tokalı Kadın Terlik; Dış Materyal: Pu Deri; Taban: Poli Taban; Üretim Yeri: Türkiye',
  },
];

const COLLECTIONS = [
  { handle: 'bayan-terlik', title: 'Terlik', productTypes: ['Terlik'] },
  { handle: 'bayan-topuklu-ayakkabi', title: 'Topuklu', productTypes: ['Topuklu Ayakkabı'] },
];

// ---------------------------------------------------------------
// 1. Metafield definition: custom.color_group (list.product_reference)
// ---------------------------------------------------------------
async function ensureDefinition() {
  const data = await gql(
    `mutation CreateDef($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition { id }
        userErrors { code message }
      }
    }`,
    {
      definition: {
        name: 'Renk Grubu',
        namespace: 'custom',
        key: 'color_group',
        type: 'list.product_reference',
        ownerType: 'PRODUCT',
        pin: true,
      },
    }
  );
  const errs = data.metafieldDefinitionCreate.userErrors;
  if (errs.length && !errs.some((e) => e.code === 'TAKEN')) {
    throw new Error(`Definition failed: ${JSON.stringify(errs)}`);
  }
  console.log(errs.length ? '• Definition already exists' : '✓ Definition custom.color_group created');
}

// ---------------------------------------------------------------
// 2. Products via productSet
// ---------------------------------------------------------------
async function upsertProduct(p) {
  const existing = await gql(
    `query GetProduct($query: String!) {
      products(first: 1, query: $query) { nodes { id handle } }
    }`,
    { query: `handle:${p.handle}` }
  );
  const existingId = existing.products.nodes.find((n) => n.handle === p.handle)?.id;

  const input = {
    ...(existingId ? { id: existingId } : {}),
    handle: p.handle,
    title: p.title,
    descriptionHtml: `<p>${p.description}</p>`,
    vendor: 'Modatrend',
    productType: p.productType,
    status: 'ACTIVE',
    tags: p.tags,
    ...(existingId ? {} : { files: [{ originalSource: p.image, contentType: 'IMAGE' }] }),
    productOptions: [
      { name: 'Numara', position: 1, values: p.sizes.map((s) => ({ name: s })) },
    ],
    variants: p.sizes.map((size) => ({
      optionValues: [{ optionName: 'Numara', name: size }],
      price: p.price,
      compareAtPrice: p.compareAtPrice,
      inventoryItem: { sku: `${p.skuBase}-${size}`, tracked: true },
      inventoryQuantities: [
        {
          locationId: LOCATION_ID,
          name: 'available',
          quantity: p.soldOutSizes.includes(size) ? 0 : 8,
        },
      ],
    })),
  };

  const data = await gql(
    `mutation SetProduct($input: ProductSetInput!) {
      productSet(input: $input) {
        product { id handle status }
        userErrors { field message }
      }
    }`,
    { input }
  );
  const { product, userErrors } = data.productSet;
  if (userErrors.length) throw new Error(`${p.handle}: ${JSON.stringify(userErrors)}`);
  console.log(`✓ Product ${product.handle} → ${product.id}`);
  return product;
}

// ---------------------------------------------------------------
// 3. Collections (match by product type via collects after creation)
// ---------------------------------------------------------------
async function upsertCollection(c, productIdsByType) {
  const existing = await gql(
    `query GetCollection($query: String!) {
      collections(first: 1, query: $query) { nodes { id handle } }
    }`,
    { query: `handle:${c.handle}` }
  );

  let collectionId = existing.collections.nodes[0]?.id;

  if (!collectionId) {
    const data = await gql(
      `mutation CreateCollection($input: CollectionInput!) {
        collectionCreate(input: $input) {
          collection { id handle }
          userErrors { field message }
        }
      }`,
      { input: { title: c.title, handle: c.handle } }
    );
    const errs = data.collectionCreate.userErrors;
    if (errs.length) throw new Error(`${c.handle}: ${JSON.stringify(errs)}`);
    collectionId = data.collectionCreate.collection.id;
    console.log(`✓ Collection ${c.handle} → ${collectionId}`);
  } else {
    console.log(`• Collection ${c.handle} exists`);
  }

  const ids = c.productTypes.flatMap((t) => productIdsByType[t] || []);
  if (ids.length) {
    const data = await gql(
      `mutation AddProducts($id: ID!, $productIds: [ID!]!) {
        collectionAddProducts(id: $id, productIds: $productIds) {
          userErrors { field message }
        }
      }`,
      { id: collectionId, productIds: ids }
    );
    const errs = data.collectionAddProducts.userErrors;
    if (errs.length && !errs.some((e) => /already/i.test(e.message))) {
      console.log(`  ! ${c.handle}: ${JSON.stringify(errs)}`);
    } else {
      console.log(`  ✓ ${ids.length} products in ${c.handle}`);
    }
  }
}

// ---------------------------------------------------------------
// 4. color_group metafields
// ---------------------------------------------------------------
async function setColorGroups(idByHandle) {
  const metafields = PRODUCTS.filter((p) => p.colorGroup).map((p) => ({
    ownerId: idByHandle[p.handle],
    namespace: 'custom',
    key: 'color_group',
    type: 'list.product_reference',
    value: JSON.stringify(p.colorGroup.map((h) => idByHandle[h])),
  }));
  if (!metafields.length) return;

  const data = await gql(
    `mutation SetMetafields($metafields: [MetafieldsSetInput!]!) {
      metafieldsSet(metafields: $metafields) {
        metafields { id }
        userErrors { field message }
      }
    }`,
    { metafields }
  );
  const errs = data.metafieldsSet.userErrors;
  if (errs.length) throw new Error(`metafieldsSet: ${JSON.stringify(errs)}`);
  console.log(`✓ color_group set on ${metafields.length} products`);
}

// ---------------------------------------------------------------
// 5. Publish to Online Store (needs read/write_publications; optional)
// ---------------------------------------------------------------
async function tryPublish(ids) {
  try {
    const pubs = await gql(`{ publications(first: 5) { nodes { id name } } }`);
    const online = pubs.publications.nodes.find((p) => /online store/i.test(p.name));
    if (!online) {
      console.log('! Online Store publication not found');
      return;
    }
    for (const id of ids) {
      const data = await gql(
        `mutation Publish($id: ID!, $input: [PublicationInput!]!) {
          publishablePublish(id: $id, input: $input) {
            userErrors { field message }
          }
        }`,
        { id, input: [{ publicationId: online.id }] }
      );
      const errs = data.publishablePublish.userErrors;
      if (errs.length) console.log(`  ! publish ${id}: ${JSON.stringify(errs)}`);
    }
    console.log(`✓ Published ${ids.length} resources to Online Store`);
  } catch (e) {
    console.log('! Publications scope missing — add read_publications & write_publications to the app, then rerun.');
    console.log(`  (${String(e).slice(0, 140)}…)`);
  }
}

// ---------------------------------------------------------------
const idByHandle = {};
const productIdsByType = {};

await ensureDefinition();

for (const p of PRODUCTS) {
  const product = await upsertProduct(p);
  idByHandle[p.handle] = product.id;
  (productIdsByType[p.productType] ||= []).push(product.id);
}

for (const c of COLLECTIONS) {
  await upsertCollection(c, productIdsByType);
}

await setColorGroups(idByHandle);

const collections = await gql(
  `{ collections(first: 10, query: "handle:bayan-terlik OR handle:bayan-topuklu-ayakkabi") { nodes { id } } }`
);
await tryPublish([...Object.values(idByHandle), ...collections.collections.nodes.map((c) => c.id)]);

console.log('\nDone.');
