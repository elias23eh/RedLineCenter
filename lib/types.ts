export interface Product {
  id: string;
  name: string;
  category: string | null;
  brand: string | null;
  price: number;
  discount_price: number | null;
  is_on_sale: boolean;
  description: string | null;
  image: string | null;
  in_stock: boolean;
  quantity: number;
  featured: boolean;
}

export interface Category {
  id: string;
  name: string;
  description: string | null;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  products?: Product;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  product_image: string | null;
  quantity: number;
  price_at_purchase: number;
}

export interface Order {
  id: string;
  user_id: string;
  status: string;
  payment_method: string | null;
  subtotal: number;
  total: number;
  notes: string | null;
  delivery_name: string | null;
  delivery_phone: string | null;
  delivery_address: string | null;
  created_at: string;
  order_items?: OrderItem[];
}
