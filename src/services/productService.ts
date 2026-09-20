import { Product, Category, FilterState } from '../types';
import { DEMO_PRODUCTS, DEMO_CATEGORIES } from '../data/mockProducts';

const STORAGE_KEY_PRODUCTS = 'amarbazaar_products';

class ProductService {
  private products: Product[] = [];
  private categories: Category[] = DEMO_CATEGORIES;

  constructor() {
    this.init();
  }

  private init() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem(STORAGE_KEY_PRODUCTS);
        if (stored) {
          this.products = JSON.parse(stored);
        } else {
          this.products = [...DEMO_PRODUCTS];
          localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));
        }
      } else {
        this.products = [...DEMO_PRODUCTS];
      }
    } catch {
      this.products = [...DEMO_PRODUCTS];
    }
  }

  public async getAllProducts(): Promise<Product[]> {
    return [...this.products];
  }

  public async getProductBySlug(slug: string): Promise<Product | undefined> {
    return this.products.find((p) => p.slug === slug);
  }

  public async getProductById(id: string): Promise<Product | undefined> {
    return this.products.find((p) => p.id === id);
  }

  public async getCategories(): Promise<Category[]> {
    return [...this.categories];
  }

  public async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return this.categories.find((c) => c.slug === slug);
  }

  public async getFeaturedProducts(): Promise<Product[]> {
    return this.products.filter((p) => p.isFeatured);
  }

  public async getNewArrivals(): Promise<Product[]> {
    return this.products.filter((p) => p.isNewArrival);
  }

  public async getSaleProducts(): Promise<Product[]> {
    return this.products.filter((p) => p.isSale || (p.discountPrice && p.discountPrice < p.price));
  }

  public async getRelatedProducts(currentProductId: string, category: string): Promise<Product[]> {
    return this.products
      .filter((p) => p.id !== currentProductId && p.category === category)
      .slice(0, 4);
  }

  public async searchAndFilter(
    query: string,
    filters?: Partial<FilterState>
  ): Promise<Product[]> {
    let list = [...this.products];

    // Search query matching English, Bangla, SKU, Category, Brand, Tags
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((p) => {
        return (
          p.nameEn.toLowerCase().includes(q) ||
          p.nameBn.includes(q) ||
          p.sku.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tags.some((t) => t.toLowerCase().includes(q))
        );
      });
    }

    if (filters) {
      if (filters.category) {
        list = list.filter((p) => p.category === filters.category);
      }
      if (typeof filters.minPrice === 'number' && filters.minPrice > 0) {
        list = list.filter((p) => (p.discountPrice || p.price) >= filters.minPrice!);
      }
      if (typeof filters.maxPrice === 'number' && filters.maxPrice > 0) {
        list = list.filter((p) => (p.discountPrice || p.price) <= filters.maxPrice!);
      }
      if (filters.brand) {
        list = list.filter((p) => p.brand.toLowerCase() === filters.brand?.toLowerCase());
      }
      if (typeof filters.rating === 'number' && filters.rating > 0) {
        list = list.filter((p) => p.rating >= filters.rating!);
      }
      if (filters.inStockOnly) {
        list = list.filter((p) => p.stock > 0);
      }
      if (filters.onSaleOnly) {
        list = list.filter((p) => p.isSale || (p.discountPrice && p.discountPrice < p.price));
      }

      // Sorting
      if (filters.sortBy) {
        switch (filters.sortBy) {
          case 'newest':
            list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'price-low-to-high':
            list.sort(
              (a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price)
            );
            break;
          case 'price-high-to-low':
            list.sort(
              (a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price)
            );
            break;
          case 'rating':
            list.sort((a, b) => b.rating - a.rating);
            break;
          default:
            // relevance / featured default
            list.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
            break;
        }
      }
    }

    return list;
  }

  // Admin mutation methods (ready for real database sync)
  public async addProduct(product: Product): Promise<Product> {
    this.products.unshift(product);
    this.persist();
    return product;
  }

  public async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
    const idx = this.products.findIndex((p) => p.id === id);
    if (idx === -1) return undefined;
    this.products[idx] = { ...this.products[idx], ...updates };
    this.persist();
    return this.products[idx];
  }

  public async deleteProduct(id: string): Promise<boolean> {
    const before = this.products.length;
    this.products = this.products.filter((p) => p.id !== id);
    this.persist();
    return this.products.length < before;
  }

  private persist() {
    try {
      if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(this.products));
      }
    } catch (e) {
      console.warn('Failed to persist products locally', e);
    }
  }
}

export const productService = new ProductService();
