import { WishlistItem, Product } from '../types';

const STORAGE_KEY_WISHLIST = 'amarbazaar_wishlist';

class WishlistService {
  private items: WishlistItem[] = [];

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_WISHLIST);
        if (stored) {
          this.items = JSON.parse(stored);
        }
      }
    } catch {
      this.items = [];
    }
  }

  public getItems(): WishlistItem[] {
    return [...this.items];
  }

  public isInWishlist(productId: string): boolean {
    return this.items.some((item) => item.productId === productId);
  }

  public toggleWishlist(product: Product): { added: boolean } {
    const existingIndex = this.items.findIndex((item) => item.productId === product.id);
    if (existingIndex > -1) {
      this.items.splice(existingIndex, 1);
      this.persist();
      return { added: false };
    } else {
      this.items.push({
        productId: product.id,
        product,
        addedAt: new Date().toISOString(),
      });
      this.persist();
      return { added: true };
    }
  }

  public removeItem(productId: string): boolean {
    const prev = this.items.length;
    this.items = this.items.filter((item) => item.productId !== productId);
    this.persist();
    return this.items.length < prev;
  }

  public clearWishlist() {
    this.items = [];
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.removeItem(STORAGE_KEY_WISHLIST);
      }
    } catch {
      // ignore
    }
  }

  private persist() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_WISHLIST, JSON.stringify(this.items));
      }
    } catch (e) {
      console.warn('Failed to persist wishlist', e);
    }
  }
}

export const wishlistService = new WishlistService();
