export class App {
    constructor() {
        this.homeHtml = "build/snippets/home-snippets.html";
        this.allCategoriesUrl = "build/data/categories.json";
        this.categoryHtml = "build/snippets/category-snippets.html";
        this.catalogItemsTitleHtml = "build/snippets/catalog-items-title.html";
        this.catalogItemHtml = "build/snippets/catalog-items.html";
        this.catalogItemsUrl = "build/data/catalog/";
    }
    init() {
        var _a, _b, _c;
        this.showLoading("#main");
        this.loadHomeHtml();
        (_a = document.querySelector("#navHomeButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => this.loadHomeHtml());
        (_b = document.querySelector("#navCatalogButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => this.loadCatalogCategories());
        (_c = document.querySelector("#navLogo")) === null || _c === void 0 ? void 0 : _c.addEventListener("click", () => window.location.reload());
        // Додаємо обробники динамічних кнопок (делегування)
        document.body.addEventListener("click", (e) => {
            const target = e.target;
            if (target.matches(".load-category")) {
                const category = target.dataset.category;
                if (category)
                    this.loadCatalogItems(category);
            }
            else if (target.matches(".random-category")) {
                this.loadRandomCategory();
            }
        });
    }
    insertHtml(selector, html) {
        const elem = document.querySelector(selector);
        if (elem)
            elem.innerHTML = html;
    }
    insertProperty(template, propName, propValue) {
        const propToReplace = `{{${propName}}}`;
        return template.replace(new RegExp(propToReplace, "g"), propValue);
    }
    showLoading(selector) {
        const html = `<div class='text-center'><img src='images/ajax-loader.gif'></div>`;
        this.insertHtml(selector, html);
    }
    switchActive(active) {
        const homeBtn = document.querySelector("#navHomeButton");
        const catBtn = document.querySelector("#navCatalogButton");
        if (!homeBtn || !catBtn)
            return;
        homeBtn.classList.toggle("active", active === "home");
        catBtn.classList.toggle("active", active === "catalog");
    }
    sendGetRequest(url, callback, isJson = true) {
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
    loadHomeHtml() {
        this.sendGetRequest(this.homeHtml, (html) => {
            this.switchActive("home");
            this.insertHtml("#main", html);
        }, false);
    }
    loadCatalogCategories() {
        this.showLoading("#main");
        this.sendGetRequest(this.allCategoriesUrl, (categories) => this.buildAndShowCategoriesHTML(categories));
    }
    loadCatalogItems(shortName) {
        this.showLoading("#main");
        this.sendGetRequest(this.catalogItemsUrl + shortName + ".json", (data) => this.buildAndShowCatalogItemsHTML(data));
    }
    loadRandomCategory() {
        this.showLoading("#main");
        this.sendGetRequest(this.allCategoriesUrl, (categories) => {
            const random = categories[Math.floor(Math.random() * categories.length)];
            this.loadCatalogItems(random.short_name);
        });
    }
    buildAndShowCategoriesHTML(categories) {
        this.sendGetRequest(this.categoryHtml, (template) => {
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
    buildAndShowCatalogItemsHTML(data) {
        this.sendGetRequest(this.catalogItemsTitleHtml, (titleTemplate) => {
            this.sendGetRequest(this.catalogItemHtml, (itemTemplate) => {
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
