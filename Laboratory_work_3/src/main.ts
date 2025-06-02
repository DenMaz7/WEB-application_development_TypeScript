type CategoryItem = {
  id: string;
  full_name: string;
  short_name: string;
  author: string;
  description: string;
  price: number;
};

type CategoryData = CategoryItem[];

let prevRand: number | null = null;

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
  const request = new XMLHttpRequest();
  request.open("GET", url);
  
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      try {
        const products = JSON.parse(request.responseText);
        
        // Перевіряємо чи products є масивом
        if (!Array.isArray(products)) {
          console.error("Дані товарів повинні бути масивом");
          return;
        }
        
        displayCategoryProducts(products, categoryShortName);
      } catch (err) {
        console.error("Помилка парсингу даних товарів:", err);
      }
    } else if (request.readyState === XMLHttpRequest.DONE) {
      console.error("Помилка завантаження товарів. Статус:", request.status);
    }
  };
  
  request.send();
}

// Додана функція для відображення товарів категорії
function displayCategoryProducts(products: any[], categoryShortName: string): void {
  const container = document.getElementById("main");
  if (!container) return;

  // Очищаємо контейнер
  container.innerHTML = '';

  // Створюємо заголовок категорії
  const categoryHeader = document.createElement("h1");
  categoryHeader.textContent = categoryShortName;
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


















// function getCategoryPositions(categoryUrl: string, categoryName: string): void {
//   const request = new XMLHttpRequest();

//   request.open("GET", categoryUrl);
//   request.onreadystatechange = () => {
//     if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
//       try {
//         const data = JSON.parse(request.responseText);
//         if (Array.isArray(data)) {
//           setPositions(data, categoryName);
//         } else {
//           console.error("Очікувався масив, отримано:", data);
//         }
//       } catch (e) {
//         console.error("Помилка парсингу JSON:", e);
//       }
//     }
//   };
//   request.send();
// }


// function setPositions(categoryData: CategoryData, categoryName: string): void {
//   const container = document.getElementById("main");
//   if (!container) return;

//   container.innerHTML = '';
//   categoryData.forEach((element) => {
//     const divCatalog = document.createElement("div");
//     divCatalog.classList.add("catalog");

//     const bookDiv = document.createElement("div");
//     bookDiv.classList.add("book");

//     const img = document.createElement("img");
//     img.src = `images/${categoryName}/${element.short_name}.jpg`;
//     img.alt = "Item";

//     const h2 = document.createElement("h2");
//     h2.innerText = element.full_name;

//     const h3 = document.createElement("h3");
//     h3.innerText = element.author;

//     const desc = document.createElement("p");
//     desc.innerText = element.description;

//     const price = document.createElement("p");
//     price.innerText = `${element.price}₴`;

//     const button = document.createElement("button");
//     button.classList.add("buy-button");
//     button.innerText = "Купити";

//     bookDiv.append(img, h2, h3, desc, price, button);
//     divCatalog.appendChild(bookDiv);
//     container.appendChild(divCatalog);
//   });
// }

// function setButtonEvents(): void {
//   const loadHome = document.getElementById("navHomeButton");
//   const loadCatalogButtons = document.querySelectorAll(".catalogButton");
//   const randomCategoryBtn = document.getElementById("randomCategory");

//   if (loadHome) {
//     loadHome.addEventListener('click', () => {
//       const container = document.getElementById("main");
//       if (!container) return;

//       container.innerHTML = `
//         <div class="hero">
//           <img src="images/main.jpg">
//           <div class="overlay"></div>
//           <div class="cta">
//             <a href="#" class="button catalogButton" id="loadCatalogBtn">Перейти до каталогу</a>
//             <a href="#" class="button catalogButton" id="randomCategory">Випадкова категорія</a>
//           </div>
//         </div>
//       `;
//       setButtonEvents(); 
//     });
//   }

//   loadCatalogButtons.forEach(button => {
//     button.addEventListener('click', () => {
//       loadCategoryData();
//     });
//   });

//   if (randomCategoryBtn) {
// randomCategoryBtn.addEventListener('click', () => {
//   const request = new XMLHttpRequest();
//   request.open("GET", "./categories.json");

//   request.onreadystatechange = () => {
//     if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
//       try {
//         const categories = JSON.parse(request.responseText);

//         if (!Array.isArray(categories) || categories.length === 0) {
//           console.error("Немає категорій або неправильний формат");
//           return;
//         }

//         let rand = Math.floor(Math.random() * categories.length);
//         while (rand === prevRand && categories.length > 1) {
//           rand = Math.floor(Math.random() * categories.length);
//         }
//         prevRand = rand;

//         const selected = categories[rand];
//         getCategoryPositions(selected.url, selected.short_name);
//       } catch (e) {
//         console.error("Помилка парсингу categories.json:", e);
//       }
//     } else if (request.readyState === XMLHttpRequest.DONE) {
//       console.error("Помилка завантаження categories.json");
//     }
//   };

//   request.send();
//     });
//   }
// }

// function setCategoryClickEvents(): void {
//   document.querySelectorAll<HTMLElement>('.category').forEach(link => {
//     link.addEventListener('click', (event: Event) => {
//       event.preventDefault();
//       const categoryShortName = link.getAttribute('id');
//       if (!categoryShortName) return;

//       const request = new XMLHttpRequest();
//       request.open("GET", "./categories.json");

//       request.onreadystatechange = () => {
//         if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
//           try {
//             const categories = JSON.parse(request.responseText);
//             const category = categories.find(
//               (cat: any) => cat.short_name === categoryShortName
//             );

//             if (category) {
//               getCategoryPositions(category.url, category.short_name);
//             } else {
//               console.error("Категорія не знайдена:", categoryShortName);
//             }
//           } catch (err) {
//             console.error("Помилка парсингу categories.json:", err);
//           }
//         }
//       };

//       request.send();
//     });
//   });
// }


// function loadCategoryData(): void {
//   const request = new XMLHttpRequest();
//   request.open("GET", "./categories.json");
//   request.onreadystatechange = () => {
//     if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
//       const data = JSON.parse(request.responseText) as { short_name: string; full_name: string }[];
//       setCategoryData(data);
//     }
//   };
//   request.send();
// }

// function setCategoryData(dataSet: { short_name: string; full_name: string }[]): void {
//   const container = document.getElementById("main");
//   if (!container) return;

//   container.innerHTML = '';
//   dataSet.forEach((element) => {
//     const divCatalog = document.createElement("div");
//     divCatalog.classList.add("catalog");

//     const div = document.createElement("div");
//     div.classList.add("category");
//     div.setAttribute("id", element.short_name); // <--- обов’язково!

//     const img = document.createElement("img");
//     img.classList.add("bi");
//     img.src = `images/${element.short_name}/${element.short_name}.jpg`;
//     img.alt = element.full_name;

//     const h2 = document.createElement("h2");
//     h2.innerText = element.full_name;

//     div.append(img, h2);
//     divCatalog.appendChild(div);
//     container.appendChild(divCatalog);
//   });

//   setCategoryClickEvents();
// }

// setButtonEvents();
