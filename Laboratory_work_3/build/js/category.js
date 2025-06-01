var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// src/category.ts
import { fetchProducts } from './dataLoader';
function getCategoryIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}
function renderProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        const categoryId = getCategoryIdFromUrl();
        if (!categoryId)
            return;
        const products = yield fetchProducts(categoryId);
        const container = document.getElementById('productList');
        if (!container)
            return;
        container.innerHTML = '';
        products.forEach((prod) => {
            const div = document.createElement('div');
            div.className = 'product';
            div.innerHTML = `
      <h3>${prod.title}</h3>
      <img src="images/${prod.image}" alt="${prod.title}">
      <p>${prod.price} UAH</p>`;
            container.appendChild(div);
        });
    });
}
window.addEventListener('DOMContentLoaded', () => {
    renderProducts();
});
