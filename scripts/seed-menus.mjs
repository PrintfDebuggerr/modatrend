// Seed the store navigation to mirror modatrend.com.tr:
// - ensures a collection for every category/subcategory (published)
// - rebuilds main-menu with the same nested tree
// - creates the utility menu and the three footer column menus
//
// Requires read/write_online_store_navigation (plus the existing
// products/publications scopes). Usage: node scripts/seed-menus.mjs

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

// ---------------------------------------------------------------
// Source menu tree (handle, title, children)
// ---------------------------------------------------------------
const TREE = [
  { handle: 'yeni-urunler', title: 'Yeni Ürünler' },
  {
    handle: 'bayan-terlik',
    title: 'Terlik',
    children: [
      { handle: 'duz-terlik', title: 'Düz Terlik' },
      { handle: 'topuklu-terlik', title: 'Topuklu Terlik' },
      { handle: 'kadin-ev-terligi-modelleri', title: 'Ev Terliği' },
      { handle: 'kadin-sabo-terlik-modelleri', title: 'Sabo Terlik' },
      { handle: 'feta-dolgu-terlik', title: 'Feta & Dolgu Terlik' },
    ],
  },
  {
    handle: 'bayan-sandalet',
    title: 'Sandalet',
    children: [
      { handle: 'duz-sandalet', title: 'Düz Sandalet' },
      { handle: 'kadin-hasir-sandalet-modelleri', title: 'Hasır Sandalet' },
      { handle: 'feta-dolgu-sandalet', title: 'Feta & Dolgu Sandalet' },
      { handle: 'topuklu-sandalet', title: 'Topuklu Sandalet' },
    ],
  },
  {
    handle: 'bayan-spor-ayakkabi',
    title: 'Spor & Sneaker',
    children: [
      { handle: 'kadin-sneakers-modelleri', title: 'Kadın Sneakers' },
      { handle: 'kadin-beyaz-spor-ayakkabi-modelleri', title: 'Beyaz Spor Ayakkabı' },
      { handle: 'kadin-siyah-spor-ayakkabi-modelleri', title: 'Siyah Spor Ayakkabı' },
      { handle: 'kadin-spor-yuruyus-ayakkabi-modelleri', title: 'Spor Yürüyüş Ayakkabı' },
    ],
  },
  { handle: 'bayan-gunluk-ayakkabi', title: 'Günlük' },
  { handle: 'bayan-babet', title: 'Babet' },
  { handle: 'bayan-topuklu-ayakkabi', title: 'Topuklu' },
  {
    handle: 'erkek-ayakkabi-modelleri',
    title: 'Erkek Ayakkabı',
    children: [
      { handle: 'erkek-terlik-sandalet-modelleri', title: 'Erkek Terlik & Sandalet' },
      { handle: 'erkek-spor-ayakkabi-modelleri', title: 'Erkek Spor' },
      { handle: 'erkek-yuruyus-ayakkabisi-modelleri', title: 'Erkek Yürüyüş Ayakkabısı' },
      { handle: 'erkek-klasik-ayakkabi', title: 'Erkek Klasik Ayakkabı' },
      { handle: 'erkek-bot-modelleri', title: 'Erkek Bot' },
    ],
  },
  {
    handle: 'cocuk-ayakkabi-modelleri',
    title: 'Çocuk Ayakkabı',
    children: [
      { handle: 'cocuk-terlik-sandalet-modelleri', title: 'Çocuk Terlik & Sandalet' },
      { handle: 'cocuk-spor-ayakkabi-modelleri', title: 'Çocuk Spor' },
      { handle: 'cocuk-babet', title: 'Çocuk Babet' },
      { handle: 'cocuk-topuklu-ayakkabi', title: 'Çocuk Topuklu Ayakkabı' },
      { handle: 'cocuk-bot-cizme-modelleri', title: 'Çocuk Bot & Çizme' },
    ],
  },
  {
    handle: 'kadin-bot',
    title: 'Bot',
    children: [
      { handle: 'kadin-topuklu-dolgu-bot', title: 'Dolgu Topuklu Bot' },
      { handle: 'kadin-duz-bot', title: 'Düz Bot' },
      { handle: 'kadin-yagmur-bot-modelleri', title: 'Yağmur Botu' },
      { handle: 'kadin-postal-bot-modelleri', title: 'Postal Bot' },
      { handle: 'kadin-kar-botu-modelleri', title: 'Kar Botu' },
      { handle: 'kadin-spor-bot-modelleri', title: 'Spor Bot' },
      { handle: 'kadin-topuklu-bot-modelleri', title: 'Topuklu Bot' },
    ],
  },
  {
    handle: 'kadin-cizme',
    title: 'Çizme',
    children: [
      { handle: 'kadin-yagmur-cizmesi-modelleri', title: 'Yağmur Çizmesi' },
      { handle: 'kadin-kovboy-cizme-modelleri', title: 'Kovboy Çizme' },
      { handle: 'kadin-diz-ustu-cizme-modelleri', title: 'Diz Üstü Çizme' },
      { handle: 'kadin-diz-alti-cizme-modelleri', title: 'Diz Altı Çizme' },
      { handle: 'duz-cizme', title: 'Düz Çizme' },
      { handle: 'kadin-topuklu-dolgu-cizme', title: 'Topuklu & Dolgu Çizme' },
    ],
  },
];

const EXTRA_MENUS = [
  {
    handle: 'utility',
    title: 'Utility',
    items: [
      { title: 'Yardım', type: 'HTTP', url: '/pages/sikca-sorulan-sorular' },
      { title: 'Blog', type: 'HTTP', url: 'http://blog.modatrend.com.tr' },
      { title: 'Kargom Nerede?', type: 'HTTP', url: '/pages/kargom-nerede' },
    ],
  },
  {
    handle: 'footer-alisveris',
    title: 'Alışveriş Bilgileri',
    items: [
      { title: 'Hesabım', type: 'HTTP', url: '/account' },
      { title: 'Siparişlerim', type: 'HTTP', url: '/account' },
      { title: 'İade Taleplerim', type: 'HTTP', url: '/pages/iade-iptal' },
      { title: 'Kargom Nerede?', type: 'HTTP', url: '/pages/kargom-nerede' },
    ],
  },
  {
    handle: 'footer-musteri-hizmetleri',
    title: 'Müşteri Hizmetleri',
    items: [
      { title: 'Kullanıcı Sözleşmesi', type: 'HTTP', url: '/pages/kullanici-sozlesmesi' },
      { title: 'İade - İptal', type: 'HTTP', url: '/pages/iade-iptal' },
      { title: 'Kargo & Teslimat', type: 'HTTP', url: '/pages/kargo-teslimat' },
      { title: 'Sıkça Sorulan Sorular', type: 'HTTP', url: '/pages/sikca-sorulan-sorular' },
    ],
  },
  {
    handle: 'footer-kurumsal',
    title: 'Kurumsal',
    items: [
      { title: 'Hakkımızda', type: 'HTTP', url: '/pages/hakkimizda' },
      { title: 'Mağazalarımız', type: 'HTTP', url: '/pages/magazalarimiz' },
      { title: 'İletişim', type: 'HTTP', url: '/pages/iletisim' },
      { title: 'Blog', type: 'HTTP', url: 'http://blog.modatrend.com.tr' },
      { title: 'Gizlilik Politikası & KVKK', type: 'HTTP', url: '/pages/gizlilik-politikasi-kvkk' },
    ],
  },
];

// ---------------------------------------------------------------
// Collections
// ---------------------------------------------------------------
const collectionIds = {};

async function ensureCollection(handle, title) {
  const existing = await gql(
    `query GetCollection($query: String!) {
      collections(first: 1, query: $query) { nodes { id handle } }
    }`,
    { query: `handle:${handle}` }
  );
  const found = existing.collections.nodes.find((n) => n.handle === handle);
  if (found) {
    collectionIds[handle] = found.id;
    return { id: found.id, created: false };
  }

  const data = await gql(
    `mutation CreateCollection($input: CollectionInput!) {
      collectionCreate(input: $input) {
        collection { id handle }
        userErrors { field message }
      }
    }`,
    { input: { title, handle } }
  );
  const errs = data.collectionCreate.userErrors;
  if (errs.length) throw new Error(`${handle}: ${JSON.stringify(errs)}`);
  collectionIds[handle] = data.collectionCreate.collection.id;
  return { id: collectionIds[handle], created: true };
}

async function publishAll(ids) {
  const pubs = await gql(`{ publications(first: 5) { nodes { id name } } }`);
  const online = pubs.publications.nodes.find((p) => /online store/i.test(p.name));
  if (!online) return;
  for (const id of ids) {
    await gql(
      `mutation Publish($id: ID!, $input: [PublicationInput!]!) {
        publishablePublish(id: $id, input: $input) { userErrors { field message } }
      }`,
      { id, input: [{ publicationId: online.id }] }
    );
  }
  console.log(`✓ Published ${ids.length} collections`);
}

// ---------------------------------------------------------------
// Menus
// ---------------------------------------------------------------
function collectionItem(node) {
  return {
    title: node.title,
    type: 'COLLECTION',
    resourceId: collectionIds[node.handle],
    items: (node.children || []).map((child) => collectionItem(child)),
  };
}

async function upsertMenu(handle, title, items) {
  const existing = await gql(
    `{ menus(first: 25) { nodes { id handle } } }`
  );
  const found = existing.menus.nodes.find((m) => m.handle === handle);

  if (found) {
    const data = await gql(
      `mutation UpdateMenu($id: ID!, $title: String!, $items: [MenuItemUpdateInput!]!) {
        menuUpdate(id: $id, title: $title, items: $items) {
          menu { id handle }
          userErrors { field message }
        }
      }`,
      { id: found.id, title, items }
    );
    const errs = data.menuUpdate.userErrors;
    if (errs.length) throw new Error(`${handle}: ${JSON.stringify(errs)}`);
    console.log(`✓ Menu updated: ${handle}`);
  } else {
    const data = await gql(
      `mutation CreateMenu($title: String!, $handle: String!, $items: [MenuItemCreateInput!]!) {
        menuCreate(title: $title, handle: $handle, items: $items) {
          menu { id handle }
          userErrors { field message }
        }
      }`,
      { title, handle, items }
    );
    const errs = data.menuCreate.userErrors;
    if (errs.length) throw new Error(`${handle}: ${JSON.stringify(errs)}`);
    console.log(`✓ Menu created: ${handle}`);
  }
}

// ---------------------------------------------------------------
let createdCount = 0;
const createdIds = [];

for (const node of TREE) {
  const res = await ensureCollection(node.handle, node.title);
  if (res.created) {
    createdCount += 1;
    createdIds.push(res.id);
  }
  for (const child of node.children || []) {
    const cres = await ensureCollection(child.handle, child.title);
    if (cres.created) {
      createdCount += 1;
      createdIds.push(cres.id);
    }
  }
}
console.log(`✓ Collections ready (${createdCount} newly created)`);

if (createdIds.length) await publishAll(createdIds);

await upsertMenu('main-menu', 'Main menu', TREE.map((node) => collectionItem(node)));

for (const menu of EXTRA_MENUS) {
  await upsertMenu(menu.handle, menu.title, menu.items);
}

console.log('\nDone.');
