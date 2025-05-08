import { ajaxify } from "./AjaxifyTS";

interface Category {
  full_name: string;
  short_name: string;
}

interface CatalogItem {
  full_name: string;
  short_name: string;
  author: string;
  description: string;
  price: string;
}

interface CategoryCatalogItems {
  category: Category;
  catalog_items: CatalogItem[];
}

const homeHtml = "snippets/home-snippets.html";
const allCategoriesUrl = "data/categories.json";
const categoryHtmlUrl = "snippets/category-snippets.html";
const catalogItemsUrl = "data/catalog/";
const catalogItemsTitleHtmlUrl = "snippets/catalog-items-title.html";
const catalogItemHtmlUrl = "snippets/catalog-item.html";

const insertHtml = (selector: string, html: string): void => {
  const targetElem = document.querySelector(selector);
  if (targetElem) {
    targetElem.innerHTML = html;
  }
};

const showLoading = (selector: string): void => {
  const html = `<div class='text-center'><img src='images/ajax-loader.gif'></div>`;
  insertHtml(selector, html);
};

const insertProperty = (template: string, propName: string, propValue: string): string => {
  const propToReplace = new RegExp(`{{${propName}}}`, "g");
  return template.replace(propToReplace, propValue);
};

const switchActive = (activeElement: "home" | "catalog"): void => {
  const homeButton = document.querySelector("#navHomeButton");
  const catalogButton = document.querySelector("#navCatalogButton");
  if (homeButton && catalogButton) {
    if (activeElement === "catalog") {
      homeButton.classList.remove("active");
      catalogButton.classList.add("active");
    } else {
      catalogButton.classList.remove("active");
      homeButton.classList.add("active");
    }
  }
};

const loadHomeHtml = (): void => {
  showLoading("#main");
  ajaxify.sendGetRequest<string>(
    homeHtml,
    (responseText) => {
      switchActive("home");
      insertHtml("#main", responseText);
      attachHomeListeners();
    },
    false
  );
};

const attachHomeListeners = (): void => {
  document.querySelector("#catalogButton")?.addEventListener("click", () => {
    bh.loadCatalogCategories();
  });

  document.querySelector("#randomCategoryButton")?.addEventListener("click", () => {
    bh.loadRandomCategory();
  });
};

const attachCategoryListeners = (): void => {
  document.querySelectorAll(".category").forEach((element) => {
    element.addEventListener("click", () => {
      const shortName = (element as HTMLElement).dataset.category;
      if (shortName) {
        bh.loadCatalogItems(shortName);
      }
    });
  });
};

export const bh = {
  loadRandomCategory(): void {
    showLoading("#main");
    ajaxify.sendGetRequest<Category[]>(allCategoriesUrl, (categories) => {
      const randomIndex = Math.floor(Math.random() * categories.length);
      const randomCategory = categories[randomIndex];
      bh.loadCatalogItems(randomCategory.short_name);
    });
  },

  loadCatalogCategories(): void {
    showLoading("#main");
    ajaxify.sendGetRequest<Category[]>(allCategoriesUrl, buildAndShowCategoriesHTML);
  },

  loadCatalogItems(categoryShort: string): void {
    showLoading("#main");
    ajaxify.sendGetRequest<CategoryCatalogItems>(
      `${catalogItemsUrl}${categoryShort}.json`,
      buildAndShowCatalogItemsHTML
    );
  },
};

const buildAndShowCategoriesHTML = (categories: Category[]): void => {
  ajaxify.sendGetRequest<string>(
    categoryHtmlUrl,
    (categoryHtml) => {
      switchActive("catalog");
      const viewHtml = buildCategoriesViewHtml(categories, categoryHtml);
      insertHtml("#main", viewHtml);
      attachCategoryListeners();
    },
    false
  );
};

const buildCategoriesViewHtml = (categories: Category[], categoryHtml: string): string => {
  let finalHtml = "<div class='catalog'>";
  for (const category of categories) {
    let html = categoryHtml;
    html = insertProperty(html, "full_name", category.full_name);
    html = insertProperty(html, "short_name", category.short_name);
    html = html.replace(
      "<div class=\"category\"",
      `<div class="category" data-category="${category.short_name}"`
    );
    finalHtml += html;
  }
  finalHtml += "</div>";
  return finalHtml;
};

const buildAndShowCatalogItemsHTML = (data: CategoryCatalogItems): void => {
  ajaxify.sendGetRequest<string>(
    catalogItemsTitleHtmlUrl,
    (titleHtml) => {
      ajaxify.sendGetRequest<string>(
        catalogItemHtmlUrl,
        (itemHtml) => {
          switchActive("catalog");
          const viewHtml = buildCatalogItemsViewHtml(data, titleHtml, itemHtml);
          insertHtml("#main", viewHtml);
        },
        false
      );
    },
    false
  );
};

const buildCatalogItemsViewHtml = (
  data: CategoryCatalogItems,
  titleHtml: string,
  itemHtml: string
): string => {
  titleHtml = insertProperty(titleHtml, "full_name", data.category.full_name);

  let finalHtml = titleHtml + "<div class='catalog'>";
  for (const item of data.catalog_items) {
    let html = itemHtml;
    html = insertProperty(html, "catShortName", data.category.short_name);
    html = insertProperty(html, "short_name", item.short_name);
    html = insertProperty(html, "full_name", item.full_name);
    html = insertProperty(html, "author", item.author);
    html = insertProperty(html, "description", item.description);
    html = insertProperty(html, "price", item.price);
    finalHtml += html;
  }
  finalHtml += "</div>";
  return finalHtml;
};

document.addEventListener("DOMContentLoaded", () => {
  loadHomeHtml();
  document.querySelector("#navHomeButton")?.addEventListener("click", loadHomeHtml);
  document.querySelector("#navLogo")?.addEventListener("click", () => window.location.reload());
});
