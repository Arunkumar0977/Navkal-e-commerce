export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  comparePrice?: number;
  images: string[];
  category: { id: string; name: string; slug: string };
  categoryId: string;
  stock: number;
  sku: string;
  featured: boolean;
  trending: boolean;
  bestSeller: boolean;
  newArrival: boolean;
  isActive: boolean;
  tags: string[];
  variants: Variant[];
  reviews?: Review[];
  _count?: { reviews: number };
  createdAt: string;
  updatedAt: string;
}

export interface Variant {
  id: string;
  productId: string;
  color?: string;
  size?: string;
  price?: number;
  stock: number;
  sku?: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  user: { name: string; image?: string };
  rating: number;
  title?: string;
  body: string;
  images: string[];
  verified: boolean;
  helpful: number;
  approved: boolean;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: { name: string; email: string };
  items: OrderItem[];
  status: OrderStatus;
  subtotal: number;
  shipping: number;
  tax: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  paymentIntentId?: string;
  trackingId?: string;
  shippingAddress: Address;
  billingAddress?: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  product: { name: string; images: string[]; slug: string };
  quantity: number;
  price: number;
  color?: string;
  size?: string;
}

export type OrderStatus =
  | "PENDING"
  | "PROCESSING"
  | "SHIPPED"
  | "DELIVERED"
  | "CANCELLED"
  | "RETURNED";

export type PaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export interface Address {
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: { products: number };
}

export interface Coupon {
  id: string;
  code: string;
  type: "PERCENTAGE" | "FIXED";
  value: number;
  minOrder?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
}

export interface CustomOrder {
  id: string;
  name: string;
  email: string;
  phone: string;
  description: string;
  budget?: string;
  deadline?: string;
  images: string[];
  status: string;
  createdAt: string;
}

export interface User {
  id: string;
  name?: string;
  email: string;
  image?: string;
  role: "USER" | "ADMIN";
  phone?: string;
  createdAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
