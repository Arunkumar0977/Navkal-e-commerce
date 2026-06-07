import Link from "next/link";
import { Heart, Mail, Phone, MapPin, AtSign, Share2, Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-brown text-cream/80">
      {/* Newsletter Banner */}
      <div className="bg-blush-dark">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="font-cormorant text-3xl text-white font-semibold">
              Join Our Crafty Community
            </h3>
            <p className="text-blush-light text-sm mt-1">
              Get 10% off your first order + exclusive sneak peeks
            </p>
          </div>
          <form className="flex gap-3 w-full md:w-auto">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-1 md:w-72 px-5 py-3 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/50 text-sm focus:outline-none focus:border-white/50"
            />
            <button type="submit" className="px-6 py-3 bg-white text-blush-dark rounded-full text-sm font-medium hover:bg-cream transition-colors whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <Link href="/" className="block mb-4">
              <span className="font-cormorant text-3xl text-white font-semibold">Navkala</span>
              <span className="block text-[10px] tracking-[4px] text-blush uppercase">Crochet</span>
            </Link>
            <p className="text-sm leading-relaxed mb-6 text-cream/60">
              Handmade with love and care. Each piece is thoughtfully crafted to bring warmth, 
              color, and joy into your life.
            </p>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-blush-dark transition-colors">
                <AtSign size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-blush-dark transition-colors">
                <Share2 size={16} />
              </a>
              <a href="#" className="w-9 h-9 bg-white/10 rounded-full flex items-center justify-center hover:bg-blush-dark transition-colors">
                <Globe size={16} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-medium mb-4 tracking-wide text-sm uppercase">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Shop All", href: "/shop" },
                { label: "Custom Orders", href: "/custom-order" },
                { label: "About Us", href: "/about" },
                { label: "Contact", href: "/contact" },
                { label: "FAQs", href: "/faq" },
                { label: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/60 hover:text-blush-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-white font-medium mb-4 tracking-wide text-sm uppercase">
              Categories
            </h4>
            <ul className="space-y-3">
              {[
                { label: "Crochet Flowers", href: "/shop?category=flowers" },
                { label: "Bouquets", href: "/shop?category=bouquets" },
                { label: "Keychains", href: "/shop?category=keychains" },
                { label: "Bags", href: "/shop?category=bags" },
                { label: "Plushies", href: "/shop?category=plushies" },
                { label: "Accessories", href: "/shop?category=accessories" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-cream/60 hover:text-blush-light transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-medium mb-4 tracking-wide text-sm uppercase">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail size={16} className="text-blush mt-0.5 flex-shrink-0" />
                <a href="mailto:hello@navkalacrochet.com" className="text-sm text-cream/60 hover:text-blush-light transition-colors">
                  hello@navkalacrochet.com
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Phone size={16} className="text-blush mt-0.5 flex-shrink-0" />
                <a href="tel:+919999999999" className="text-sm text-cream/60 hover:text-blush-light transition-colors">
                  +91 99999 99999
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={16} className="text-blush mt-0.5 flex-shrink-0" />
                <span className="text-sm text-cream/60">India</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream/40">
          <p>© {new Date().getFullYear()} NavkalaCrochet. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Made with <Heart size={12} className="text-blush fill-blush" /> in India
          </p>
          <div className="flex gap-4">
            <Link href="/privacy" className="hover:text-blush-light transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-blush-light transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
