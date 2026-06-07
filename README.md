# 🧶 NavkalaCrochet — Full-Stack E-Commerce

A complete, production-ready handmade crochet store built with Next.js 15, TypeScript, Prisma, Stripe, and Tailwind CSS.

---

## ✨ Features

| Area | Features |
|------|----------|
| **Storefront** | Home, Shop, Product Detail, Categories, Search & Filters |
| **Cart & Wishlist** | Persistent cart, coupon codes, price summary |
| **Checkout** | Multi-step checkout, Stripe payments, Cash on Delivery |
| **Auth** | Email/Password + Google OAuth, JWT sessions, Password Reset |
| **User Dashboard** | Orders history, tracking, profile, wishlist |
| **Admin Panel** | Products, Orders, Users, Categories, Coupons, Reviews, Custom Orders |
| **Reviews** | Star ratings, verified purchase badge, admin moderation |
| **Custom Orders** | Form → Admin review → Status updates |
| **Emails** | Welcome, Order Confirmation, Shipping Update, Password Reset |
| **SEO** | Dynamic meta tags, sitemap.xml, robots.txt, Open Graph |
| **Security** | Auth middleware, rate limiting ready, input validation, bcrypt |

---

## 🚀 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + custom design tokens
- **Database**: PostgreSQL + Prisma ORM
- **Auth**: NextAuth v5 (Auth.js)
- **Payments**: Stripe
- **Images**: Cloudinary
- **Email**: Resend
- **State**: Zustand (cart + wishlist, persisted)
- **Animations**: Framer Motion
- **Forms**: React Hook Form + Zod (validation ready)
- **Deployment**: Vercel

---

## 📁 Project Structure

```
navkala-crochet/
├── prisma/
│   ├── schema.prisma        # Full database schema
│   └── seed.ts              # Seed with demo data
├── src/
│   ├── app/
│   │   ├── (auth)/          # Login, Register, Forgot/Reset Password
│   │   ├── (shop)/          # Shop, Product, Cart, Checkout, Wishlist
│   │   ├── (user)/          # User Dashboard
│   │   ├── (admin)/         # Admin Panel (Products, Orders, Users…)
│   │   ├── about/           # About Us
│   │   ├── contact/         # Contact
│   │   ├── faq/             # FAQs
│   │   ├── custom-order/    # Custom Order form
│   │   ├── terms/           # Terms & Conditions
│   │   ├── privacy/         # Privacy Policy
│   │   ├── api/             # All API routes
│   │   ├── sitemap.ts       # Dynamic sitemap
│   │   └── robots.ts        # Robots.txt
│   ├── components/
│   │   ├── admin/           # Admin Sidebar, Product Form
│   │   ├── home/            # Hero, Categories, Products, Testimonials…
│   │   ├── layout/          # Navbar, Footer
│   │   ├── product/         # ProductCard, Skeleton
│   │   └── shared/          # Providers
│   ├── lib/
│   │   ├── auth.ts          # NextAuth config
│   │   ├── prisma.ts        # Prisma client
│   │   ├── stripe.ts        # Stripe client
│   │   ├── cloudinary.ts    # Cloudinary upload
│   │   ├── email.ts         # Email templates (Resend)
│   │   └── utils.ts         # Helper functions
│   ├── store/
│   │   └── cart.ts          # Zustand cart + wishlist store
│   ├── types/
│   │   └── index.ts         # TypeScript types
│   └── middleware.ts        # Auth & route protection
└── .env.example             # Environment variables template
```

---

## ⚙️ Installation

### 1. Clone and install

```bash
git clone https://github.com/yourusername/navkala-crochet.git
cd navkala-crochet
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env.local
# Fill in all values (see below)
```

### 3. Set up the database

```bash
# Push schema to your PostgreSQL database
npm run db:push

# Generate Prisma client
npm run db:generate

# Seed with demo data
npm run db:seed
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables

```env
# ── Database ──────────────────────────────────────────
DATABASE_URL="postgresql://user:password@localhost:5432/navkala_crochet"

# ── NextAuth ──────────────────────────────────────────
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="run: openssl rand -base64 32"

# ── Google OAuth ──────────────────────────────────────
# https://console.cloud.google.com/
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# ── Stripe ────────────────────────────────────────────
# https://dashboard.stripe.com/apikeys
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# ── Cloudinary ────────────────────────────────────────
# https://cloudinary.com/console
CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

# ── Resend (Email) ────────────────────────────────────
# https://resend.com/api-keys
RESEND_API_KEY="re_..."
FROM_EMAIL="noreply@navkalacrochet.com"

# ── App ───────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
NEXT_PUBLIC_APP_NAME="NavkalaCrochet"
```

---

## 🌐 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET/POST | `/api/products` | List / Create products |
| GET/PUT/DELETE | `/api/products/[id]` | Single product CRUD |
| GET/POST | `/api/orders` | List / Create orders |
| GET/PUT | `/api/orders/[id]` | Order detail / Update status |
| GET/POST | `/api/categories` | List / Create categories |
| PUT/DELETE | `/api/categories/[id]` | Update / Delete category |
| GET/POST/DELETE | `/api/cart` | Cart management |
| GET/POST/DELETE | `/api/wishlist` | Wishlist management |
| POST | `/api/coupons` | Validate coupon |
| GET/POST/PUT/DELETE | `/api/coupons/admin` | Admin coupon CRUD |
| POST | `/api/reviews` | Submit review |
| GET/PUT/DELETE | `/api/reviews/admin` | Admin review moderation |
| POST | `/api/custom-orders` | Submit custom order |
| GET | `/api/custom-orders` | Admin: list custom orders |
| PUT | `/api/custom-orders/[id]` | Admin: update status |
| GET | `/api/users` | Admin: list users |
| PUT | `/api/users/[id]` | Admin: update user role |
| GET | `/api/admin/stats` | Admin dashboard stats |
| POST | `/api/auth/register` | User registration |
| POST | `/api/auth/forgot-password` | Send password reset email |
| POST | `/api/auth/reset-password` | Reset password with token |
| POST | `/api/stripe/create-intent` | Create Stripe PaymentIntent |
| POST | `/api/stripe/webhook` | Stripe webhook handler |
| POST | `/api/upload` | Upload image to Cloudinary |
| POST | `/api/newsletter` | Newsletter subscription |

---

## 🧪 Demo Credentials

After running `npm run db:seed`:

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@navkalacrochet.com | Admin@123 |
| **User** | demo@navkalacrochet.com | User@1234 |

**Demo Coupons**: `WELCOME10` · `FLAT50` · `NAVKALA20` · `FREESHIP`

---

## 🚀 Deployment (Vercel)

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy on Vercel

1. Go to [vercel.com](https://vercel.com) → **New Project**
2. Import your GitHub repository
3. Add all environment variables from `.env.example`
4. Deploy!

### 3. Set up production database

Use **Vercel Postgres**, **Supabase**, **Railway**, or **Neon**:

```bash
# After setting DATABASE_URL in Vercel env vars:
npx prisma db push
npx prisma db seed
```

### 4. Configure Stripe Webhook

In your Stripe Dashboard → Webhooks:
- Endpoint URL: `https://your-domain.com/api/stripe/webhook`
- Events: `payment_intent.succeeded`, `payment_intent.payment_failed`
- Copy the signing secret → `STRIPE_WEBHOOK_SECRET`

### 5. Configure Google OAuth

In Google Cloud Console:
- Authorized redirect URIs: `https://your-domain.com/api/auth/callback/google`

### 6. Configure Cloudinary

Upload preset: Create an **unsigned** upload preset in Cloudinary settings.

---

## 🛠 Available Scripts

```bash
npm run dev          # Start dev server (http://localhost:3000)
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint

npm run db:push      # Push Prisma schema to database
npm run db:generate  # Generate Prisma client
npm run db:seed      # Seed database with demo data
npm run db:studio    # Open Prisma Studio (DB GUI)
```

---

## 🎨 Design System

| Token | Value |
|-------|-------|
| Primary | Blush Dark `#8B4B5A` |
| Accent | Blush `#e8a0b4` |
| Background | Warm White `#fff9f6` |
| Text | Brown `#5c3a2e` |
| Heading Font | Cormorant Garamond (serif) |
| Body Font | DM Sans (sans-serif) |

---

## 📄 License

MIT © NavkalaCrochet 2025

---

Built with 🧶 and ❤️ — *every stitch tells a story.*
# Navkal-e-commerce
