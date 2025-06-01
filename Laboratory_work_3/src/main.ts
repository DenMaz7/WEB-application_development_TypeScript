type CategoryItem = {
  id: string;
  name: string;
  description: string;
  price: number;
};

type CategoryData = CategoryItem[];

let prevRand: number | null = null;

// === 1. Рендер головної сторінки ===
function renderHome(): void {
  const main: HTMLElement | null = document.getElementById("main");
  if (!main) return;

  main.innerHTML = "";

  const wrapper: HTMLDivElement = document.createElement("div");
  wrapper.style.position = "relative";

  const img: HTMLImageElement = document.createElement("img");
  img.src = "./build/images/main.jpg";
  img.style.width = "100%";
  img.style.height = "auto";
  wrapper.appendChild(img);

  const buttonContainer: HTMLDivElement = document.createElement("div");
  buttonContainer.id = "greeting";
  buttonContainer.style.position = "absolute";
  buttonContainer.style.top = "50%";
  buttonContainer.style.left = "50%";
  buttonContainer.style.transform = "translate(-50%, -50%)";
  buttonContainer.style.display = "flex";
  buttonContainer.style.gap = "20px";

  const catalogBtn = document.createElement("button");
  catalogBtn.textContent = "Перейти до каталогу";
  catalogBtn.onclick = () => renderCatalog();

  const randomBtn = document.createElement("button");
  randomBtn.textContent = "Випадкова категорія";
  randomBtn.onclick = () => triggerRandomCategory();

  buttonContainer.appendChild(catalogBtn);
  buttonContainer.appendChild(randomBtn);
  wrapper.appendChild(buttonContainer);

  main.appendChild(wrapper);
}

// === 2. Завантаження списку категорій і рендер каталогу ===
function renderCatalog(): void {
  const request = new XMLHttpRequest();
  request.open("GET", "../categories.json");
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      const data: { name: string }[] = JSON.parse(request.responseText);
      setCategoryData(data);
    }
  };
  request.send();
}

function setCategoryData(dataSet: { name: string }[]): void {
  const main: HTMLElement | null = document.getElementById("main");
  if (!main) return;

  main.innerHTML = "";

  const container: HTMLDivElement = document.createElement("div");
  container.id = "Categories";

  dataSet.forEach((element) => {
    const a: HTMLAnchorElement = document.createElement("a");
    a.classList.add("category-link");
    a.innerText = element.name;
    a.id = element.name;

    const img: HTMLImageElement = document.createElement("img");
    img.src = `./images/${element.name}/category.jpg`;
    img.alt = element.name;

    a.appendChild(img);
    a.onclick = (event: MouseEvent) => {
      event.preventDefault();
      getCategoryPositions(element.name);
    };

    container.appendChild(a);
  });

  main.appendChild(container);
}

// === 3. Завантаження конкретної категорії ===
function getCategoryPositions(category: string): void {
  const filename = `./${category}.json`;
  const request = new XMLHttpRequest();

  request.open("GET", filename);
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      const rjson: CategoryData = JSON.parse(request.responseText);
      setPositions(rjson, category);
    }
  };
  request.send();
}

function setPositions(categoryData: CategoryData, categoryName: string): void {
  const main: HTMLElement | null = document.getElementById("main");
  if (!main) return;

  main.innerHTML = "";

  const container: HTMLDivElement = document.createElement("div");
  container.id = "catalog-container";

  categoryData.forEach((element: CategoryItem) => {
    const div: HTMLDivElement = document.createElement("div");
    const img: HTMLImageElement = document.createElement("img");
    const h1: HTMLHeadingElement = document.createElement("h1");
    const text: HTMLParagraphElement = document.createElement("p");
    const price: HTMLSpanElement = document.createElement("span");

    h1.innerHTML = element.name;
    text.innerHTML = element.description;
    price.innerHTML = `Price: ${element.price}`;
    img.src = `./images/${categoryName}/${element.id}.jpg`;

    div.appendChild(h1);
    div.appendChild(img);
    div.appendChild(text);
    div.appendChild(price);
    container.appendChild(div);
  });

  main.appendChild(container);
}

// === 4. Випадкова категорія ===
function triggerRandomCategory(): void {
  const request = new XMLHttpRequest();
  request.open("GET", "../categories.json");
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      const data: { name: string }[] = JSON.parse(request.responseText);
      const categories = data.map(d => d.name);

      if (categories.length === 0) return;

      let rand = Math.floor(Math.random() * categories.length);
      while (rand === prevRand) {
        rand = Math.floor(Math.random() * categories.length);
      }
      prevRand = rand;

      getCategoryPositions(categories[rand]);
    }
  };
  request.send();
}

// === 5. Навігація ===
function setupNavigation(): void {
  const homeLink = document.getElementById("home-link");
  const catalogLink = document.getElementById("catalog-link");

  if (homeLink) {
    homeLink.addEventListener("click", (e) => {
      e.preventDefault();
      renderHome();
    });
  }

  if (catalogLink) {
    catalogLink.addEventListener("click", (e) => {
      e.preventDefault();
      renderCatalog();
    });
  }
}

// === 6. Ініціалізація ===
window.onload = () => {
  renderHome();
  setupNavigation();
};
