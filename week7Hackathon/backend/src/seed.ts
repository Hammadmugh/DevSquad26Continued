/**
 * Seed script — populates the database with dummy data via the live API.
 * Run with: npx ts-node -r tsconfig-paths/register src/seed.ts
 * Make sure the backend server is running on port 3000 first.
 */

const BASE = 'http://localhost:3000/api';

async function post(path: string, body: object) {
  const res = await fetch(`${BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`POST ${path} failed (${res.status}): ${text}`);
  }
  return res.json();
}

async function seed() {
  console.log('🌱 Seeding raw materials...');
  const [flour, sugar, milk, butter, coffee, tea, chocolate] = await Promise.all([
    post('/raw-materials', { name: 'Flour',       unit: 'kg',  quantity: 50,  minStockLevel: 10 }),
    post('/raw-materials', { name: 'Sugar',       unit: 'kg',  quantity: 30,  minStockLevel: 5  }),
    post('/raw-materials', { name: 'Milk',        unit: 'l',   quantity: 40,  minStockLevel: 8  }),
    post('/raw-materials', { name: 'Butter',      unit: 'kg',  quantity: 15,  minStockLevel: 3  }),
    post('/raw-materials', { name: 'Coffee Beans',unit: 'g',   quantity: 2000,minStockLevel: 300 }),
    post('/raw-materials', { name: 'Tea Leaves',  unit: 'g',   quantity: 1500,minStockLevel: 200 }),
    post('/raw-materials', { name: 'Chocolate',   unit: 'g',   quantity: 3000,minStockLevel: 500 }),
  ]);
  console.log('  ✓ 7 raw materials created');

  console.log('🌱 Seeding products...');
  const [croissant, muffin, latte, cappuccino, hotChoc, teaCup, cake] = await Promise.all([
    post('/products', {
      name: 'Croissant', price: 2.5, isActive: true,
      recipe: [
        { materialId: flour._id,  quantity: 0.1 },
        { materialId: butter._id, quantity: 0.05 },
      ],
    }),
    post('/products', {
      name: 'Chocolate Muffin', price: 3.0, isActive: true,
      recipe: [
        { materialId: flour._id,     quantity: 0.08 },
        { materialId: sugar._id,     quantity: 0.04 },
        { materialId: chocolate._id, quantity: 30 },
        { materialId: butter._id,    quantity: 0.02 },
      ],
    }),
    post('/products', {
      name: 'Latte', price: 4.0, isActive: true,
      recipe: [
        { materialId: coffee._id, quantity: 18 },
        { materialId: milk._id,   quantity: 0.25 },
      ],
    }),
    post('/products', {
      name: 'Cappuccino', price: 3.5, isActive: true,
      recipe: [
        { materialId: coffee._id, quantity: 18 },
        { materialId: milk._id,   quantity: 0.15 },
      ],
    }),
    post('/products', {
      name: 'Hot Chocolate', price: 3.8, isActive: true,
      recipe: [
        { materialId: chocolate._id, quantity: 40 },
        { materialId: milk._id,      quantity: 0.2 },
        { materialId: sugar._id,     quantity: 0.02 },
      ],
    }),
    post('/products', {
      name: 'Tea Cup', price: 2.0, isActive: true,
      recipe: [
        { materialId: tea._id, quantity: 5 },
      ],
    }),
    post('/products', {
      name: 'Chocolate Cake Slice', price: 5.5, isActive: true,
      recipe: [
        { materialId: flour._id,     quantity: 0.15 },
        { materialId: sugar._id,     quantity: 0.1  },
        { materialId: butter._id,    quantity: 0.05 },
        { materialId: chocolate._id, quantity: 60   },
        { materialId: milk._id,      quantity: 0.1  },
      ],
    }),
  ]);
  console.log('  ✓ 7 products created');

  console.log('🌱 Seeding orders...');
  const orders = [
    {
      items: [
        { productId: latte._id,      quantity: 2 },
        { productId: croissant._id,  quantity: 1 },
      ],
      note: 'Table 3',
    },
    {
      items: [
        { productId: cappuccino._id, quantity: 1 },
        { productId: muffin._id,     quantity: 2 },
      ],
      note: '',
    },
    {
      items: [
        { productId: hotChoc._id,    quantity: 3 },
        { productId: cake._id,       quantity: 2 },
      ],
      note: 'Birthday table',
    },
    {
      items: [
        { productId: teaCup._id,     quantity: 4 },
      ],
      note: 'Customer left',
    },
    {
      items: [
        { productId: latte._id,      quantity: 1 },
        { productId: cake._id,       quantity: 1 },
        { productId: teaCup._id,     quantity: 2 },
      ],
      note: 'Window seat',
    },
  ];

  for (const order of orders) {
    await post('/orders', order);
  }
  console.log('  ✓ 5 orders created');
  console.log('\n✅ Seed complete!');
}

seed().catch((err) => {
  console.error('❌ Seed failed:', err.message);
  process.exit(1);
});
