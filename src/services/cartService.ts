import { CartItem, Product, Coupon } from '../types';
import { DEMO_COUPONS } from '../data/mockProducts';

const STORAGE_KEY_CART = 'amarbazaar_cart';
const STORAGE_KEY_COUPON = 'amarbazaar_applied_coupon';

export interface CartTotals {
  subtotal: number;
  discount: number;
  deliveryCharge: number;
  total: number;
  itemCount: number;
  couponCode?: string;
}

class CartService {
  private items: CartItem[] = [];
  private appliedCoupon: Coupon | null = null;
  private deliveryZoneRate: number = 60; // default inside dhaka

  constructor() {
    this.init();
  }

  private init() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_CART);
      if (stored) {
        this.items = JSON.parse(stored);
      }
      const storedCoupon = localStorage.getItem(STORAGE_KEY_COUPON);
      if (storedCoupon) {
        this.appliedCoupon = JSON.parse(storedCoupon);
      }
    } catch (e) {
      console.warn('Failed to load cart from storage', e);
      this.items = [];
    }
  }

  public getItems(): CartItem[] {
    return [...this.items];
  }

  public getItemCount(): number {
    return this.items.reduce((sum, item) => sum + item.quantity, 0);
  }

  public setDeliveryZoneRate(rate: number) {
    this.deliveryZoneRate = rate;
  }

  public getDeliveryZoneRate(): number {
    return this.deliveryZoneRate;
  }

  public getAppliedCoupon(): Coupon | null {
    return this.appliedCoupon;
  }

  public addItem(
    product: Product,
    quantity: number = 1,
    selectedVariants: Record<string, string> = {}
  ): { success: boolean; message: string } {
    if (product.stock <= 0) {
      return { success: false, message: 'This item is currently out of stock.' };
    }

    // Build unique identifier based on productId and selected variants
    const variantKey = Object.entries(selectedVariants)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${k}:${v}`)
      .join('|');
    const itemId = `${product.id}_${variantKey}`;

    const existingIndex = this.items.findIndex((item) => item.id === itemId);

    // Calculate unit price factoring variant adjustments
    let unitPrice = product.discountPrice ?? product.price;
    if (product.variants && selectedVariants) {
      for (const variant of product.variants) {
        const chosen = selectedVariants[variant.name];
        if (chosen && variant.priceAdjustments && variant.priceAdjustments[chosen]) {
          unitPrice += variant.priceAdjustments[chosen];
        }
      }
    }

    if (existingIndex > -1) {
      const newQty = this.items[existingIndex].quantity + quantity;
      if (newQty > product.stock) {
        return {
          success: false,
          message: `Cannot add more. Available stock is ${product.stock}.`,
        };
      }
      this.items[existingIndex].quantity = newQty;
    } else {
      if (quantity > product.stock) {
        return {
          success: false,
          message: `Cannot add requested quantity. Available stock is ${product.stock}.`,
        };
      }
      this.items.push({
        id: itemId,
        productId: product.id,
        product,
        quantity,
        selectedVariants,
        unitPrice,
      });
    }

    this.persist();
    return { success: true, message: 'Added to cart successfully!' };
  }

  public updateQuantity(itemId: string, newQuantity: number): boolean {
    const item = this.items.find((i) => i.id === itemId);
    if (!item) return false;

    if (newQuantity <= 0) {
      return this.removeItem(itemId);
    }

    if (newQuantity > item.product.stock) {
      item.quantity = item.product.stock;
      this.persist();
      return false;
    }

    item.quantity = newQuantity;
    this.persist();
    return true;
  }

  public removeItem(itemId: string): boolean {
    const prevLen = this.items.length;
    this.items = this.items.filter((i) => i.id !== itemId);
    this.persist();
    return this.items.length < prevLen;
  }

  public clearCart() {
    this.items = [];
    this.appliedCoupon = null;
    localStorage.removeItem(STORAGE_KEY_CART);
    localStorage.removeItem(STORAGE_KEY_COUPON);
  }

  public applyCoupon(code: string): { success: boolean; messageEn: string; messageBn: string } {
    const cleanCode = code.trim().toUpperCase();
    const coupon = DEMO_COUPONS.find(
      (c) => c.code.toUpperCase() === cleanCode && c.isActive
    );

    if (!coupon) {
      return {
        success: false,
        messageEn: 'Invalid or expired coupon code.',
        messageBn: 'ভুল বা মেয়াদোত্তীর্ণ কুপন কোড।',
      };
    }

    const subtotal = this.calculateSubtotal();
    if (coupon.minSpend && subtotal < coupon.minSpend) {
      return {
        success: false,
        messageEn: `This coupon requires a minimum spend of ৳${coupon.minSpend}.`,
        messageBn: `এই কুপনটির জন্য সর্বনিম্ন ৳${coupon.minSpend} টাকার অর্ডার আবশ্যক।`,
      };
    }

    this.appliedCoupon = coupon;
    try {
      localStorage.setItem(STORAGE_KEY_COUPON, JSON.stringify(coupon));
    } catch {
      // ignore
    }

    return {
      success: true,
      messageEn: `Coupon '${coupon.code}' applied successfully!`,
      messageBn: `কুপন '${coupon.code}' সফলভাবে যুক্ত হয়েছে!`,
    };
  }

  public removeCoupon() {
    this.appliedCoupon = null;
    localStorage.removeItem(STORAGE_KEY_COUPON);
  }

  public calculateSubtotal(): number {
    return this.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  }

  public calculateDiscount(subtotal: number): number {
    if (!this.appliedCoupon) return 0;
    if (this.appliedCoupon.minSpend && subtotal < this.appliedCoupon.minSpend) {
      return 0;
    }
    if (this.appliedCoupon.discountType === 'percentage') {
      return Math.round((subtotal * this.appliedCoupon.discountValue) / 100);
    }
    return Math.min(subtotal, this.appliedCoupon.discountValue);
  }

  public getTotals(): CartTotals {
    const subtotal = this.calculateSubtotal();
    const discount = this.calculateDiscount(subtotal);
    const deliveryCharge = this.items.length > 0 ? this.deliveryZoneRate : 0;
    const total = Math.max(0, subtotal - discount + deliveryCharge);
    const itemCount = this.getItemCount();

    return {
      subtotal,
      discount,
      deliveryCharge,
      total,
      itemCount,
      couponCode: this.appliedCoupon?.code,
    };
  }

  private persist() {
    try {
      localStorage.setItem(STORAGE_KEY_CART, JSON.stringify(this.items));
    } catch (e) {
      console.warn('Failed to persist cart to storage', e);
    }
  }
}

export const cartService = new CartService();
