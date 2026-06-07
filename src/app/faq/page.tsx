import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "FAQs",
  description: "Frequently asked questions about NavkalaCrochet — shipping, returns, custom orders and more.",
};

const faqs = [
  {
    category: "Orders & Shipping",
    items: [
      {
        q: "How long does delivery take?",
        a: "Standard delivery takes 5–7 business days across India. Express shipping (2–3 days) is available at checkout for select pincodes.",
      },
      {
        q: "Do you offer free shipping?",
        a: "Yes! All orders above ₹500 qualify for free standard shipping anywhere in India. Orders below ₹500 have a flat ₹60 shipping charge.",
      },
      {
        q: "How can I track my order?",
        a: "Once your order is shipped, you'll receive a tracking ID via email. You can also view your tracking info from your Dashboard under 'My Orders'.",
      },
      {
        q: "Can I change or cancel my order?",
        a: "You can cancel or modify your order within 12 hours of placing it, before it enters processing. Contact us at hello@navkalacrochet.com immediately.",
      },
    ],
  },
  {
    category: "Products",
    items: [
      {
        q: "Are your products really handmade?",
        a: "Absolutely! Every single product is handcrafted by us. No machines, no mass production — just genuine handmade artistry in every stitch.",
      },
      {
        q: "What yarn/materials do you use?",
        a: "We use premium quality acrylic and cotton yarns that are soft, durable, and hypoallergenic. All materials are carefully chosen for longevity and beauty.",
      },
      {
        q: "How do I care for my crochet product?",
        a: "Hand wash gently in cold water with mild soap. Lay flat to dry — avoid wringing or machine washing. Keep away from direct sunlight for extended periods.",
      },
      {
        q: "Will the colours look exactly like the photos?",
        a: "We do our best to represent colours accurately. Minor variations may occur due to screen settings and lighting during photography.",
      },
    ],
  },
  {
    category: "Custom Orders",
    items: [
      {
        q: "Do you take custom orders?",
        a: "Yes! We love custom orders. You can submit a request via our Custom Order page with your requirements, budget, and deadline. We'll get back within 24–48 hours.",
      },
      {
        q: "How long does a custom order take?",
        a: "Most custom orders take 7–14 business days depending on complexity. We'll confirm the exact timeline when we accept your request.",
      },
      {
        q: "Can I request a specific colour or size?",
        a: "Absolutely. In your custom order form, describe exactly what you want — colours, size, style, and any special details. We'll accommodate wherever possible.",
      },
    ],
  },
  {
    category: "Returns & Refunds",
    items: [
      {
        q: "What is your return policy?",
        a: "We accept returns within 7 days of delivery for unused, undamaged items in their original condition. Custom and personalised orders are non-refundable.",
      },
      {
        q: "How do I initiate a return?",
        a: "Email us at hello@navkalacrochet.com with your order number and reason for return. We'll guide you through the process.",
      },
      {
        q: "When will I get my refund?",
        a: "Refunds are processed within 5–7 business days after we receive and inspect the returned item. The amount will be credited to your original payment method.",
      },
    ],
  },
  {
    category: "Payments",
    items: [
      {
        q: "What payment methods do you accept?",
        a: "We accept Credit/Debit Cards (via Razorpay), UPI, Net Banking, and Cash on Delivery (COD) for eligible pincodes.",
      },
      {
        q: "Is online payment safe?",
        a: "Yes — all payments are processed via Razorpay, a globally trusted payment gateway with 256-bit SSL encryption. We never store your card details.",
      },
      {
        q: "Can I use a coupon code?",
        a: "Yes! Enter your coupon code at checkout in the 'Have a coupon?' section. Discounts are applied instantly before payment.",
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-gradient-to-br from-cream to-blush-light/20 py-20 text-center px-4">
          <p className="text-blush-dark text-sm tracking-[4px] uppercase mb-3">Help</p>
          <h1 className="font-cormorant text-5xl font-semibold text-brown mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-brown-light max-w-md mx-auto">
            Everything you need to know about NavkalaCrochet. Can't find your answer?{" "}
            <Link href="/contact" className="text-blush-dark underline">Contact us</Link>.
          </p>
        </section>

        <section className="py-20 max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          {faqs.map((section) => (
            <div key={section.category}>
              <h2 className="font-cormorant text-2xl font-semibold text-brown mb-6 flex items-center gap-3">
                <span className="w-8 h-0.5 bg-blush-dark inline-block" />
                {section.category}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <details
                    key={i}
                    className="group bg-white rounded-2xl shadow-soft overflow-hidden"
                  >
                    <summary className="flex items-center justify-between gap-4 px-6 py-5 cursor-pointer list-none select-none hover:bg-cream/50 transition-colors">
                      <span className="font-medium text-brown text-sm sm:text-base">{item.q}</span>
                      <span className="text-blush-dark text-xl flex-shrink-0 group-open:rotate-45 transition-transform duration-200">+</span>
                    </summary>
                    <div className="px-6 pb-5 text-sm text-brown-light leading-relaxed border-t border-border pt-4">
                      {item.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="py-16 bg-blush-dark text-white text-center px-4">
          <h2 className="font-cormorant text-3xl font-semibold mb-3">Still have questions?</h2>
          <p className="text-blush-light mb-6">We're happy to help — reach out anytime.</p>
          <Link href="/contact"
            className="inline-block bg-white text-blush-dark px-8 py-3 rounded-full font-medium hover:bg-cream transition-colors">
            Contact Us
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
