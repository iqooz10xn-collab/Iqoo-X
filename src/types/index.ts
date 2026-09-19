export type Language = 'en' | 'bn';

export interface ProductVariant {
  id: string;
  name: string; // e.g. "Size", "Weight", "Color"
  options: string[]; // e.g. ["M", "L", "XL"] or ["500g", "1kg"]
  priceAdjustments?: Record<string, number>;
}

export interface Review {
  id: string;
  userName: string;
  rating: number; // 1 to 5
  date: string;
  comment: string;
  verifiedPurchase: boolean;
}

export interface Product {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  descriptionEn: string;
  descriptionBn: string;
  category: string;
  subcategory: string;
  price: number; // Regular Price in BDT
  discountPrice?: number; // Discounted Price in BDT
  stock: number;
  sku: string;
  brand: string;
  images: string[];
  variants?: ProductVariant[];
  selectedVariants?: Record<string, string>;
  size?: string[];
  color?: string[];
  weight?: string[];
  tags: string[];
  rating: number;
  reviewCount: number;
  reviews?: Review[];
  specifications?: Record<string, string>;
  isFeatured?: boolean;
  isNewArrival?: boolean;
  isSale?: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  slug: string;
  nameEn: string;
  nameBn: string;
  iconName: string;
  image: string;
  subcategories: { slug: string; nameEn: string; nameBn: string }[];
  itemCount: number;
}

export interface Brand {
  id: string;
  name: string;
  logo?: string;
}

export interface CartItem {
  id: string; // cart item unique id (product id + variant hash)
  productId: string;
  product: Product;
  quantity: number;
  selectedVariants: Record<string, string>;
  unitPrice: number;
}

export interface WishlistItem {
  productId: string;
  product: Product;
  addedAt: string;
}

export type PaymentMethod = 'cod' | 'bkash' | 'nagad' | 'rocket' | 'upay';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned';

export interface Address {
  fullName: string;
  phone: string;
  email?: string;
  division: string;
  district: string;
  upazila: string;
  streetAddress: string;
  postalCode?: string;
  deliveryNote?: string;
}

export interface OrderItem {
  productId: string;
  nameEn: string;
  nameBn: string;
  image: string;
  quantity: number;
  unitPrice: number;
  selectedVariants?: Record<string, string>;
  totalPrice: number;
}

export interface Order {
  id: string;
  customerId: string;
  customerInfo: {
    name: string;
    phone: string;
    email?: string;
  };
  shippingAddress: Address;
  items: OrderItem[];
  subtotal: number;
  discountAmount: number;
  couponCode?: string;
  deliveryCharge: number;
  totalAmount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  estimatedDeliveryDate?: string;
  trackingNumber?: string;
  courierPartner?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minSpend?: number;
  expiryDate: string;
  isActive: boolean;
  descriptionEn: string;
  descriptionBn: string;
}

export interface ShippingZone {
  id: string;
  nameEn: string;
  nameBn: string;
  rate: number;
  estimatedDaysEn: string;
  estimatedDaysBn: string;
}

export interface CustomerUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  addresses: Address[];
  createdAt: string;
}

export interface AdminAnalytics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Order[];
}

export interface FilterState {
  category: string;
  minPrice: number;
  maxPrice: number;
  brand: string;
  rating: number;
  inStockOnly: boolean;
  onSaleOnly: boolean;
  sortBy: 'relevance' | 'newest' | 'price-low-to-high' | 'price-high-to-low' | 'rating';
}
