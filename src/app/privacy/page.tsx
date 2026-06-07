import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-cream py-16 text-center px-4">
          <h1 className="font-cormorant text-5xl font-semibold text-brown mb-3">Privacy Policy</h1>
          <p className="text-brown-light text-sm">Last updated: January 2025</p>
        </section>
        <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="space-y-8 text-brown-light leading-relaxed text-sm">
            {[
              {
                title: "1. Information We Collect",
                content: "We collect information you provide directly to us, including: name, email address, phone number, shipping address, and payment information when you make a purchase. We also automatically collect certain information when you visit our site, such as your IP address, browser type, pages visited, and time spent.",
              },
              {
                title: "2. How We Use Your Information",
                content: "We use the information we collect to: process and fulfil your orders, send order confirmations and shipping updates, respond to your comments and questions, send promotional communications (with your consent), improve our website and services, and comply with legal obligations.",
              },
              {
                title: "3. Sharing Your Information",
                content: "We do not sell, trade, or rent your personal information to third parties. We may share your information with trusted service providers who assist us in operating our website (such as payment processors, shipping partners, and email services), subject to strict confidentiality agreements.",
              },
              {
                title: "4. Payment Security",
                content: "All payment information is processed securely through Razorpay. We do not store your credit card details on our servers. Razorpay is PCI-DSS compliant and uses industry-standard encryption to protect your payment data.",
              },
              {
                title: "5. Cookies",
                content: "We use cookies and similar technologies to enhance your experience, analyse site traffic, and personalise content. You can control cookie settings through your browser. Disabling cookies may affect certain features of our website.",
              },
              {
                title: "6. Data Retention",
                content: "We retain your personal information for as long as necessary to fulfil the purposes outlined in this policy, comply with legal obligations, resolve disputes, and enforce our agreements. You may request deletion of your account data at any time.",
              },
              {
                title: "7. Your Rights",
                content: "You have the right to: access the personal information we hold about you, correct inaccurate data, request deletion of your data, opt out of marketing communications, and lodge a complaint with a supervisory authority. Contact us at hello@navkalacrochet.com to exercise these rights.",
              },
              {
                title: "8. Children's Privacy",
                content: "Our website is not directed to children under 13. We do not knowingly collect personal information from children under 13. If you believe we have inadvertently collected such information, please contact us immediately.",
              },
              {
                title: "9. Changes to This Policy",
                content: "We may update this Privacy Policy periodically. We will notify you of significant changes by posting the new policy on our website with a revised date. Continued use of our services after changes constitutes acceptance of the updated policy.",
              },
              {
                title: "10. Contact Us",
                content: "If you have any questions about this Privacy Policy or our data practices, please contact us at hello@navkalacrochet.com. We aim to respond to all privacy-related inquiries within 48 hours.",
              },
            ].map(s => (
              <div key={s.title}>
                <h2 className="font-cormorant text-2xl font-semibold text-brown mb-3">{s.title}</h2>
                <p>{s.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
