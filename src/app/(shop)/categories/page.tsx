import Link from "next/link";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = { title: "Categories" };

const CATEGORIES = [
  { name: "Crochet Flowers", slug: "flowers", emoji: "🌸", desc: "Eternal handmade blooms that never wilt", grad: "from-pink-50 to-rose-100" },
  { name: "Crochet Bouquets", slug: "bouquets", emoji: "💐", desc: "Beautiful arrangements for every occasion", grad: "from-purple-50 to-violet-100" },
  { name: "Crochet Keychains", slug: "keychains", emoji: "🗝️", desc: "Adorable keychains to carry with you", grad: "from-amber-50 to-yellow-100" },
  { name: "Crochet Bags", slug: "bags", emoji: "👜", desc: "Stylish handcrafted bags for everyday use", grad: "from-green-50 to-emerald-100" },
  { name: "Crochet Plushies", slug: "plushies", emoji: "🧸", desc: "Huggable stuffed creations made with love", grad: "from-orange-50 to-amber-100" },
  { name: "Crochet Accessories", slug: "accessories", emoji: "✨", desc: "Headbands, scrunchies, and more", grad: "from-blue-50 to-sky-100" },
];

export default function CategoriesPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-blush-dark text-sm tracking-[4px] uppercase mb-3">Browse</p>
        <h1 className="font-cormorant text-5xl font-semibold text-brown">All Collections</h1>
        <p className="text-brown-light mt-4 max-w-md mx-auto">
          Explore our handcrafted categories — each piece woven with love and care.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {CATEGORIES.map((cat) => (
          <Link key={cat.slug} href={`/shop?category=${cat.slug}`}
            className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${cat.grad} p-8 hover:shadow-medium transition-all duration-300 hover:-translate-y-1`}>
            <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">{cat.emoji}</div>
            <h2 className="font-cormorant text-3xl font-semibold text-brown mb-2">{cat.name}</h2>
            <p className="text-sm text-brown-light mb-4">{cat.desc}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-blush-dark font-medium">Shop Now →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
