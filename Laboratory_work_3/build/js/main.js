var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { fetchCategories } from './dataLoader';
function renderCategories() {
    return __awaiter(this, void 0, void 0, function* () {
        const categories = yield fetchCategories();
        const listContainer = document.getElementById('categoryList');
        if (!listContainer)
            return;
        listContainer.innerHTML = '';
        categories.forEach((cat) => {
            const a = document.createElement('a');
            a.textContent = cat.name;
            a.href = `category.html?id=${cat.id}`;
            // замість inline onclick - додаємо слухача події
            a.addEventListener('click', (e) => {
                // це простий перехід за посиланням, можна обробити SPA-навігацію
            });
            listContainer.appendChild(a);
        });
    });
}
window.addEventListener('DOMContentLoaded', () => {
    renderCategories();
});
