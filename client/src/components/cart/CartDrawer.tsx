'use client';
import { useCartStore } from '@/src/store/cart.store';
import { useAuthStore } from '@/src/store/auth.store';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';

export function CartDrawer() {
  const { cart, isOpen, toggleCart, updateItem, removeItem } = useCartStore();
  const { user } = useAuthStore();

  const formatPrice = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-50 bg-black/20 backdrop-blur-[2px]" onClick={toggleCart} />

      {/* Drawer */}
      <div className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md bg-[#FAFAF8] shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#E8E6DF]">
          <div>
            <h2 className="font-display text-xl font-light tracking-wide">Your Cart</h2>
            <p className="text-xs text-[#888780] mt-0.5">{cart?.itemCount || 0} items</p>
          </div>
          <button onClick={toggleCart} className="p-2 hover:bg-[#F1EFE8] rounded-full">
            <X size={18} className="text-[#5F5E5A]" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!user ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-[#D3D1C7]" />
              <p className="text-sm text-[#888780]">Sign in to view your cart</p>
              <Link href="/auth/login" onClick={toggleCart} className="text-sm font-medium underline underline-offset-4">Sign in</Link>
            </div>
          ) : !cart || cart.items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
              <ShoppingBag size={40} className="text-[#D3D1C7]" />
              <p className="text-sm text-[#888780]">Your cart is empty</p>
              <Link href="/products" onClick={toggleCart} className="text-sm font-medium underline underline-offset-4">Continue shopping</Link>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b border-[#E8E6DF] last:border-0">
                  {/* Image placeholder */}
                  <div className="w-20 h-24 bg-[#F1EFE8] rounded-lg flex-shrink-0 flex items-center justify-center">
                    <ShoppingBag size={20} className="text-[#B4B2A9]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] text-[#888780] tracking-widest uppercase">{item.product.brand}</p>
                    <p className="text-sm font-medium mt-0.5 truncate">{item.product.name}</p>
                    {(item.size || item.color) && (
                      <p className="text-xs text-[#888780] mt-1">{[item.size, item.color].filter(Boolean).join(' · ')}</p>
                    )}
                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center gap-2 border border-[#E8E6DF] rounded-full px-3 py-1">
                        <button onClick={() => updateItem(item.id, item.quantity - 1)} className="text-[#888780] hover:text-[#1C1C1A]"><Minus size={12} /></button>
                        <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateItem(item.id, item.quantity + 1)} className="text-[#888780] hover:text-[#1C1C1A]"><Plus size={12} /></button>
                      </div>
                      <p className="text-sm font-medium">{formatPrice(item.product.price * item.quantity)}</p>
                    </div>
                  </div>
                  <button onClick={() => removeItem(item.id)} className="text-[#C4C2BA] hover:text-[#A32D2D] self-start mt-1"><X size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cart && cart.items.length > 0 && (
          <div className="px-6 py-5 border-t border-[#E8E6DF] space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-[#888780]">Subtotal</span>
              <span className="font-medium">{formatPrice(cart.subtotal)}</span>
            </div>
            <div className="flex justify-between text-xs text-[#888780]">
              <span>Shipping calculated at checkout</span>
              {cart.subtotal >= 500000 && <span className="text-green-700">Free shipping!</span>}
            </div>
            <Link
              href="/checkout"
              onClick={toggleCart}
              className="block w-full bg-[#1C1C1A] text-[#FAFAF8] text-sm font-medium text-center py-3.5 rounded-full hover:bg-[#2C2C2A] transition-colors"
            >
              Proceed to Checkout
            </Link>
            <button onClick={toggleCart} className="block w-full text-center text-sm text-[#888780] hover:text-[#1C1C1A]">
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
}
