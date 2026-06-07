import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "react-hot-toast";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "NavkalaCrochet — Handmade Crochet Creations",
    template: "%s | NavkalaCrochet",
  },
  description:
    "Discover exquisite handmade crochet products — flowers, bouquets, keychains, bags, plushies & more. Each piece crafted with love.",
  keywords: ["crochet","handmade","crochet flowers","crochet bags","handmade gifts","NavkalaCrochet"],
  openGraph: {
    title: "NavkalaCrochet — Handmade with Love",
    description: "Discover exquisite handmade crochet products crafted with love.",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "NavkalaCrochet",
    images: [{ url: "/og-image.jpg", width: 1200, height: 630 }],
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider
      appearance={{
        variables: {
          colorPrimary: "#8B4B5A",
          colorBackground: "#fff9f6",
          colorText: "#5c3a2e",
          colorInputBackground: "#ffffff",
          colorInputText: "#5c3a2e",
          borderRadius: "0.75rem",
        },
        elements: {
          formButtonPrimary:
            "bg-[#8B4B5A] hover:bg-[#7a3f4e] text-white rounded-full text-sm font-medium tracking-wide",
          card: "shadow-[0_4px_24px_rgba(139,75,90,0.1)] rounded-2xl border-0",
          socialButtonsBlockButton:
            "border border-[#f0d9d0] hover:bg-[#fdf6f0] rounded-xl",
          footerActionLink: "text-[#8B4B5A] hover:text-[#7a3f4e]",
        },
      }}
    >
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap"
            rel="stylesheet"
          />
        </head>
        <body className="font-sans antialiased">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: "#fff9f6",
                color: "#5c3a2e",
                border: "1px solid #f0d9d0",
                borderRadius: "12px",
              },
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
