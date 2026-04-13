/**
 * Seed script — directly inserts admin user + 9 products into MongoDB.
 *
 * Usage (from the week6DayHackathon folder):
 *   node seed-products.mjs
 *
 * Requires: cd backend && npm install   (mongoose & bcryptjs must be present)
 */

import mongoose from "./backend/node_modules/mongoose/index.js";
import bcrypt   from "./backend/node_modules/bcryptjs/index.js";

/* ── Config ── */
const MONGO_URI   = "mongodb+srv://hammadafzal549:mongo123@cluster0.njhw2k4.mongodb.net/week6?appName=Cluster0";
const ADMIN_NAME  = "Admin";
const ADMIN_EMAIL = "admin@shopco.com";
const ADMIN_PASS  = "admin123";

/* ── Schemas (mirror the NestJS schemas) ── */
const UserSchema = new mongoose.Schema(
  {
    name:          { type: String, required: true },
    email:         { type: String, required: true, unique: true, lowercase: true },
    password:      { type: String, required: true },
    role:          { type: String, enum: ["user","admin","superadmin"], default: "user" },
    loyaltyPoints: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const ProductSchema = new mongoose.Schema(
  {
    name:         { type: String, required: true },
    description:  { type: String, required: true },
    images:       { type: [String], default: [] },
    category:     { type: String },
    price:        { type: Number, required: true, default: 0 },
    pointsPrice:  { type: Number, default: 0 },
    paymentType:  { type: String, default: "money" },
    stock:        { type: Number, default: 0 },
    rating:       { type: Number, default: 0 },
    reviewCount:  { type: Number, default: 0 },
    onSale:       { type: Boolean, default: false },
    salePrice:    { type: Number, default: null },
    saleEndsAt:   { type: Date,   default: null },
  },
  { timestamps: true }
);

/* ── Seed data ── */
const products = [
  {
    name: "T-shirt with Tape Details",
    price: 120, stock: 50, rating: 4.5, reviewCount: 120,
    description: "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    images: ["/new-arrival-1.png", "/new-arrival-2.png", "/new-arrival-3.png"],
    category: "T-shirts",
  },
  {
    name: "Skinny Fit Jeans",
    price: 240, stock: 35, rating: 3.5, reviewCount: 80,
    description: "Slim-cut jeans crafted from a comfortable stretch fabric. Perfect for a modern, tailored look.",
    images: ["/new-arrival-2.png", "/new-arrival-3.png", "/new-arrival-4.png"],
    category: "Jeans",
  },
  {
    name: "Checkered Shirt",
    price: 180, stock: 42, rating: 4.5, reviewCount: 200,
    description: "A classic checkered shirt made from soft woven fabric. Versatile enough for casual and smart casual occasions.",
    images: ["/new-arrival-3.png", "/new-arrival-4.png", "/new-arrival-1.png"],
    category: "Shirts",
  },
  {
    name: "Sleeve Striped T-shirt",
    price: 130, stock: 60, rating: 4.5, reviewCount: 150,
    description: "A bold striped t-shirt with contrast sleeve detailing. Made from premium cotton for all-day comfort.",
    images: ["/new-arrival-4.png", "/new-arrival-1.png", "/new-arrival-2.png"],
    category: "T-shirts",
  },
  {
    name: "One Life Graphic T-shirt",
    price: 260, stock: 28, rating: 4.5, reviewCount: 451,
    description: "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    images: ["/new-arrival-1.png", "/new-arrival-2.png", "/new-arrival-4.png"],
    category: "T-shirts",
  },
  {
    name: "Polo with Contrast Trims",
    price: 212, stock: 33, rating: 4.0, reviewCount: 100,
    description: "A stylish polo shirt with contrast trim detailing around the collar and sleeves.",
    images: ["/new-arrival-2.png", "/new-arrival-3.png", "/new-arrival-1.png"],
    category: "Polo",
  },
  {
    name: "Gradient Graphic T-shirt",
    price: 145, stock: 55, rating: 3.5, reviewCount: 90,
    description: "A vibrant gradient graphic t-shirt that stands out from the crowd.",
    images: ["/new-arrival-3.png", "/new-arrival-1.png", "/new-arrival-2.png"],
    category: "T-shirts",
  },
  {
    name: "Polo with Tipping Details",
    price: 180, stock: 40, rating: 4.5, reviewCount: 130,
    description: "Classic polo with elegant tipping details on collar and cuffs.",
    images: ["/new-arrival-4.png", "/new-arrival-2.png", "/new-arrival-3.png"],
    category: "Polo",
  },
  {
    name: "Black Striped T-shirt",
    price: 120, stock: 70, rating: 5.0, reviewCount: 160,
    description: "A sleek black and white striped t-shirt perfect for any casual occasion.",
    images: ["/new-arrival-1.png", "/new-arrival-4.png", "/new-arrival-3.png"],
    category: "T-shirts",
  },
];

/* ── Main ── */
(async () => {
  console.log("\n🌱 Connecting to MongoDB…");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected\n");

  const UserModel    = mongoose.model("User",    UserSchema);
  const ProductModel = mongoose.model("Product", ProductSchema);

  /* ── Admin user ── */
  const existing = await UserModel.findOne({ email: ADMIN_EMAIL });
  if (existing) {
    console.log(`ℹ️  Admin user already exists (${ADMIN_EMAIL}) — skipping\n`);
  } else {
    const hashed = await bcrypt.hash(ADMIN_PASS, 12);
    await UserModel.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: hashed, role: "admin" });
    console.log(`✅ Admin user created: ${ADMIN_EMAIL} / ${ADMIN_PASS}\n`);
  }

  /* ── Products ── */
  const existingCount = await ProductModel.countDocuments();
  if (existingCount > 0) {
    console.log(`ℹ️  ${existingCount} products already in DB — skipping product seed\n`);
    console.log("   (Drop the products collection manually if you want to re-seed)\n");
  } else {
    console.log(`📦 Inserting ${products.length} products…\n`);
    let created = 0;
    for (const p of products) {
      await ProductModel.create(p);
      console.log(`  ✅ ${p.name} — ₹${p.price} [${p.category}]`);
      created++;
    }
    console.log(`\n🏁 ${created} products seeded successfully\n`);
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected\n");
})();
