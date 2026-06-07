"use client";

import Link from "next/link";
import { useUser, useClerk, SignInButton, UserButton } from "@clerk/nextjs";
import { useState, useEffect } from "react";
import { useCartStore, useWishlistStore } from "@/store/cart";
import { ShoppingBag, Heart, Menu, X, Search, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const navLinks = [
  { label: "Home", href: "/" },
  {
    label: "Shop", href: "/shop",
    children: [
      { label: "All Products",     href: "/shop" },
      { label: "Crochet Flowers",  href: "/shop?category=flowers" },
      { label: "Bouquets",         href: "/shop?category=bouquets" },
      { label: "Keychains",        href: "/shop?category=keychains" },
      { label: "Bags",             href: "/shop?category=bags" },
      { label: "Plushies",         href: "/shop?category=plushies" },
      { label: "Accessories",      href: "/shop?category=accessories" },
    ],
  },
  { label: "Custom Order", href: "/custom-order" },
  { label: "About",        href: "/about" },
  { label: "Contact",      href: "/contact" },
];

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const { openSignIn } = useClerk();
  const getTotalItems  = useCartStore(s => s.getTotalItems);
  const wishlistItems  = useWishlistStore(s => s.items);
  const [scrolled,     setScrolled]     = useState(false);
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [searchOpen,   setSearchOpen]   = useState(false);
  const [searchQuery,  setSearchQuery]  = useState("");

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const cartCount     = getTotalItems();
  const wishlistCount = wishlistItems.length;
  const isAdmin       = (user?.publicMetadata as any)?.role === "ADMIN";

  return (
    <>
      <header className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled ? "bg-white/95 backdrop-blur-md shadow-soft py-3" : "bg-transparent py-5",
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex flex-col leading-none">
            <span className="font-cormorant text-2xl font-semibold text-brown">Navkala</span>
            <span className="text-[10px] tracking-[4px] text-blush-dark uppercase">Crochet</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map(link =>
              link.children ? (
                <div key={link.href} className="relative group">
                  <button className="flex items-center gap-1 text-sm text-brown-light hover:text-blush-dark transition-colors font-medium">
                    {link.label} <ChevronDown size={14} className="group-hover:rotate-180 transition-transform" />
                  </button>
                  <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-medium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 translate-y-2 group-hover:translate-y-0 overflow-hidden">
                    {link.children.map(c => (
                      <Link key={c.href} href={c.href} className="block px-5 py-3 text-sm text-brown hover:bg-cream hover:text-blush-dark transition-colors">
                        {c.label}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link key={link.href} href={link.href} className="text-sm text-brown-light hover:text-blush-dark transition-colors font-medium">
                  {link.label}
                </Link>
              )
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button onClick={() => setSearchOpen(true)} className="p-2 hover:bg-cream rounded-full transition-colors">
              <Search size={20} className="text-brown-light" />
            </button>

            <Link href="/wishlist" className="relative p-2 hover:bg-cream rounded-full transition-colors">
              <Heart size={20} className="text-brown-light" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blush-dark text-white text-[10px] rounded-full flex items-center justify-center">{wishlistCount}</span>
              )}
            </Link>

            <Link href="/cart" className="relative p-2 hover:bg-cream rounded-full transition-colors">
              <ShoppingBag size={20} className="text-brown-light" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-blush-dark text-white text-[10px] rounded-full flex items-center justify-center">{cartCount}</span>
              )}
            </Link>

            {isSignedIn ? (
              <div className="hidden lg:flex items-center gap-2">
                {isAdmin && (
                  <Link href="/admin" className="text-xs text-blush-dark hover:underline font-medium px-2">
                    Admin
                  </Link>
                )}
                <Link href="/dashboard" className="text-xs text-brown-light hover:text-blush-dark font-medium px-2">
                  Dashboard
                </Link>
                <UserButton />
              </div>
            ) : (
              <SignInButton mode="modal">
                <button className="hidden lg:flex btn-primary text-xs px-5 py-2.5">
                  Sign In
                </button>
              </SignInButton>
            )}

            <button onClick={() => setMobileOpen(true)} className="p-2 hover:bg-cream rounded-full transition-colors lg:hidden">
              <Menu size={22} className="text-brown" />
            </button>
          </div>
        </div>
      </header>

      {/* Search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] flex items-start justify-center pt-24 px-4"
            onClick={() => setSearchOpen(false)}>
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -20, opacity: 0 }}
              onClick={e => e.stopPropagation()}
              className="w-full max-w-2xl bg-white rounded-3xl shadow-strong overflow-hidden">
              <div className="flex items-center gap-4 p-6">
                <Search size={20} className="text-blush-dark" />
                <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === "Enter" && searchQuery.trim()) { window.location.href = `/shop?search=${searchQuery}`; } }}
                  placeholder="Search for crochet flowers, bags, plushies..."
                  className="flex-1 text-lg text-brown placeholder:text-beige focus:outline-none" />
                <button onClick={() => setSearchOpen(false)}><X size={20} className="text-brown-light" /></button>
              </div>
              <div className="px-6 pb-5">
                <p className="text-xs text-brown-light mb-3">Popular Searches</p>
                <div className="flex flex-wrap gap-2">
                  {["Crochet Flowers", "Bouquet", "Keychain", "Plushie", "Bag"].map(t => (
                    <Link key={t} href={`/shop?search=${t}`} onClick={() => setSearchOpen(false)}
                      className="px-3 py-1.5 bg-cream rounded-full text-xs text-brown hover:bg-blush-light transition-colors">{t}</Link>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-[60]" onClick={() => setMobileOpen(false)} />
            <motion.div initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25 }}
              className="fixed top-0 right-0 h-full w-80 bg-white z-[70] shadow-strong overflow-y-auto">
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <span className="font-cormorant text-xl font-semibold text-brown">Menu</span>
                  <button onClick={() => setMobileOpen(false)}><X size={22} className="text-brown" /></button>
                </div>

                {isSignedIn && (
                  <div className="mb-6 p-4 bg-cream rounded-2xl flex items-center gap-3">
                    <UserButton />
                    <div>
                      <p className="font-medium text-brown text-sm">{user?.fullName}</p>
                      <p className="text-xs text-brown-light">{user?.primaryEmailAddress?.emailAddress}</p>
                    </div>
                  </div>
                )}

                <nav className="flex flex-col gap-1">
                  {navLinks.map(link => (
                    <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                      className="block px-4 py-3 text-brown hover:bg-cream rounded-xl transition-colors font-medium">
                      {link.label}
                    </Link>
                  ))}
                </nav>

                <div className="mt-6 pt-6 border-t border-cream-dark flex flex-col gap-3">
                  {isSignedIn ? (
                    <>
                      <Link href="/dashboard" onClick={() => setMobileOpen(false)} className="btn-outline text-center">Dashboard</Link>
                      {isAdmin && (
                        <Link href="/admin" onClick={() => setMobileOpen(false)} className="btn-outline text-center">Admin Panel</Link>
                      )}
                    </>
                  ) : (
                    <SignInButton mode="modal">
                      <button onClick={() => setMobileOpen(false)} className="btn-primary w-full">Sign In</button>
                    </SignInButton>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
