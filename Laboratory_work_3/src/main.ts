type Category = {
  short_name: string;
  full_name: string;
};

type CatalogItem = {
  short_name: string;
  full_name: string;
  author: string;
  description: string;
  price: number;
};

type CatalogData = {
  category: Category;
  catalog_items: CatalogItem[];
};

// ------------------ HTML helpers ------------------

function insertHtml(selector: string, html: string): void {
  const targetElem = document.querySelector(selector);
  if (targetElem) {
    targetElem.innerHTML = html;
  }
}

function showLoading(selector: string): void {
  const html = "<div class='text-center'><img src='images/ajax-loader.gif'></div>";
  insertHtml(selector, html);
}

function insertProperty(template: string, propName: string, propValue: string): string {
  const propToReplace = `{{${propName}}}`;
  return template.replace(new RegExp(propToReplace, "g"), propValue);
}

function switchActive(activeElement: "home" | "catalog"): void {
  const homeButton = document.querySelector("#navHomeButton");
  const catalogButton = document.querySelector("#navCatalogButton");

  if (!homeButton || !catalogButton) return;

  if (activeElement === "catalog") {
    homeButton.classList.remove("active");
    catalogButton.classList.add("active");
  } else {
    catalogButton.classList.remove("active");
    homeButton.classList.add("active");
  }
}

// ------------------ AJAX helper ------------------

function sendGetRequest(
  url: string,
  callback: (response: any) => void,
  isJsonResponse: boolean = true
): void {
  const request = new XMLHttpRequest();
  request.onreadystatechange = () => {
    if (request.readyState === XMLHttpRequest.DONE && request.status === 200) {
      const response = isJsonResponse ? JSON.parse(request.responseText) : request.responseText;
      callback(response);
    }
  };
  request.open("GET", url, true);
  request.send(null);
}

// ------------------ Constants ------------------

const homeHtml = "snippets/home-snippets.html";
const allCategoriesUrl = "data/categories.json";
const categoryHtml = "snippets/category-snippets.html";
const catalogItemsUrl = "data/catalog/";
const catalogItemsTitleHtml = "snippets/catalog-items-title.html";
const catalogItemHtml = "snippets/catalog-item.html";

// ------------------ Loaders ------------------

function loadHomeHtml(): void {
  sendGetRequest(homeHtml, (response: string) => {
    switchActive("home");
    insertHtml("#main", response);
  }, false);
}

function loadCatalogCategories(): void {
  showLoading("#main");
  sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
}

function loadCatalogItems(categoryShort: string): void {
  showLoading("#main");
  sendGetRequest(catalogItemsUrl + categoryShort + ".json", buildAndShowCatalogItemsHTML);
}

function loadRandomCategory(): void {
  showLoading("#main");
  sendGetRequest(allCategoriesUrl, (categories: Category[]) => {
    const randomIndex = Math.floor(Math.random() * categories.length);
    const randomCategory = categories[randomIndex];
    loadCatalogItems(randomCategory.short_name);
  });
}

// ------------------ View Builders ------------------

function buildAndShowCategoriesHTML(categories: Category[]): void {
  sendGetRequest(categoryHtml, (template: string) => {
    switchActive("catalog");
    const viewHtml = buildCategoriesViewHtml(categories, template);
    insertHtml("#main", viewHtml);
  }, false);
}

function buildCategoriesViewHtml(categories: Category[], template: string): string {
  let finalHtml = "<div class='catalog'>";
  for (const cat of categories) {
    let html = template;
    html = insertProperty(html, "full_name", cat.full_name);
    html = insertProperty(html, "short_name", cat.short_name);
    finalHtml += html;
  }
  finalHtml += "</div>";
  return finalHtml;
}

function buildAndShowCatalogItemsHTML(data: CatalogData): void {
  sendGetRequest(catalogItemsTitleHtml, (titleHtml: string) => {
    sendGetRequest(catalogItemHtml, (itemHtml: string) => {
      switchActive("catalog");
      const viewHtml = buildCatalogItemsViewHtml(data, titleHtml, itemHtml);
      insertHtml("#main", viewHtml);
    }, false);
  }, false);
}

function buildCatalogItemsViewHtml(
  data: CatalogData,
  titleHtml: string,
  itemHtml: string
): string {
  titleHtml = insertProperty(titleHtml, "full_name", data.category.full_name);
  let finalHtml = titleHtml + "<div class='catalog'>";

  for (const item of data.catalog_items) {
    let html = itemHtml;
    html = insertProperty(html, "catShortName", data.category.short_name);
    html = insertProperty(html, "short_name", item.short_name);
    html = insertProperty(html, "full_name", item.full_name);
    html = insertProperty(html, "author", item.author);
    html = insertProperty(html, "description", item.description);
    html = insertProperty(html, "price", item.price.toString());
    finalHtml += html;
  }

  finalHtml += "</div>";
  return finalHtml;
}

// ------------------ Initialization ------------------

function init(): void {
  document.addEventListener("DOMContentLoaded", () => {
    showLoading("#main");
    loadHomeHtml();

    const homeBtn = document.querySelector("#navHomeButton");
    const logoBtn = document.querySelector("#navLogo");

    homeBtn?.addEventListener("click", loadHomeHtml);
    logoBtn?.addEventListener("click", () => window.location.reload());
  });
}

init();

// Публічні функції для виклику з HTML
export {
  loadCatalogCategories,
  loadCatalogItems,
  loadRandomCategory
};
