type CategoryItem = {
  id: string;
  full_name: string;
  short_name: string;
  author: string;
  description: string;
  price: number;
};


function setCategoryClickEvents(): void {
  document.querySelectorAll<HTMLElement>('.category').forEach(link => {
    link.addEventListener('click', (event: Event) => {
      event.preventDefault();
      const categoryShortName = link.getAttribute('id');
      if (!categoryShortName) return;

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

            const category = categories.find(
              (cat: any) => cat.short_name === categoryShortName
            );

            if (category) {
              getCategoryPositions(category.url, category.short_name);
            } else {
              console.error("Категорія не знайдена:", categoryShortName);
            }
          } catch (err) {
            console.error("Помилка парсингу categories.json:", err);
          }
        } else if (request.readyState === XMLHttpRequest.DONE) {
          console.error("Помилка завантаження categories.json. Статус:", request.status);
        }
      };

      request.send();
    });
  });
}

// Додана відсутня функція getCategoryPositions
function getCategoryPositions(url: string, categoryShortName: string): void {
  console.log("Завантажуємо товари з URL:", url);
  
  const request = new XMLHttpRequest();
  request.open("GET", url);
  
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      if (request.status === 200) {
        try {
          console.log("Отримані дані:", request.responseText);
          const data = JSON.parse(request.responseText);
          
          let products: any[] = [];
          
          // Перевіряємо різні можливі структури даних
          if (Array.isArray(data)) {
            // Якщо дані вже є масивом
            products = data;
          } else if (data && typeof data === 'object') {
            // Якщо це об'єкт, шукаємо масив товарів
            if (Array.isArray(data.catalog_items)) {
              products = data.catalog_items;
            } else if (Array.isArray(data.items)) {
              products = data.items;
            } else if (Array.isArray(data.products)) {
              products = data.products;
            } else {
              // Шукаємо будь-який масив у об'єкті
              const possibleArrays = Object(data).filter(Array.isArray);
              if (possibleArrays.length > 0) {
                products = possibleArrays[0] as any[];
              }
            }
          }
          
          if (products.length === 0) {
            console.error("Не вдалося знайти масив товарів у даних:", data);
            displayNoProducts(categoryShortName);
            return;
          }
          
          console.log("Знайдено товарів:", products.length);
          displayCategoryProducts(products, categoryShortName);
        } catch (err) {
          console.error("Помилка парсингу даних товарів:", err);
          console.error("Текст відповіді:", request.responseText);
          displayNoProducts(categoryShortName);
        }
      } else {
        console.error(`Помилка завантаження товарів з ${url}. Статус: ${request.status}`);
        if (request.status === 404) {
          console.error("Файл не знайдено. Перевірте чи існує файл:", url);
        }
        displayNoProducts(categoryShortName);
      }
    }
  };
  
  request.send();
}

// Додана функція для відображення повідомлення про відсутність товарів
function displayNoProducts(categoryShortName: string): void {
  const container = document.getElementById("main");
  if (!container) return;

  container.innerHTML = '';

  const categoryHeader = document.createElement("h1");
  categoryHeader.textContent = `Категорія: ${categoryShortName}`;
  container.appendChild(categoryHeader);

  const backButton = document.createElement("button");
  backButton.textContent = "Назад до категорій";
  backButton.classList.add("back-button");
  backButton.addEventListener('click', () => {
    loadCategoryData();
  });
  container.appendChild(backButton);

  const message = document.createElement("p");
  message.textContent = "Товари для цієї категорії не знайдені або файл не існує.";
  message.style.textAlign = "center";
  message.style.margin = "20px";
  message.style.fontSize = "18px";
  container.appendChild(message);
}

// Додана функція для відображення товарів категорії
function displayCategoryProducts(products: any[], categoryShortName: string): void {
  const container = document.getElementById("main");
  if (!container) return;

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
  products.forEach((product: any) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product");

    // Додаємо зображення товару (якщо є)
    if (product.image) {
      const img = document.createElement("img");
      img.src = product.image;
      img.alt = product.full_name || product.name || "Товар";
      img.classList.add("product-image");
      productDiv.appendChild(img);
    }

    // Додаємо назву товару (підтримуємо різні поля)
    const productName = product.full_name || product.name || product.title;
    if (productName) {
      const name = document.createElement("h3");
      name.textContent = productName;
      productDiv.appendChild(name);
    }

    // Додаємо автора (якщо є)
    if (product.author) {
      const author = document.createElement("p");
      author.textContent = `Автор: ${product.author}`;
      author.classList.add("product-author");
      productDiv.appendChild(author);
    }

    // Додаємо ціну товару (якщо є)
    if (product.price) {
      const price = document.createElement("p");
      price.textContent = `Ціна: ${product.price} грн`;
      price.classList.add("product-price");
      price.style.fontWeight = "bold";
      price.style.color = "#007bff";
      productDiv.appendChild(price);
    }

    // Додаємо опис товару (якщо є)
    if (product.description) {
      const description = document.createElement("p");
      description.textContent = product.description;
      description.classList.add("product-description");
      // Обмежуємо довжину опису для кращого вигляду
      if (product.description.length > 200) {
        description.textContent = product.description.substring(0, 200) + "...";
      }
      productDiv.appendChild(description);
    }

    // Додаємо ID товару (для розробки)
    if (product.id) {
      const id = document.createElement("small");
      id.textContent = `ID: ${product.id}`;
      id.style.color = "#666";
      productDiv.appendChild(id);
    }

    // Стилізуємо картку товару
    productDiv.style.border = "1px solid #ddd";
    productDiv.style.borderRadius = "8px";
    productDiv.style.padding = "15px";
    productDiv.style.margin = "10px";
    productDiv.style.backgroundColor = "#f9f9f9";

    productsContainer.appendChild(productDiv);
  });

  container.appendChild(productsContainer);
}

function loadCategoryData(): void {
  const request = new XMLHttpRequest();
  request.open("GET", "./categories.json");
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      try {
        const data = JSON.parse(request.responseText) as { short_name: string; full_name: string }[];
        
        // Перевіряємо чи data є масивом
        if (!Array.isArray(data)) {
          console.error("categories.json повинен містити масив");
          return;
        }
        
        setCategoryData(data);
      } catch (err) {
        console.error("Помилка парсингу categories.json:", err);
      }
    } else if (request.readyState === XMLHttpRequest.DONE) {
      console.error("Помилка завантаження categories.json. Статус:", request.status);
    }
  };
  request.send();
}

function setCategoryData(dataSet: { short_name: string; full_name: string }[]): void {
  const container = document.getElementById("main");
  if (!container) return;

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