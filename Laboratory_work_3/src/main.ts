type CategoryItem = {
    id: string;
    name: string;
    description: string;
    price: number;
  };
  
  type CategoryData = CategoryItem[];
  
  function getCategoryPositions(category: string): void {
    const filename: string = `./json/${category}.json`;
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
  
  getCategoryPositions("cakes");
  
  function setPositions(categoryData: CategoryData, categoryName: string): void {
    const container: HTMLElement | null = document.getElementById("catalog-container");
    if (!container) return;
  
    container.innerHTML = '';
    categoryData.forEach((element: CategoryItem) => {
      const div: HTMLDivElement = document.createElement("div");
      const img: HTMLImageElement = document.createElement("img");
      const h1: HTMLHeadingElement = document.createElement("h1");
      const text: HTMLParagraphElement = document.createElement("p");
      const price: HTMLSpanElement = document.createElement("span");
  
      text.innerHTML = element.description;
      h1.innerHTML = element.name;
      price.innerHTML = `Price: ${element.price}`;
      const url: string = `./images/${categoryName}/${element.id}.jpg`;
      img.setAttribute("src", url);
  
      div.appendChild(h1);
      div.appendChild(img);
      div.appendChild(text);
      div.appendChild(price);
      container.appendChild(div);
    });
  }
  
  let prevRand: number | null = null;
  
  function setButtonEvents(): void {
    const specialsLink = document.getElementById("specials-link");
    if (!specialsLink) return;
  
    specialsLink.addEventListener('click', function(event: Event) {
      event.preventDefault();
      
      const categories: string[] = [];
      document.querySelectorAll<HTMLElement>(".category-link").forEach(link => {
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
  
    document.querySelectorAll<HTMLElement>('.category-link').forEach(link => {
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
        const rjson: { name: string }[] = JSON.parse(rtext);
        setCategoryData(rjson);
        setButtonEvents();
      }
    };
    request.send();
  }
  
  function setCategoryData(dataSet: { name: string }[]): void {
    const container: HTMLElement | null = document.getElementById("Categories");
    if (!container) return;
  
    dataSet.forEach((element) => {
      const a: HTMLAnchorElement = document.createElement("a");
      a.classList.add("category-link");
      a.innerText = element.name;
      a.id = element.name;
  
      const img: HTMLImageElement = document.createElement("img");
      const src: string = `./images/${element.name}/category.jpg`;
      img.setAttribute("src", src);
  
      a.appendChild(img);
      container.appendChild(a);
    });
  }
  
  loadCategoryData();
  