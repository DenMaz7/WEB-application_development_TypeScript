import { fetchCategories } from './dataLoader';
import { Category } from './models';

async function renderCategories() {
  const categories = await fetchCategories();
  const listContainer = document.getElementById('categoryList');
  if (!listContainer) return;
  listContainer.innerHTML = '';

  categories.forEach((cat: Category) => {
    const a = document.createElement('a');
    a.textContent = cat.name;
    a.href = `category.html?id=${cat.id}`;
    // замість inline onclick - додаємо слухача події
    a.addEventListener('click', (e) => {
      // це простий перехід за посиланням, можна обробити SPA-навігацію
    });
    listContainer.appendChild(a);
  });
}

window.addEventListener('DOMContentLoaded', () => {
  renderCategories();
});
