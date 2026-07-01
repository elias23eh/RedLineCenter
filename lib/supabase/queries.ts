import { createClient } from "./client";

export interface WebsiteProduct {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string | null;
  featured: boolean;
  inStock: boolean;
}

export interface WebsiteCategory {
  id: string;
  name: string;
  description: string;
  subcategories: string[];
}

export async function fetchProducts(): Promise<WebsiteProduct[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("products")
    .select("id, name, category, price, description, image, featured, in_stock")
    .order("name");
  if (error || !data) return [];
  return data.map(p => ({
    id: p.id,
    name: p.name,
    category: p.category ?? "",
    price: Number(p.price),
    description: p.description ?? "",
    image: p.image,
    featured: p.featured,
    inStock: p.in_stock,
  }));
}

export async function fetchCategories(): Promise<WebsiteCategory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("id, name, description, subcategories")
    .order("name");
  if (error || !data) return [];
  return data.map(c => ({ id: c.id, name: c.name, description: c.description ?? "", subcategories: c.subcategories ?? [] }));
}
