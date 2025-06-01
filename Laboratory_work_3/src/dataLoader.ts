import { Category, Product } from './models';

export async function fetchCategories(): Promise<Category[]> {
  const resp = await fetch('data/categories.json');
  return await resp.json();
}

export async function fetchProducts(category: string): Promise<Product[]> {
  const resp = await fetch(`data/products.json`);
  const all: Product[] = await resp.json();
  return all.filter(p => p.category === category);
}
