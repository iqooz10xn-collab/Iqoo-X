import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { productService } from '../services/productService';
import { DEMO_CATEGORIES } from '../data/mockProducts';
import { Product, FilterState, Category } from '../types';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/LoadingSkeleton';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import {
  Filter,
  SlidersHorizontal,
  X,
  Star,
  Check,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

interface ShopPageProps {
  initialCategory?: string;
  initialQuery?: string;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  initialCategory = '',
  initialQuery = '',
}) => {
  const { language, t, toBanglaDigits, route } = useApp();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filters state
  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory || route.category || '',
    minPrice: 0,
    maxPrice: 10000,
    brand: '',
    rating: 0,
    inStockOnly: false,
    onSaleOnly: route.query === 'sale',
    sortBy: 'relevance',
  });

  // Synchronize category and sale filters when route changes
  useEffect(() => {
    const targetCat = initialCategory || route.category || '';
    setFilters((prev) => {
      const isSale = route.query === 'sale';
      if (prev.category !== targetCat || (isSale && !prev.onSaleOnly)) {
        return {
          ...prev,
          category: targetCat,
          onSaleOnly: isSale ? true : prev.onSaleOnly,
        };
      }
      return prev;
    });
  }, [initialCategory, route.category, route.query]);

  // Extract unique brands for brand filter
  const allBrands = useMemo(() => {
    const brandsSet = new Set<string>();
    products.forEach((p) => {
      if (p.brand) brandsSet.add(p.brand);
    });
    return Array.from(brandsSet);
  }, [products]);

  // Load products based on query and filters
  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const query = initialQuery || (route.page === 'search' ? route.query : '');
        const results = await productService.searchAndFilter(query || '', filters);
        setProducts(results);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [filters, initialCategory, initialQuery, route]);

  const resetFilters = () => {
    setFilters({
      category: '',
      minPrice: 0,
      maxPrice: 10000,
      brand: '',
      rating: 0,
      inStockOnly: false,
      onSaleOnly: false,
      sortBy: 'relevance',
    });
  };

  const isFilterActive =
    filters.category !== '' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 10000 ||
    filters.brand !== '' ||
    filters.rating > 0 ||
    filters.inStockOnly ||
    filters.onSaleOnly;

  return (
    <div className="pb-16">
      <Breadcrumbs
        items={[
          {
            label: t('navShop'),
            active: !filters.category,
          },
          ...(filters.category
            ? [
                {
                  label:
                    DEMO_CATEGORIES.find((c: Category) => c.slug === filters.category)?.[
                      language === 'bn' ? 'nameBn' : 'nameEn'
                    ] || filters.category,
                  active: true,
                },
              ]
            : []),
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-2">
        {/* Header Title & Sorting Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {filters.category
                ? DEMO_CATEGORIES.find((c: Category) => c.slug === filters.category)?.[
                    language === 'bn' ? 'nameBn' : 'nameEn'
                  ] || t('navShop')
                : t('navShop')}
            </h1>
            <p className="text-stone-500 text-xs sm:text-sm mt-1">
              {t('showingProducts', {
                count: products.length,
                total: products.length,
              })}
            </p>
          </div>

          <div className="flex items-center gap-3 self-end sm:self-auto">
            {/* Mobile Filter Trigger Button */}
            <button
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl flex items-center gap-2 transition"
            >
              <SlidersHorizontal className="w-4 h-4 text-emerald-700" />
              <span>{t('filter')}</span>
              {isFilterActive && (
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
              )}
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500 font-medium hidden sm:inline">
                {t('sortBy')}:
              </span>
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters((prev: FilterState) => ({
                    ...prev,
                    sortBy: e.target.value as FilterState['sortBy'],
                  }))
                }
                className="px-3 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:outline-hidden focus:border-emerald-600 cursor-pointer"
              >
                <option value="relevance">{t('sortRelevance')}</option>
                <option value="newest">{t('sortNewest')}</option>
                <option value="price-low-to-high">{t('sortPriceLowHigh')}</option>
                <option value="price-high-to-low">{t('sortPriceHighLow')}</option>
                <option value="rating">{t('sortRating')}</option>
              </select>
            </div>
          </div>
        </div>

        {/* Active Filter Badges */}
        {isFilterActive && (
          <div className="flex items-center gap-2 flex-wrap py-3 border-b border-stone-100 text-xs">
            <span className="text-stone-400 font-medium">{t('filter')}:</span>
            {filters.category && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-medium border border-emerald-200">
                {DEMO_CATEGORIES.find((c: Category) => c.slug === filters.category)?.[
                  language === 'bn' ? 'nameBn' : 'nameEn'
                ]}
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-950"
                  onClick={() => setFilters((prev: FilterState) => ({ ...prev, category: '' }))}
                />
              </span>
            )}
            {filters.brand && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-medium border border-emerald-200">
                {filters.brand}
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-950"
                  onClick={() => setFilters((prev: FilterState) => ({ ...prev, brand: '' }))}
                />
              </span>
            )}
            {filters.onSaleOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-rose-50 text-rose-800 rounded-lg font-medium border border-rose-200">
                {t('flashSale')}
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-rose-950"
                  onClick={() => setFilters((prev: FilterState) => ({ ...prev, onSaleOnly: false }))}
                />
              </span>
            )}
            {filters.inStockOnly && (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-800 rounded-lg font-medium border border-emerald-200">
                {t('inStock')}
                <X
                  className="w-3.5 h-3.5 cursor-pointer hover:text-emerald-950"
                  onClick={() => setFilters((prev: FilterState) => ({ ...prev, inStockOnly: false }))}
                />
              </span>
            )}
            <button
              onClick={resetFilters}
              className="text-emerald-700 hover:text-emerald-900 font-semibold underline text-xs ml-2 cursor-pointer flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> {t('clearAllFilters')}
            </button>
          </div>
        )}

        {/* Layout: Sidebar + Product Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-6">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6">
            <div className="bg-white p-5 rounded-2xl border border-stone-200/90 shadow-2xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                  <Filter className="w-4 h-4 text-emerald-600" />
                  <span>{t('filter')}</span>
                </div>
                {isFilterActive && (
                  <button
                    onClick={resetFilters}
                    className="text-[11px] text-emerald-700 hover:text-emerald-900 font-semibold"
                  >
                    {t('reset')}
                  </button>
                )}
              </div>

              {/* Category Filter */}
              <div>
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2.5">
                  {t('allCategories')}
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => setFilters((prev: FilterState) => ({ ...prev, category: '' }))}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition ${
                      filters.category === ''
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-stone-600 hover:bg-stone-50'
                    }`}
                  >
                    {t('viewAll')}
                  </button>
                  {DEMO_CATEGORIES.map((cat: Category) => (
                    <button
                      key={cat.id}
                      onClick={() =>
                        setFilters((prev: FilterState) => ({ ...prev, category: cat.slug }))
                      }
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition flex items-center justify-between ${
                        filters.category === cat.slug
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                      <span className="text-[10px] text-stone-400">({cat.itemCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Range Filter */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2.5">
                  {t('priceRange')}
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={filters.minPrice}
                      onChange={(e) =>
                        setFilters((prev: FilterState) => ({
                          ...prev,
                          minPrice: Number(e.target.value),
                        }))
                      }
                      placeholder="Min ৳"
                      className="w-1/2 p-2 text-xs border border-stone-200 rounded-lg text-stone-800"
                    />
                    <span className="text-stone-400 text-xs">-</span>
                    <input
                      type="number"
                      value={filters.maxPrice}
                      onChange={(e) =>
                        setFilters((prev: FilterState) => ({
                          ...prev,
                          maxPrice: Number(e.target.value),
                        }))
                      }
                      placeholder="Max ৳"
                      className="w-1/2 p-2 text-xs border border-stone-200 rounded-lg text-stone-800"
                    />
                  </div>
                </div>
              </div>

              {/* Brands Filter */}
              {allBrands.length > 0 && (
                <div className="pt-4 border-t border-stone-100">
                  <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2.5">
                    {t('brand')}
                  </h4>
                  <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                    {allBrands.map((b: string) => (
                      <label
                        key={b}
                        className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer hover:text-emerald-700"
                      >
                        <input
                          type="radio"
                          name="brand"
                          checked={filters.brand === b}
                          onChange={() =>
                            setFilters((prev: FilterState) => ({
                              ...prev,
                              brand: prev.brand === b ? '' : b,
                            }))
                          }
                          className="accent-emerald-600"
                        />
                        <span className="truncate">{b}</span>
                      </label>
                    ))}
                  </div>
                </div>
              )}

              {/* Availability & Offers checkboxes */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) =>
                      setFilters((prev: FilterState) => ({
                        ...prev,
                        inStockOnly: e.target.checked,
                      }))
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>{t('inStock')}</span>
                </label>

                <label className="flex items-center gap-2 text-xs text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={filters.onSaleOnly}
                    onChange={(e) =>
                      setFilters((prev: FilterState) => ({
                        ...prev,
                        onSaleOnly: e.target.checked,
                      }))
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="text-rose-700 font-medium">{t('discountFilter')}</span>
                </label>
              </div>

              {/* Rating Filter */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2.5">
                  {t('ratingFilter')}
                </h4>
                <div className="space-y-1.5">
                  {[4, 3, 2].map((stars: number) => (
                    <button
                      key={stars}
                      onClick={() =>
                        setFilters((prev: FilterState) => ({
                          ...prev,
                          rating: prev.rating === stars ? 0 : stars,
                        }))
                      }
                      className={`w-full text-left px-2 py-1 rounded text-xs flex items-center gap-1.5 transition ${
                        filters.rating === stars
                          ? 'bg-amber-50 text-amber-900 font-bold'
                          : 'text-stone-600 hover:bg-stone-50'
                      }`}
                    >
                      <div className="flex items-center text-amber-400">
                        {[...Array(stars)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                      </div>
                      <span>
                        {stars} {language === 'bn' ? 'স্টার ও তার বেশি' : '★ & above'}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {Array(6)
                  .fill(0)
                  .map((_, i) => (
                    <ProductCardSkeleton key={i} />
                  ))}
              </div>
            ) : products.length === 0 ? (
              /* Empty Search / Filter State */
              <div className="bg-white rounded-2xl border border-stone-200/90 p-12 text-center max-w-lg mx-auto">
                <div className="w-14 h-14 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto mb-4">
                  <Filter className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-stone-900 text-lg">
                  {t('noResultsFound')}
                </h3>
                <p className="text-stone-500 text-xs sm:text-sm mt-1 leading-relaxed">
                  {t('noResultsSuggestion')}
                </p>
                <div className="mt-6">
                  <button
                    onClick={resetFilters}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs rounded-xl transition shadow-xs"
                  >
                    {t('clearAllFilters')}
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            onClick={() => setMobileFilterOpen(false)}
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs"
          />

          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white p-5 shadow-2xl flex flex-col z-10 overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-stone-200">
              <div className="flex items-center gap-2 font-bold text-stone-900 text-base">
                <SlidersHorizontal className="w-4 h-4 text-emerald-600" />
                <span>{t('filter')}</span>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 text-stone-500 hover:text-stone-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-6">
              {/* Categories */}
              <div>
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2">
                  {t('allCategories')}
                </h4>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      setFilters((prev: FilterState) => ({ ...prev, category: '' }));
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs ${
                      filters.category === ''
                        ? 'bg-emerald-50 text-emerald-800 font-bold'
                        : 'text-stone-600'
                    }`}
                  >
                    {t('viewAll')}
                  </button>
                  {DEMO_CATEGORIES.map((cat: Category) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setFilters((prev: FilterState) => ({ ...prev, category: cat.slug }));
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between ${
                        filters.category === cat.slug
                          ? 'bg-emerald-50 text-emerald-800 font-bold'
                          : 'text-stone-600'
                      }`}
                    >
                      <span>{language === 'bn' ? cat.nameBn : cat.nameEn}</span>
                      <span className="text-[10px] text-stone-400">({cat.itemCount})</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Price range */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="font-bold text-stone-800 text-xs uppercase tracking-wider mb-2">
                  {t('priceRange')}
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={filters.minPrice}
                    onChange={(e) =>
                      setFilters((prev: FilterState) => ({ ...prev, minPrice: Number(e.target.value) }))
                    }
                    placeholder="Min"
                    className="w-1/2 p-2 text-xs border rounded-lg"
                  />
                  <span>-</span>
                  <input
                    type="number"
                    value={filters.maxPrice}
                    onChange={(e) =>
                      setFilters((prev: FilterState) => ({ ...prev, maxPrice: Number(e.target.value) }))
                    }
                    placeholder="Max"
                    className="w-1/2 p-2 text-xs border rounded-lg"
                  />
                </div>
              </div>

              {/* In stock */}
              <div className="pt-4 border-t border-stone-100 space-y-2">
                <label className="flex items-center gap-2 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={filters.inStockOnly}
                    onChange={(e) =>
                      setFilters((prev: FilterState) => ({ ...prev, inStockOnly: e.target.checked }))
                    }
                  />
                  <span>{t('inStock')}</span>
                </label>
                <label className="flex items-center gap-2 text-xs text-stone-700">
                  <input
                    type="checkbox"
                    checked={filters.onSaleOnly}
                    onChange={(e) =>
                      setFilters((prev: FilterState) => ({ ...prev, onSaleOnly: e.target.checked }))
                    }
                  />
                  <span>{t('discountFilter')}</span>
                </label>
              </div>
            </div>

            <div className="mt-auto pt-4 border-t border-stone-200">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md"
              >
                {t('apply')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
