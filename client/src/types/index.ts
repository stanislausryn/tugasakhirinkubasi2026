export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  address?: string;
  role: 'customer' | 'admin';
  createdAt: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: 'women' | 'men' | 'accessories' | 'sale';
  sizes: string[];
  colors: string[];
  images: string[];
  stock: number;
  isFeatured: boolean;
  createdAt: string;
}

export interface CartItem {
  id: string;
  product: Product;
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: Array<{
    productId: string;
    name: string;
    brand: string;
    price: number;
    quantity: number;
    size: string;
    color: string;
    image: string;
  }>;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    name: string;
    phone: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
  };
  promoCode?: string;
  notes?: string;
  createdAt: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductResponse extends PaginatedResponse<Product> {}
