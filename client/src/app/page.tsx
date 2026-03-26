'use client';
export const dynamic = 'force-dynamic';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/src/types';
import api from '@/src/lib/api';
import { ProductCard } from '@/src/components/product/ProductCard';
import { ArrowRight, ChevronRight } from 'lucide-react';

export default function HomePage() {
  const [featured, setFeatured] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/products/featured')
      .then((response) => {
        console.log('DEBUG [featured]:', response.data);
        setFeatured(response.data);
      })
      .catch((err) => { console.error('Error fetching featured products:', err) })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-16">
      {/* Hero */}
      <section className="px-6 py-12 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-h-[520px]">
          {/* Main hero */}
          <div className="relative bg-[#F1EFE8] rounded-3xl p-10 flex flex-col justify-end overflow-hidden">
            <div className="relative z-10">
              <p className="text-xs text-[#888780] tracking-[0.25em] uppercase mb-4">New Collection 2025</p>
              <h1 className="font-display text-5xl font-light text-[#1C1C1A] leading-tight mb-6">
                Timeless style,<br />modern fit.
              </h1>
              <Link
                href="/products"
                className="inline-flex items-center gap-2 border border-[#888780] text-[#1C1C1A] text-sm px-6 py-3 rounded-full hover:bg-[#1C1C1A] hover:text-white hover:border-[#1C1C1A] transition-all"
              >
                Shop Now <ArrowRight size={14} />
              </Link>
            </div>
            {/* Decorative */}
            <div className="absolute right-10 top-1/2 -translate-y-1/2 opacity-10">
              <div className="w-48 h-48 rounded-full border-2 border-[#1C1C1A]" />
              <div className="w-32 h-32 rounded-full border border-[#1C1C1A] absolute top-8 left-8" />
            </div>
          </div>

          {/* Sub cards */}
          <div className="flex flex-col gap-4">
            {[
              { label: "Women's Edit", sub: "Spring essentials", bg: '#E8E6DF', cat: 'women' },
              { label: "Men's Collection", sub: "Refined classics", bg: '#D3D1C7', cat: 'men' },
            ].map((c) => (
              <Link key={c.cat} href={`/products?category=${c.cat}`} className="group flex-1 rounded-3xl p-8 flex flex-col justify-end relative overflow-hidden" style={{ background: c.bg }}>
                <p className="text-[10px] text-[#5F5E5A] tracking-widest uppercase mb-1">{c.sub}</p>
                <div className="flex items-center justify-between">
                  <span className="font-display text-2xl text-[#1C1C1A] font-light">{c.label}</span>
                  <ChevronRight size={16} className="text-[#888780] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-xs text-[#888780] tracking-widest uppercase mb-2">Curated for you</p>
            <h2 className="font-display text-3xl font-light text-[#1C1C1A]">Trending Now</h2>
          </div>
          <Link href="/products" className="text-sm text-[#888780] hover:text-[#1C1C1A] flex items-center gap-1">
            View all <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-[#F1EFE8] rounded-2xl mb-3" />
                <div className="h-3 bg-[#F1EFE8] rounded w-1/2 mb-2" />
                <div className="h-4 bg-[#F1EFE8] rounded w-3/4" />
              </div>
            ))}
          </div>
        ) : featured.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#888780] text-sm">Products will appear here once added.</p>
            <Link href="/products" className="text-sm font-medium underline underline-offset-4 mt-3 inline-block">Browse all</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featured.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        )}
      </section>

      {/* Banner */}
      <section className="px-6 py-6 max-w-7xl mx-auto">
        <div className="bg-[#F1EFE8] rounded-3xl px-10 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs text-[#888780] tracking-widest uppercase mb-2">Limited Offer</p>
            <h3 className="font-display text-3xl font-light text-[#1C1C1A]">End of Season Sale</h3>
            <p className="text-sm text-[#5F5E5A] mt-2">Up to 40% off selected items. Use code <strong className="text-[#1C1C1A]">MODERNO10</strong> for extra 10% off.</p>
          </div>
          <Link href="/products?category=sale" className="flex-shrink-0 bg-[#1C1C1A] text-[#FAFAF8] text-sm px-8 py-3.5 rounded-full hover:bg-[#2C2C2A] transition-colors">
            Shop Sale
          </Link>
        </div>
      </section>

      {/* Categories */}
      <section className="px-6 py-10 max-w-7xl mx-auto">
        <h2 className="font-display text-3xl font-light text-[#1C1C1A] mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Women', emoji: '♀', bg: '#EAF3DE', cat: 'women' },
            { name: 'Men', emoji: '♂', bg: '#E6F1FB', cat: 'men' },
            { name: 'Accessories', emoji: '◇', bg: '#FAEEDA', cat: 'accessories' },
            { name: 'Sale', emoji: '%', bg: '#FBEAF0', cat: 'sale' },
          ].map((c) => (
            <Link key={c.cat} href={`/products?category=${c.cat}`} className="group rounded-2xl p-6 text-center hover:shadow-sm transition-shadow" style={{ background: c.bg }}>
              <div className="text-2xl mb-3">{c.emoji}</div>
              <p className="text-sm font-medium text-[#1C1C1A]">{c.name}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#E8E6DF] mt-16 px-6 py-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between gap-8">
          <div>
            <p className="font-display text-xl tracking-[0.2em] mb-3">MODERNO</p>
            <p className="text-sm text-[#888780] max-w-xs">Timeless fashion for the modern individual. Quality pieces that last beyond seasons.</p>
          </div>
          <div className="flex gap-16 text-sm">
            <div>
              <p className="font-medium mb-3">Shop</p>
              {['Women', 'Men', 'Accessories', 'Sale'].map((l) => (
                <Link key={l} href={`/products?category=${l.toLowerCase()}`} className="block text-[#888780] hover:text-[#1C1C1A] mb-2">{l}</Link>
              ))}
            </div>
            <div>
              <p className="font-medium mb-3">Help</p>
              {['Shipping', 'Returns', 'Size Guide', 'Contact'].map((l) => (
                <p key={l} className="text-[#888780] mb-2">{l}</p>
              ))}
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-8 pt-6 border-t border-[#E8E6DF] text-xs text-[#B4B2A9]">
          © 2025 MODERNO. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
