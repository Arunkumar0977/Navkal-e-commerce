"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { Mail, Phone, MapPin, ExternalLink, Send } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    await new Promise(r => setTimeout(r, 1000));
    setSending(false);
    setSent(true);
    toast.success("Message sent! We'll reply within 24 hours 🌸");
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-blush-light/30 to-lavender-light/20 py-20 text-center px-4">
          <h1 className="font-cormorant text-5xl font-semibold text-brown mb-4">Get in Touch</h1>
          <p className="text-brown-light max-w-md mx-auto">
            Have a question, a custom request, or just want to say hello? We'd love to hear from you!
          </p>
        </section>

        <section className="py-20 max-w-6xl mx-auto px-4 sm:px-6">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Info */}
            <div>
              <h2 className="font-cormorant text-3xl font-semibold text-brown mb-8">Contact Info</h2>
              <div className="space-y-6">
                {[
                  { icon: Mail, label: "Email", val: "hello@navkalacrochet.com", href: "mailto:hello@navkalacrochet.com" },
                  { icon: Phone, label: "Phone / WhatsApp", val: "+91 99999 99999", href: "tel:+919999999999" },
                  { icon: MapPin, label: "Location", val: "India", href: "#" },
                  { icon: ExternalLink, label: "Instagram", val: "@navkalacrochet", href: "https://instagram.com/navkalacrochet" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-blush-light flex items-center justify-center flex-shrink-0">
                      <item.icon size={20} className="text-blush-dark" />
                    </div>
                    <div>
                      <p className="text-xs text-brown-light mb-0.5">{item.label}</p>
                      <a href={item.href} target={item.href.startsWith("http") ? "_blank" : undefined}
                        className="text-brown font-medium hover:text-blush-dark transition-colors">
                        {item.val}
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 p-6 bg-cream rounded-2xl">
                <h3 className="font-cormorant text-xl font-semibold text-brown mb-2">Working Hours</h3>
                <p className="text-sm text-brown-light">Monday – Saturday: 10am – 7pm IST</p>
                <p className="text-sm text-brown-light">Sunday: Rest day 🌸</p>
                <p className="text-sm text-brown-light mt-2">We typically reply within 24 hours.</p>
              </div>
            </div>

            {/* Form */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="card-soft p-8">
              {sent ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">🌸</div>
                  <h3 className="font-cormorant text-2xl font-semibold text-brown mb-2">Message Sent!</h3>
                  <p className="text-brown-light">We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                    className="btn-outline mt-6">Send Another</button>
                </div>
              ) : (
                <>
                  <h2 className="font-cormorant text-2xl font-semibold text-brown mb-6">Send a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-brown mb-1.5">Name *</label>
                        <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                          className="input-soft" placeholder="Your name" required />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-brown mb-1.5">Email *</label>
                        <input type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                          className="input-soft" placeholder="your@email.com" required />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brown mb-1.5">Subject</label>
                      <input value={form.subject} onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
                        className="input-soft" placeholder="What's it about?" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-brown mb-1.5">Message *</label>
                      <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                        rows={5} required className="input-soft resize-none"
                        placeholder="Tell us everything…" />
                    </div>
                    <button type="submit" disabled={sending} className="btn-primary w-full flex items-center justify-center gap-2 py-4">
                      <Send size={16} /> {sending ? "Sending…" : "Send Message"}
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
