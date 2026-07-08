// Assign the source site's mega-menu images to the root collections so
// the theme's picture mega menu shows the exact same visuals.
// Usage: node scripts/seed-collection-images.mjs

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

const MENU_IMAGES = {
  'bayan-terlik':
    'https://static.ticimax.cloud/12157/uploads/menuimages/96bb6bdf-b53d-4a2d-851a-5306aaa7cda7.jpg',
  'bayan-sandalet':
    'https://static.ticimax.cloud/12157/uploads/menuimages/ff4d6330-23b7-4860-944c-78bce887857a.jpg',
  'bayan-spor-ayakkabi':
    'https://static.ticimax.cloud/12157/uploads/menuimages/f81a0056-f5ae-4f92-a224-f49a36fd5f4d.jpg',
  'erkek-ayakkabi-modelleri':
    'https://static.ticimax.cloud/12157/uploads/menuimages/e6f0d0fa-68d4-4288-a1b7-b9cd88cfe651.jpg',
  'cocuk-ayakkabi-modelleri':
    'https://static.ticimax.cloud/12157/uploads/menuimages/b9132099-825f-4458-b50b-2d47a2e0e973.jpg',
  'kadin-bot':
    'https://static.ticimax.cloud/12157/uploads/menuimages/ae52f5b6-7c8a-4fa6-ac9c-bcf18b36b2a9.jpg',
  'kadin-cizme':
    'https://static.ticimax.cloud/12157/uploads/menuimages/9e83bf6b-f08f-4638-b2e6-c8db9d9c4e9f.jpg',
};

for (const [handle, src] of Object.entries(MENU_IMAGES)) {
  const found = await gql(
    `query GetCollection($query: String!) {
      collections(first: 1, query: $query) { nodes { id handle } }
    }`,
    { query: `handle:${handle}` }
  );
  const collection = found.collections.nodes.find((n) => n.handle === handle);
  if (!collection) {
    console.log(`! Collection not found: ${handle}`);
    continue;
  }

  const data = await gql(
    `mutation UpdateCollection($input: CollectionInput!) {
      collectionUpdate(input: $input) {
        collection { id handle image { url } }
        userErrors { field message }
      }
    }`,
    { input: { id: collection.id, image: { src } } }
  );
  const errs = data.collectionUpdate.userErrors;
  if (errs.length) {
    console.log(`! ${handle}: ${JSON.stringify(errs)}`);
  } else {
    console.log(`✓ Image set: ${handle}`);
  }
}

console.log('\nDone.');
