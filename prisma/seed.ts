import pkg from "@prisma/client";
const { PrismaClient } = pkg;
import { PrismaNeon } from "@prisma/adapter-neon";
import bcrypt from "bcryptjs";
import { config } from "dotenv";

// Load .env.local for local seeding
config({ path: ".env.local" });

function createClient() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) throw new Error("DATABASE_URL not set in .env.local");
  const adapter = new PrismaNeon({ connectionString });
  return new PrismaClient({ adapter });
}

const prisma = createClient();

async function main() {
  console.log("🌱 Seeding NavkalaCrochet database...\n");

  // Admin user
  const adminPwd = await bcrypt.hash("Admin@123", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@navkalacrochet.com" },
    update: {},
    create: { clerkId: "seed_admin", name: "Navkala Admin", email: "admin@navkalacrochet.com", role: "ADMIN" },
  });
  console.log("✅ Admin:", admin.email);

  const demoUser = await prisma.user.upsert({
    where: { email: "demo@navkalacrochet.com" },
    update: {},
    create: { clerkId: "seed_demo", name: "Priya Sharma", email: "demo@navkalacrochet.com", role: "USER" },
  });
  console.log("✅ Demo user:", demoUser.email);

  // Categories
  const cats = [
    { name: "Crochet Flowers",     slug: "flowers",     description: "Eternal handmade blooms" },
    { name: "Crochet Bouquets",    slug: "bouquets",    description: "Beautiful arrangements" },
    { name: "Crochet Keychains",   slug: "keychains",   description: "Adorable carry-alongs" },
    { name: "Crochet Bags",        slug: "bags",        description: "Stylish handcrafted bags" },
    { name: "Crochet Plushies",    slug: "plushies",    description: "Huggable stuffed creations" },
    { name: "Crochet Accessories", slug: "accessories", description: "Headbands, scrunchies & more" },
  ];
  const catMap: Record<string, string> = {};
  for (const cat of cats) {
    const c = await prisma.category.upsert({ where: { slug: cat.slug }, update: {}, create: cat });
    catMap[cat.slug] = c.id;
    console.log("  📁", cat.name);
  }
  console.log("✅ Categories seeded\n");

  // Products
  const products = [
    { name: "Rose Crochet Flower", slug: "rose-crochet-flower", description: "A timeless handmade crochet rose. Each petal individually shaped, eternal bloom that never wilts.", price: 149, comparePrice: 199, cat: "flowers", stock: 50, sku: "FL-ROSE-001", featured: true, bestSeller: true, newArrival: false, trending: true, tags: ["rose","flower","gift"], images: ["https://images.unsplash.com/photo-1487530811015-780a0b0c25e4?w=600&q=80"], variants: [{color:"blush",stock:15},{color:"red",stock:15},{color:"white",stock:10},{color:"purple",stock:10}] },
    { name: "Sunflower Crochet Bloom", slug: "sunflower-crochet-bloom", description: "Bright cheerful sunflower in vibrant yellow yarn. Brings sunshine to any space.", price: 179, comparePrice: 229, cat: "flowers", stock: 35, sku: "FL-SUN-002", featured: true, bestSeller: false, newArrival: true, trending: false, tags: ["sunflower","yellow"], images: ["https://images.unsplash.com/photo-1562690868-60bbe7293e94?w=600&q=80"], variants: [{color:"yellow",stock:20},{color:"orange",stock:15}] },
    { name: "Lavender Crochet Sprig", slug: "lavender-crochet-sprig", description: "Delicate lavender sprigs in soft purple yarn. Set of 3.", price: 199, comparePrice: 249, cat: "flowers", stock: 40, sku: "FL-LAV-003", featured: false, bestSeller: true, newArrival: false, trending: true, tags: ["lavender","purple","set"], images: ["https://images.unsplash.com/photo-1528722828814-77b9b83aafb2?w=600&q=80"], variants: [{color:"lavender",stock:25},{color:"purple",stock:15}] },
    { name: "Rainbow Crochet Bouquet", slug: "rainbow-crochet-bouquet", description: "Hand-tied bouquet of mixed crochet flowers in rainbow colours. Wrapped in kraft paper with ribbon.", price: 549, comparePrice: 699, cat: "bouquets", stock: 20, sku: "BQ-RAIN-001", featured: true, bestSeller: true, newArrival: false, trending: true, tags: ["bouquet","rainbow","gift"], images: ["https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=600&q=80"], variants: [] },
    { name: "Pastel Dream Bouquet", slug: "pastel-dream-bouquet", description: "Soft romantic bouquet — blush pink, lilac, cream. Tied with satin ribbon.", price: 649, comparePrice: 799, cat: "bouquets", stock: 15, sku: "BQ-PAST-002", featured: true, bestSeller: false, newArrival: true, trending: false, tags: ["pastel","bouquet","wedding"], images: ["https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&q=80"], variants: [] },
    { name: "Bear Crochet Keychain", slug: "bear-crochet-keychain", description: "Adorable handmade bear keychain with embroidered eyes. Perfect companion or gift.", price: 129, comparePrice: 169, cat: "keychains", stock: 80, sku: "KC-BEAR-001", featured: false, bestSeller: true, newArrival: false, trending: true, tags: ["keychain","bear","cute"], images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80"], variants: [{color:"brown",stock:30},{color:"cream",stock:25},{color:"blush",stock:25}] },
    { name: "Mini Flower Keychain", slug: "mini-flower-keychain", description: "Tiny crochet flower keychain in multiple colours. Wonderful party favour.", price: 99, comparePrice: 129, cat: "keychains", stock: 100, sku: "KC-FLOW-002", featured: false, bestSeller: false, newArrival: true, trending: false, tags: ["keychain","flower","mini"], images: ["https://images.unsplash.com/photo-1573408301185-9519f94815b5?w=600&q=80"], variants: [{color:"blush",stock:25},{color:"yellow",stock:25},{color:"purple",stock:25},{color:"white",stock:25}] },
    { name: "Boho Crochet Tote Bag", slug: "boho-crochet-tote-bag", description: "Spacious tote in open-weave cotton. Fully lined, carries up to 5kg.", price: 849, comparePrice: 1099, cat: "bags", stock: 12, sku: "BG-TOTE-001", featured: true, bestSeller: true, newArrival: false, trending: true, tags: ["bag","tote","boho"], images: ["https://images.unsplash.com/photo-1594938298603-c8148c4b96f6?w=600&q=80"], variants: [{color:"cream",stock:5},{color:"brown",stock:4},{color:"blush",stock:3}] },
    { name: "Mini Crochet Pouch", slug: "mini-crochet-pouch", description: "Cute mini pouch for coins or essentials. Zipper closure with tassel charm.", price: 299, comparePrice: 389, cat: "bags", stock: 30, sku: "BG-POUCH-002", featured: false, bestSeller: false, newArrival: true, trending: false, tags: ["pouch","zipper"], images: ["https://images.unsplash.com/photo-1566150905458-1bf1fb99f7d9?w=600&q=80"], variants: [{color:"blush",stock:10},{color:"lavender",stock:10},{color:"cream",stock:10}] },
    { name: "Crochet Teddy Bear Plushie", slug: "crochet-teddy-bear-plushie", description: "The softest handmade teddy bear. Premium fill, embroidered face. Safe for ages 3+.", price: 649, comparePrice: 799, cat: "plushies", stock: 18, sku: "PL-BEAR-001", featured: true, bestSeller: true, newArrival: false, trending: true, tags: ["plushie","bear","gift"], images: ["https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=600&q=80"], variants: [{color:"brown",stock:6},{color:"cream",stock:6},{color:"blush",stock:6}] },
    { name: "Strawberry Amigurumi", slug: "strawberry-amigurumi", description: "Impossibly cute crochet strawberry with leaf crown. Perfect desk companion.", price: 249, comparePrice: 319, cat: "plushies", stock: 45, sku: "PL-STRAW-002", featured: false, bestSeller: false, newArrival: true, trending: true, tags: ["amigurumi","strawberry","cute"], images: ["https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=600&q=80"], variants: [{color:"red",stock:25},{color:"blush",stock:20}] },
    { name: "Bunny Crochet Plushie", slug: "bunny-crochet-plushie", description: "Adorable floppy-eared bunny in soft pastel yarn. Perfect Easter or baby gift.", price: 549, comparePrice: 699, cat: "plushies", stock: 22, sku: "PL-BUNN-003", featured: true, bestSeller: false, newArrival: false, trending: false, tags: ["plushie","bunny","easter"], images: ["https://images.unsplash.com/photo-1558459654-c430be5b0a08?w=600&q=80"], variants: [{color:"white",stock:8},{color:"blush",stock:7},{color:"lavender",stock:7}] },
    { name: "Crochet Hair Scrunchie Set", slug: "crochet-hair-scrunchie-set", description: "Set of 3 handmade scrunchies in pastel tones. Gentle on hair.", price: 199, comparePrice: 259, cat: "accessories", stock: 60, sku: "AC-SCRN-001", featured: false, bestSeller: true, newArrival: false, trending: true, tags: ["scrunchie","hair","set"], images: ["https://images.unsplash.com/photo-1607081692251-13c3c3a28b34?w=600&q=80"], variants: [{color:"blush",stock:20},{color:"lavender",stock:20},{color:"cream",stock:20}] },
    { name: "Crochet Headband", slug: "crochet-headband", description: "Wide stretchy headband. Great for workouts and everyday wear.", price: 149, comparePrice: 199, cat: "accessories", stock: 50, sku: "AC-HEAD-002", featured: false, bestSeller: false, newArrival: true, trending: false, tags: ["headband","hair"], images: ["https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?w=600&q=80"], variants: [{color:"blush",stock:15},{color:"cream",stock:15},{color:"brown",stock:10},{color:"lavender",stock:10}] },
  ];

  for (const p of products) {
    const { cat, variants, ...data } = p;
    const categoryId = catMap[cat];
    if (!categoryId) { console.warn("  ⚠ No cat for", cat); continue; }
    await prisma.product.upsert({
      where: { slug: data.slug },
      update: {},
      create: { ...data, categoryId, variants: variants.length ? { create: variants } : undefined },
    });
    console.log("  🛍", data.name);
  }
  console.log("✅ Products seeded\n");

  // Coupons
  const coupons = [
    { code: "WELCOME10", type: "PERCENTAGE" as const, value: 10,  minOrder: 200, maxDiscount: 100, isActive: true },
    { code: "FLAT50",    type: "FIXED"      as const, value: 50,  minOrder: 300,                   isActive: true },
    { code: "NAVKALA20", type: "PERCENTAGE" as const, value: 20,  minOrder: 500, maxDiscount: 200, usageLimit: 100, isActive: true },
    { code: "FREESHIP",  type: "FIXED"      as const, value: 60,  minOrder: 200,                   isActive: true },
  ];
  for (const c of coupons) {
    await prisma.coupon.upsert({ where: { code: c.code }, update: {}, create: c });
  }
  console.log("✅ Coupons:", coupons.map(c => c.code).join(", "));

  // Sample reviews
  const allProducts = await prisma.product.findMany({ take: 5 });
  const reviews = [
    { rating: 5, title: "Absolutely gorgeous!", body: "I ordered the Rose Crochet Flower for my mom and she cried happy tears. The quality is outstanding, so detailed and lifelike!" },
    { rating: 5, title: "Perfect gift",         body: "Bought the bear plushie for my niece. Extremely well-made, super soft. Will definitely order again." },
    { rating: 4, title: "Lovely, just as described", body: "The bouquet looks even better in person. Colours are vibrant, arrived beautifully packed." },
    { rating: 5, title: "Obsessed with my tote!", body: "This bag gets compliments everywhere. The craftsmanship is incredible for the price." },
    { rating: 5, title: "Cutest keychain ever", body: "Ordered 3 for my friends, they all loved them. So detailed for such a small item." },
  ];
  for (let i = 0; i < Math.min(reviews.length, allProducts.length); i++) {
    const exists = await prisma.review.findFirst({ where: { productId: allProducts[i].id, userId: demoUser.id } });
    if (!exists) {
      await prisma.review.create({ data: { ...reviews[i], productId: allProducts[i].id, userId: demoUser.id, verified: true, approved: true } });
    }
  }
  console.log("✅ Reviews seeded");

  for (const email of ["hello@example.com","crafty@example.com"]) {
    await prisma.newsletterSubscriber.upsert({ where: { email }, update: {}, create: { email } });
  }
  console.log("✅ Newsletter subscribers");

  console.log(`
🎉 Seed complete!
──────────────────────────────────────────────────
NOTE: The seed creates placeholder clerkId values.
      Real users are synced via the Clerk webhook.
──────────────────────────────────────────────────
Coupons: WELCOME10 · FLAT50 · NAVKALA20 · FREESHIP
  `);
}

main()
  .catch(e => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
