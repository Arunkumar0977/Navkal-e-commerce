"use client";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { Sparkles, Send, CheckCircle2 } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useUser } from "@clerk/nextjs";

const PRODUCT_TYPES = ["Crochet Flower","Crochet Bouquet","Crochet Keychain","Crochet Bag","Crochet Plushie","Crochet Accessory","Other"];

export default function CustomOrderPage() {
  const { user } = useUser();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: user?.fullName || "", email: user?.primaryEmailAddress?.emailAddress || "",
    phone: "", productType: "", colors: "", description: "", budget: "", deadline: "", forOccasion: "",
  });
  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.phone || !form.description) { toast.error("Please fill all required fields"); return; }
    setLoading(true);
    const res = await fetch("/api/custom-orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name, email: form.email, phone: form.phone, budget: form.budget, deadline: form.deadline,
        description: `Type: ${form.productType || "Not specified"}\nColors: ${form.colors || "Flexible"}\nOccasion: ${form.forOccasion || "N/A"}\n\n${form.description}`,
      }),
    });
    setLoading(false);
    if (res.ok) { setSubmitted(true); toast.success("Request submitted! 🌸"); }
    else toast.error("Submission failed. Try again.");
  };

  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-lavender-light/40 to-blush-light/30 py-20 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-blush-light/60 text-blush-dark px-4 py-2 rounded-full text-sm mb-5">
            <Sparkles size={14} /> Custom Made, Just for You
          </div>
          <h1 className="font-cormorant text-5xl font-semibold text-brown mb-4">Request a Custom Order</h1>
          <p className="text-brown-light max-w-lg mx-auto">Share your vision and we'll bring it to life, stitch by stitch.</p>
        </section>

        <section className="py-14 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h2 className="font-cormorant text-3xl font-semibold text-brown text-center mb-10">How It Works</h2>
            <div className="grid sm:grid-cols-4 gap-6 text-center">
              {[
                { step:"1", icon:"📝", title:"Submit Request", desc:"Fill the form with your requirements" },
                { step:"2", icon:"💬", title:"We Review",       desc:"We'll contact you within 24–48 hours" },
                { step:"3", icon:"✅", title:"Confirm & Pay",   desc:"Approve the quote and pay a deposit" },
                { step:"4", icon:"🎁", title:"Receive",         desc:"Your custom piece, crafted with love" },
              ].map(s => (
                <div key={s.step} className="relative">
                  {parseInt(s.step) < 4 && <div className="hidden sm:block absolute top-6 left-[60%] w-[80%] h-0.5 bg-border" />}
                  <div className="w-12 h-12 bg-blush-light rounded-full flex items-center justify-center mx-auto mb-3 text-2xl">{s.icon}</div>
                  <p className="text-xs text-blush-dark font-medium mb-1">Step {s.step}</p>
                  <p className="font-cormorant text-lg font-semibold text-brown">{s.title}</p>
                  <p className="text-xs text-brown-light mt-1">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 bg-cream">
          <div className="max-w-2xl mx-auto px-4">
            {submitted ? (
              <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} className="card-soft p-12 text-center">
                <CheckCircle2 size={56} className="text-green-500 mx-auto mb-5" />
                <h2 className="font-cormorant text-3xl font-semibold text-brown mb-3">Request Submitted! 🎉</h2>
                <p className="text-brown-light mb-2">Thank you, <strong>{form.name}</strong>! We've received your request.</p>
                <p className="text-brown-light text-sm">We'll contact you at <strong>{form.email}</strong> within 24–48 hours.</p>
                <button onClick={() => { setSubmitted(false); setForm({ name:"",email:"",phone:"",productType:"",colors:"",description:"",budget:"",deadline:"",forOccasion:"" }); }}
                  className="btn-outline mt-8">Submit Another Request</button>
              </motion.div>
            ) : (
              <div className="card-soft p-8">
                <h2 className="font-cormorant text-2xl font-semibold text-brown mb-6">Tell Us What You Want</h2>
                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div><label className="block text-xs font-medium text-brown mb-1.5">Your Name *</label><input value={form.name} onChange={e=>set("name",e.target.value)} className="input-soft" placeholder="Full name" required /></div>
                    <div><label className="block text-xs font-medium text-brown mb-1.5">Email *</label><input type="email" value={form.email} onChange={e=>set("email",e.target.value)} className="input-soft" placeholder="your@email.com" required /></div>
                    <div><label className="block text-xs font-medium text-brown mb-1.5">Phone / WhatsApp *</label><input type="tel" value={form.phone} onChange={e=>set("phone",e.target.value)} className="input-soft" placeholder="+91 98765 43210" required /></div>
                    <div><label className="block text-xs font-medium text-brown mb-1.5">Product Type</label><select value={form.productType} onChange={e=>set("productType",e.target.value)} className="input-soft"><option value="">Select type</option>{PRODUCT_TYPES.map(t=><option key={t}>{t}</option>)}</select></div>
                    <div><label className="block text-xs font-medium text-brown mb-1.5">Preferred Colours</label><input value={form.colors} onChange={e=>set("colors",e.target.value)} className="input-soft" placeholder="blush pink, white…" /></div>
                    <div><label className="block text-xs font-medium text-brown mb-1.5">Occasion</label><input value={form.forOccasion} onChange={e=>set("forOccasion",e.target.value)} className="input-soft" placeholder="Birthday, Wedding…" /></div>
                    <div><label className="block text-xs font-medium text-brown mb-1.5">Budget (₹)</label><input value={form.budget} onChange={e=>set("budget",e.target.value)} className="input-soft" placeholder="₹300–₹500" /></div>
                    <div><label className="block text-xs font-medium text-brown mb-1.5">Needed By</label><input type="date" value={form.deadline} onChange={e=>set("deadline",e.target.value)} className="input-soft" /></div>
                  </div>
                  <div><label className="block text-xs font-medium text-brown mb-1.5">Describe Your Order *</label><textarea value={form.description} onChange={e=>set("description",e.target.value)} rows={5} required className="input-soft resize-none" placeholder="Please describe in detail…" /></div>
                  <button type="submit" disabled={loading} className="btn-primary w-full py-4 flex items-center justify-center gap-2">
                    <Send size={16} />{loading ? "Submitting…" : "Submit Custom Order Request"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
