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

export class App {
  private readonly homeHtml = "build/snippets/home-snippets.html";
  private readonly allCategoriesUrl = "build/data/categories.json";
  private readonly categoryHtml = "build/snippets/category-snippets.html";
  private readonly catalogItemsTitleHtml = "build/snippets/catalog-items-title.html";
  private readonly catalogItemHtml = "build/snippets/catalog-items.html";
  private readonly catalogItemsUrl = "build/data/catalog/";

  init(): void {
    this.showLoading("#main");
    this.loadHomeHtml();

    document.querySelector("#navHomeButton")?.addEventListener("click", () => this.loadHomeHtml());
    document.querySelector("#navCatalogButton")?.addEventListener("click", () => this.loadCatalogCategories());
    document.querySelector("#navLogo")?.addEventListener("click", () => window.location.reload());

    // Додаємо обробники динамічних кнопок (делегування)
    document.body.addEventListener("click", (e) => {
      const target = e.target as HTMLElement;
      if (target.matches(".load-category")) {
        const category = target.dataset.category;
        if (category) this.loadCatalogItems(category);
      } else if (target.matches(".random-category")) {
        this.loadRandomCategory();
      }
    });
  }

  private insertHtml(selector: string, html: string): void {
    const elem = document.querySelector(selector);
    if (elem) elem.innerHTML = html;
  }

  private insertProperty(template: string, propName: string, propValue: string): string {
    const propToReplace = `{{${propName}}}`;
    return template.replace(new RegExp(propToReplace, "g"), propValue);
  }

  private showLoading(selector: string): void {
    const html = `<div class='text-center'><img src='images/ajax-loader.gif'></div>`;
    this.insertHtml(selector, html);
  }

  private switchActive(active: "home" | "catalog"): void {
    const homeBtn = document.querySelector("#navHomeButton");
    const catBtn = document.querySelector("#navCatalogButton");
    if (!homeBtn || !catBtn) return;

    homeBtn.classList.toggle("active", active === "home");
    catBtn.classList.toggle("active", active === "catalog");
  }

  private sendGetRequest(url: string, callback: (response: any) => void, isJson: boolean = true): void {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => {
      if (xhr.readyState === XMLHttpRequest.DONE && xhr.status === 200) {
        const response = isJson ? JSON.parse(xhr.responseText) : xhr.responseText;
        callback(response);
      }
    };
    xhr.open("GET", url, true);
    xhr.send();
  }

  private loadHomeHtml(): void {
    this.sendGetRequest(this.homeHtml, (html: string) => {
      this.switchActive("home");
      this.insertHtml("#main", html);
    }, false);
  }

  private loadCatalogCategories(): void {
    this.showLoading("#main");
    this.sendGetRequest(this.allCategoriesUrl, (categories: Category[]) =>
      this.buildAndShowCategoriesHTML(categories)
    );
  }

  private loadCatalogItems(shortName: string): void {
    this.showLoading("#main");
    this.sendGetRequest(this.catalogItemsUrl + shortName + ".json", (data: CatalogData) =>
      this.buildAndShowCatalogItemsHTML(data)
    );
  }

  private loadRandomCategory(): void {
    this.showLoading("#main");
    this.sendGetRequest(this.allCategoriesUrl, (categories: Category[]) => {
      const random = categories[Math.floor(Math.random() * categories.length)];
      this.loadCatalogItems(random.short_name);
    });
  }

  private buildAndShowCategoriesHTML(categories: Category[]): void {
    this.sendGetRequest(this.categoryHtml, (template: string) => {
      this.switchActive("catalog");
      let html = "<div class='catalog'>";
      for (const cat of categories) {
        let temp = this.insertProperty(template, "full_name", cat.full_name);
        temp = this.insertProperty(temp, "short_name", cat.short_name);
        html += temp;
      }
      html += "</div>";
      this.insertHtml("#main", html);
    }, false);
  }

  private buildAndShowCatalogItemsHTML(data: CatalogData): void {
    this.sendGetRequest(this.catalogItemsTitleHtml, (titleTemplate: string) => {
      this.sendGetRequest(this.catalogItemHtml, (itemTemplate: string) => {
        this.switchActive("catalog");

        let titleHtml = this.insertProperty(titleTemplate, "full_name", data.category.full_name);
        let html = titleHtml + "<div class='catalog'>";

        for (const item of data.catalog_items) {
          let temp = itemTemplate;
          temp = this.insertProperty(temp, "catShortName", data.category.short_name);
          temp = this.insertProperty(temp, "short_name", item.short_name);
          temp = this.insertProperty(temp, "full_name", item.full_name);
          temp = this.insertProperty(temp, "author", item.author);
          temp = this.insertProperty(temp, "description", item.description);
          temp = this.insertProperty(temp, "price", item.price.toString());
          html += temp;
        }

        html += "</div>";
        this.insertHtml("#main", html);
      }, false);
    }, false);
  }
}
