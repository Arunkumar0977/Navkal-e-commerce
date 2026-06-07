import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Metadata } from "next";

export const metadata: Metadata = { title: "Terms & Conditions" };

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <section className="bg-cream py-16 text-center px-4">
          <h1 className="font-cormorant text-5xl font-semibold text-brown mb-3">Terms & Conditions</h1>
          <p className="text-brown-light text-sm">Last updated: January 2025</p>
        </section>
        <section className="py-16 max-w-3xl mx-auto px-4 sm:px-6">
          <div className="prose prose-sm max-w-none space-y-8 text-brown-light leading-relaxed">
            {[
              {
                title: "1. Acceptance of Terms",
                content: "By accessing and using the NavkalaCrochet website (navkalacrochet.com), you agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, please do not use our website or services.",
              },
              {
                title: "2. Products & Descriptions",
                content: "All products sold on NavkalaCrochet are handmade. Due to the handcrafted nature of our products, minor variations in size, colour, and finish may occur between the product images and the actual item received. These variations are a natural characteristic of handmade goods and do not constitute a defect.",
              },
              {
                title: "3. Pricing & Payments",
                content: "All prices are listed in Indian Rupees (INR) and include applicable taxes. We reserve the right to modify prices at any time. Payments are processed securely via Razorpay or Cash on Delivery. By placing an order, you confirm that the payment information provided is accurate and valid.",
              },
              {
                title: "4. Order Cancellations",
                content: "Orders may be cancelled within 12 hours of placement, provided they have not yet entered the processing stage. Custom orders cannot be cancelled once work has commenced. To cancel an order, contact us immediately at hello@navkalacrochet.com with your order number.",
              },
              {
                title: "5. Shipping & Delivery",
                content: "We ship across India. Estimated delivery timelines are 5–7 business days for standard shipping. NavkalaCrochet is not responsible for delays caused by courier services, weather events, or other circumstances beyond our control. Risk of loss and title for products passes to you upon delivery.",
              },
              {
                title: "6. Returns & Refunds",
                content: "Unused, undamaged items in original condition may be returned within 7 days of delivery. Custom orders, personalised items, and sale items are final sale and non-refundable. Refunds are processed within 5–7 business days after receipt and inspection of the returned item.",
              },
              {
                title: "7. Intellectual Property",
                content: "All content on this website — including photographs, descriptions, logos, and designs — is the intellectual property of NavkalaCrochet. Reproduction, distribution, or commercial use of any content without prior written consent is strictly prohibited.",
              },
              {
                title: "8. Limitation of Liability",
                content: "NavkalaCrochet shall not be liable for any indirect, incidental, special, or consequential damages arising from the use of our products or website. Our maximum liability is limited to the amount paid for the specific product in question.",
              },
              {
                title: "9. Governing Law",
                content: "These Terms shall be governed by and construed in accordance with the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts located in India.",
              },
              {
                title: "10. Contact",
                content: "For any questions about these Terms & Conditions, please contact us at hello@navkalacrochet.com.",
              },
            ].map(section => (
              <div key={section.title}>
                <h2 className="font-cormorant text-2xl font-semibold text-brown mb-3">{section.title}</h2>
                <p>{section.content}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
