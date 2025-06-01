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

function getCategoryPositions(category: string): void {
  const filename = `./${category}.json`;
  const request = new XMLHttpRequest();

  request.open("GET", filename);
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      const data: CategoryData = JSON.parse(request.responseText);
      setPositions(data, category);
    }
  };
  request.send();
}

function setPositions(categoryData: CategoryData, categoryName: string): void {
  const container = document.getElementById("main");
  if (!container) return;

  container.innerHTML = '';
  categoryData.forEach((element) => {
    const divCatalog = document.createElement("div");
    divCatalog.classList.add("catalog");

    const bookDiv = document.createElement("div");
    bookDiv.classList.add("book");

    const img = document.createElement("img");
    img.src = `images/catalog/${categoryName}/${element.short_name}.jpg`;
    img.alt = "Item";

    const h2 = document.createElement("h2");
    h2.innerText = element.full_name;

    const h3 = document.createElement("h3");
    h3.innerText = element.author;

    const desc = document.createElement("p");
    desc.innerText = element.description;

    const price = document.createElement("p");
    price.innerText = `${element.price}₴`;

    const button = document.createElement("button");
    button.classList.add("buy-button");
    button.innerText = "Купити";

    bookDiv.append(img, h2, h3, desc, price, button);
    divCatalog.appendChild(bookDiv);
    container.appendChild(divCatalog);
  });
}

function setButtonEvents(): void {
  const loadHome = document.getElementById("navHomeButton");
  const loadCatalogButtons = document.querySelectorAll(".catalogButton");
  const randomCategoryBtn = document.getElementById("randomCategory");

  if (loadHome) {
    loadHome.addEventListener('click', () => {
      const container = document.getElementById("main");
      if (!container) return;

      container.innerHTML = `
        <div class="hero">
          <img src="images/main.jpg">
          <div class="overlay"></div>
          <div class="cta">
            <a href="#" class="button catalogButton" id="loadCatalogBtn">Перейти до каталогу</a>
            <a href="#" class="button catalogButton" id="randomCategory">Випадкова категорія</a>
          </div>
        </div>
      `;
      setButtonEvents(); // важливо!
    });
  }

  loadCatalogButtons.forEach(button => {
    button.addEventListener('click', () => {
      loadCategoryData();
    });
  });

  if (randomCategoryBtn) {
    randomCategoryBtn.addEventListener('click', () => {
      const categories: string[] = [];
      document.querySelectorAll<HTMLElement>(".category").forEach(link => {
        const id = link.getAttribute("id");
        if (id) categories.push(id);
      });

      if (categories.length === 0) return;

      let rand = Math.floor(Math.random() * categories.length);
      while (rand === prevRand) {
        rand = Math.floor(Math.random() * categories.length);
      }
      prevRand = rand;

      getCategoryPositions(categories[rand]);
    });
  }
}

function setCategoryClickEvents(): void {
  document.querySelectorAll<HTMLElement>('.category').forEach(link => {
    link.addEventListener('click', (event: Event) => {
      event.preventDefault();
      const category = link.getAttribute('id');
      if (category) getCategoryPositions(category);
    });
  });
}

function loadCategoryData(): void {
  const request = new XMLHttpRequest();
  request.open("GET", "../categories.json");
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      const data = JSON.parse(request.responseText) as { short_name: string; full_name: string }[];
      setCategoryData(data);
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
    div.setAttribute("id", element.short_name); // <--- обов’язково!

    const img = document.createElement("img");
    img.classList.add("bi");
    img.src = `images/catalog/${element.short_name}/${element.short_name}.jpg`;
    img.alt = element.full_name;

    const h2 = document.createElement("h2");
    h2.innerText = element.full_name;

    div.append(img, h2);
    divCatalog.appendChild(div);
    container.appendChild(divCatalog);
  });

  setCategoryClickEvents();
}

setButtonEvents();
