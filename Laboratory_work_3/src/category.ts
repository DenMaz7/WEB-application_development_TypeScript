// src/category.ts
import { fetchProducts } from './dataLoader';
import { Product } from './models';

function getCategoryIdFromUrl(): string | null {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

async function renderProducts() {
  const categoryId = getCategoryIdFromUrl();
  if (!categoryId) return;
  const products = await fetchProducts(categoryId);

  const container = document.getElementById('productList');
  if (!container) return;
  container.innerHTML = '';

  products.forEach((prod: Product) => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <h3>${prod.title}</h3>
      <img src="images/${prod.image}" alt="${prod.title}">
      <p>${prod.price} UAH</p>`;
    container.appendChild(div);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderProducts();
});
