"use strict";
function setCategoryClickEvents() {
    document.querySelectorAll('.category').forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const categoryShortName = link.getAttribute('id');
            if (!categoryShortName)
                return;
            const request = new XMLHttpRequest();
            request.open("GET", "./categories.json");
            request.onreadystatechange = () => {
                if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
                    try {
                        const categories = JSON.parse(request.responseText);
                        // Перевіряємо чи categories є масивом
                        if (!Array.isArray(categories)) {
                            console.error("categories.json повинен містити масив");
                            return;
                        }
                        const category = categories.find((cat) => cat.short_name === categoryShortName);
                        if (category) {
                            getCategoryPositions(category.url, category.short_name);
                        }
                        else {
                            console.error("Категорія не знайдена:", categoryShortName);
                        }
                    }
                    catch (err) {
                        console.error("Помилка парсингу categories.json:", err);
                    }
                }
                else if (request.readyState === XMLHttpRequest.DONE) {
                    console.error("Помилка завантаження categories.json. Статус:", request.status);
                }
            };
            request.send();
        });
    });
}
// Додана відсутня функція getCategoryPositions
function getCategoryPositions(url, categoryShortName) {
    console.log("Завантажуємо товари з URL:", url);
    const request = new XMLHttpRequest();
    request.open("GET", url);
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
            if (request.status === 200) {
                try {
                    console.log("Отримані дані:", request.responseText);
                    const products = JSON.parse(request.responseText);
                    // Перевіряємо чи products є масивом
                    if (!Array.isArray(products)) {
                        console.error("Дані товарів повинні бути масивом. Отримано:", typeof products, products);
                        // Якщо це об'єкт з масивом всередині, спробуємо його витягнути
                        if (typeof products === 'object' && products !== null) {
                            const possibleArrays = Object(products).filter(Array.isArray);
                            if (possibleArrays.length > 0) {
                                console.log("Знайдено масив у об'єкті, використовуємо його");
                                displayCategoryProducts(possibleArrays[0], categoryShortName);
                                return;
                            }
                        }
                        return;
                    }
                    displayCategoryProducts(products, categoryShortName);
                }
                catch (err) {
                    console.error("Помилка парсингу даних товарів:", err);
                    console.error("Текст відповіді:", request.responseText);
                }
            }
            else {
                console.error(`Помилка завантаження товарів з ${url}. Статус: ${request.status}`);
                if (request.status === 404) {
                    console.error("Файл не знайдено. Перевірте чи існує файл:", url);
                }
            }
        }
    };
    request.send();
}
// Додана функція для відображення товарів категорії
function displayCategoryProducts(products, categoryShortName) {
    const container = document.getElementById("main");
    if (!container)
        return;
    // Очищаємо контейнер
    container.innerHTML = '';
    // Створюємо заголовок категорії
    const categoryHeader = document.createElement("h1");
    categoryHeader.textContent = `Товари категорії: ${categoryShortName}`;
    container.appendChild(categoryHeader);
    // Створюємо кнопку "Назад до категорій"
    const backButton = document.createElement("button");
    backButton.textContent = "Назад до категорій";
    backButton.classList.add("back-button");
    backButton.addEventListener('click', () => {
        loadCategoryData(); // Повертаємось до списку категорій
    });
    container.appendChild(backButton);
    // Створюємо контейнер для товарів
    const productsContainer = document.createElement("div");
    productsContainer.classList.add("products-container");
    // Відображаємо товари
    products.forEach((product) => {
        const productDiv = document.createElement("div");
        productDiv.classList.add("product");
        // Додаємо зображення товару (якщо є)
        if (product.image) {
            const img = document.createElement("img");
            img.src = product.image;
            img.alt = product.name || "Товар";
            img.classList.add("product-image");
            productDiv.appendChild(img);
        }
        // Додаємо назву товару
        if (product.name) {
            const name = document.createElement("h3");
            name.textContent = product.name;
            productDiv.appendChild(name);
        }
        // Додаємо ціну товару (якщо є)
        if (product.price) {
            const price = document.createElement("p");
            price.textContent = `Ціна: ${product.price}`;
            price.classList.add("product-price");
            productDiv.appendChild(price);
        }
        // Додаємо опис товару (якщо є)
        if (product.description) {
            const description = document.createElement("p");
            description.textContent = product.description;
            description.classList.add("product-description");
            productDiv.appendChild(description);
        }
        productsContainer.appendChild(productDiv);
    });
    container.appendChild(productsContainer);
}
function loadCategoryData() {
    const request = new XMLHttpRequest();
    request.open("GET", "./categories.json");
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
            try {
                const data = JSON.parse(request.responseText);
                // Перевіряємо чи data є масивом
                if (!Array.isArray(data)) {
                    console.error("categories.json повинен містити масив");
                    return;
                }
                setCategoryData(data);
            }
            catch (err) {
                console.error("Помилка парсингу categories.json:", err);
            }
        }
        else if (request.readyState === XMLHttpRequest.DONE) {
            console.error("Помилка завантаження categories.json. Статус:", request.status);
        }
    };
    request.send();
}
function setCategoryData(dataSet) {
    const container = document.getElementById("main");
    if (!container)
        return;
    container.innerHTML = '';
    dataSet.forEach((element) => {
        const divCatalog = document.createElement("div");
        divCatalog.classList.add("catalog");
        const div = document.createElement("div");
        div.classList.add("category");
        div.setAttribute("id", element.short_name);
        const img = document.createElement("img");
        img.classList.add("bi");
        img.src = `images/${element.short_name}/${element.short_name}.jpg`;
        img.alt = element.full_name;
        const h2 = document.createElement("h2");
        h2.innerText = element.full_name;
        div.append(img, h2);
        divCatalog.appendChild(div);
        container.appendChild(divCatalog);
    });
    // Встановлюємо обробники подій після створення елементів
    setCategoryClickEvents();
}
// Ініціалізація
loadCategoryData();
// setButtonEvents(); // Розкоментуйте якщо ця функція існує
