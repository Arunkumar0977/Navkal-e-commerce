import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import { Heart, Star, Sparkles, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "The story behind NavkalaCrochet — handmade with love from India.",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        {/* Hero */}
        <section className="bg-gradient-to-br from-blush-light/40 to-lavender-light/30 py-24 text-center px-4">
          <p className="text-blush-dark text-sm tracking-[4px] uppercase mb-4">Our Story</p>
          <h1 className="font-cormorant text-6xl font-semibold text-brown mb-6">
            Made with Love,<br />Stitched with Soul
          </h1>
          <p className="text-brown-light text-lg max-w-2xl mx-auto leading-relaxed">
            NavkalaCrochet was born from a simple belief: that handmade things carry a warmth that 
            no machine can replicate. Every loop, every knot, every stitch tells a story.
          </p>
        </section>

        {/* Story */}
        <section className="py-20 bg-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="h-96 rounded-3xl bg-gradient-to-br from-blush-light to-lavender-light flex items-center justify-center text-9xl">
                🧶
              </div>
            </div>
            <div>
              <h2 className="font-cormorant text-4xl font-semibold text-brown mb-6">How It All Began</h2>
              <div className="space-y-4 text-brown-light leading-relaxed">
                <p>
                  It started with a ball of yarn and a quiet afternoon. What began as a personal hobby 
                  quickly grew into something much more — a passion for creating beauty from thread.
                </p>
                <p>
                  Each piece in our collection is individually handcrafted. We believe in slow fashion, 
                  in taking the time to get every detail right. Our crochet flowers never wilt, our 
                  plushies are made to be cherished, and our bags are designed to last a lifetime.
                </p>
                <p>
                  Today, NavkalaCrochet ships joy across India, one handmade creation at a time. 
                  Thank you for being part of our story.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 bg-cream">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="text-center mb-14">
              <h2 className="font-cormorant text-4xl font-semibold text-brown">What We Stand For</h2>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Heart, title: "Handmade Always", desc: "Every product is crafted by hand, never mass-produced." },
                { icon: Sparkles, title: "Premium Quality", desc: "Only the finest yarns and materials make the cut." },
                { icon: Star, title: "Customer Delight", desc: "Your happiness is the measure of our success." },
                { icon: Users, title: "Community First", desc: "We support artisans and celebrate craftsmanship." },
              ].map((v) => (
                <div key={v.title} className="bg-white rounded-2xl p-6 text-center shadow-soft">
                  <div className="w-14 h-14 bg-blush-light rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <v.icon size={24} className="text-blush-dark" />
                  </div>
                  <h3 className="font-cormorant text-xl font-semibold text-brown mb-2">{v.title}</h3>
                  <p className="text-sm text-brown-light">{v.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="py-16 bg-blush-dark text-white">
          <div className="max-w-4xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { num: "500+", label: "Happy Customers" },
              { num: "200+", label: "Products Created" },
              { num: "4.9★", label: "Average Rating" },
              { num: "2+", label: "Years of Craft" },
            ].map((s) => (
              <div key={s.label}>
                <p className="font-cormorant text-4xl font-semibold mb-1">{s.num}</p>
                <p className="text-blush-light text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
