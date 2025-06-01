type CategoryItem = {
    id: string;
    full_name: string;
    short_name: string;
    author: string;
    description: string;
    price: number;
};

type CategoryData = CategoryItem[];
  
function getCategoryPositions(category: string): void {
  const filename: string = `./${category}.json`;
  const request: XMLHttpRequest = new XMLHttpRequest();
  
  request.open("GET", filename);
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      const rtext: string = request.responseText;
      const rjson: CategoryData = JSON.parse(rtext);
      setPositions(rjson, category);
    }
  };
  request.send();
}

function setPositions(categoryData: CategoryData, categoryName: string): void {
  const container: HTMLElement | null = document.getElementById("main");
  if (!container) return;

  container.innerHTML = '';
  categoryData.forEach((element: CategoryItem) => {
    const divCatalog: HTMLDivElement = document.createElement("div");
    divCatalog.classList.add("catalog");

    const bookDiv: HTMLDivElement = document.createElement("div");
    bookDiv.classList.add("book");

    const img: HTMLImageElement = document.createElement("img");
    img.src = `images/catalog/${categoryName}/${element.short_name}.jpg`;
    img.alt = "Item";

    const h2: HTMLHeadingElement = document.createElement("h2");
    h2.innerText = element.full_name;

    const h3: HTMLHeadingElement = document.createElement("h3");
    h3.innerText = element.author;

    const desc: HTMLParagraphElement = document.createElement("p");
    desc.innerText = element.description;

    const price: HTMLParagraphElement = document.createElement("p");
    price.innerText = `${element.price}₴`;

    const button: HTMLButtonElement = document.createElement("button");
    button.classList.add("buy-button");
    button.innerText = "Купити";

    bookDiv.appendChild(img);
    bookDiv.appendChild(h2);
    bookDiv.appendChild(h3);
    bookDiv.appendChild(desc);
    bookDiv.appendChild(price);
    bookDiv.appendChild(button);
    divCatalog.appendChild(bookDiv);
    container.appendChild(divCatalog);
  });
}
  
let prevRand: number | null = null;
  
function setButtonEvents(): void {
  const loadHome = document.getElementById("navHomeButton");
  const loadCatalog = document.getElementById("navCatalogButton");
  const randomCategory = document.getElementById("randomCategory");

  if (loadHome) {
    loadHome.addEventListener('click', () => {
      const container: HTMLElement | null = document.getElementById("main");
      if (!container) return;

      container.innerHTML = `
        <div class="hero">
          <img src="images/main.jpg">
          <div class="overlay"></div>
          <div class="cta">
            <a href="#" class="button" id="loadCatalogBtn">Перейти до каталогу</a>
            <a href="#" class="button" id="randomCategory">Випадкова категорія</a>
          </div>
        </div>
      `;

      setButtonEvents();
    });
  }

  if (loadCatalog) {
    loadCatalog.addEventListener('click', () => {
      loadCategoryData();
    });
  }

  if (randomCategory) {
    randomCategory.addEventListener('click', () => {
      const categories: string[] = [];
      document.querySelectorAll<HTMLElement>(".category").forEach(link => {
        const id = link.getAttribute("id");
        if (id) categories.push(id);
      });

      if (categories.length === 0) return;

      let rand: number = Math.floor(Math.random() * categories.length);
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
    link.addEventListener('click', function(event: Event) {
      event.preventDefault();
      const category = this.getAttribute('id');
      if (category) getCategoryPositions(category);
    });
  });
}

  
function loadCategoryData(): void {
  const request: XMLHttpRequest = new XMLHttpRequest();
  request.open("GET", "../categories.json");
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE) {
      const rtext: string = request.responseText;
      const rjson: { short_name: string; full_name: string }[] = JSON.parse(rtext);
      setCategoryData(rjson);
    }
  };
  request.send();
}

  
function setCategoryData(dataSet: { short_name: string; full_name: string }[]): void {
  const container: HTMLElement | null = document.getElementById("main");
  if (!container) return;

  container.innerHTML = '';
  dataSet.forEach((element) => {
    const divCatalog: HTMLDivElement = document.createElement("div");
    divCatalog.classList.add("catalog");

    const div: HTMLDivElement = document.createElement("div");
    div.classList.add("category");

    const img: HTMLImageElement = document.createElement("img");
    img.classList.add("bi");
    img.src = `images/catalog/${element.short_name}/${element.short_name}.jpg`;
    img.alt = element.full_name;

    const h2: HTMLHeadingElement = document.createElement("h2");
    h2.innerText = element.full_name;

    div.appendChild(img);
    div.appendChild(h2);
    divCatalog.appendChild(div);
    container.appendChild(divCatalog);
  });

  setCategoryClickEvents();
}


setButtonEvents();

  