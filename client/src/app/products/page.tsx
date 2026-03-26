'use client';
import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/src/lib/api';
import { Product, PaginatedResponse, ProductResponse } from '@/src/types';
import { ProductCard } from '@/src/components/product/ProductCard';
import { Search, SlidersHorizontal } from 'lucide-react';

const CATEGORIES = ['all', 'women', 'men', 'accessories', 'sale'];

function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('createdAt');
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, any> = { page, limit: 12, sort };
    if (category !== 'all') params.category = category;
    if (search) params.search = search;

    api.get<ProductResponse>('/products', { params })
      .then((response) => { 
        console.log('DEBUG [products]:', response.data);
        const data = response.data;
        setProducts(data.items); 
        setTotal(data.total); 
      })
      .catch((err) => { console.error('Error fetching products:', err) })
      .finally(() => setLoading(false));
  }, [category, search, sort, page]);

  const totalPages = Math.ceil(total / 12);

  return (
    <div className="pt-24 pb-16 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-xs text-[#888780] tracking-widest uppercase mb-2">Collection</p>
        <h1 className="font-display text-4xl font-light text-[#1C1C1A]">All Products</h1>
        <p className="text-sm text-[#888780] mt-2">{total} items</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        {/* Search */}
        <div className="relative flex-1 max-w-sm">
          <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B4B2A9]" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-[#E8E6DF] rounded-full text-sm outline-none focus:border-[#888780] transition-colors"
          />
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => { setCategory(c); setPage(1); }}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm capitalize transition-colors ${
                category === c
                  ? 'bg-[#1C1C1A] text-[#FAFAF8]'
                  : 'bg-white border border-[#E8E6DF] text-[#888780] hover:border-[#888780]'
              }`}
            >
              {c === 'all' ? 'All' : c}
            </button>
          ))}
        </div>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => { setSort(e.target.value); setPage(1); }}
          className="px-4 py-2.5 bg-white border border-[#E8E6DF] rounded-full text-sm text-[#888780] outline-none cursor-pointer"
        >
          <option value="createdAt">Newest</option>
          <option value="price">Price: Low to High</option>
          <option value="name">Name A-Z</option>
        </select>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="aspect-[3/4] bg-[#F1EFE8] rounded-2xl mb-3" />
              <div className="h-3 bg-[#F1EFE8] rounded w-1/2 mb-2" />
              <div className="h-4 bg-[#F1EFE8] rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-[#888780]">No products found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-12">
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-9 h-9 rounded-full text-sm transition-colors ${
                page === i + 1
                  ? 'bg-[#1C1C1A] text-white'
                  : 'border border-[#E8E6DF] text-[#888780] hover:border-[#888780]'
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="pt-24 pb-16 px-6 max-w-7xl mx-auto text-center text-[#888780] animate-pulse">Loading collection...</div>}>
      <ProductsContent />
    </Suspense>
  );
}
