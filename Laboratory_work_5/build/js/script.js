import { ajaxify } from "./AjaxifyTS";
const homeHtml = "snippets/home-snippets.html";
const allCategoriesUrl = "data/categories.json";
const categoryHtmlUrl = "snippets/category-snippets.html";
const catalogItemsUrl = "data/catalog/";
const catalogItemsTitleHtmlUrl = "snippets/catalog-items-title.html";
const catalogItemHtmlUrl = "snippets/catalog-item.html";
const insertHtml = (selector, html) => {
    const targetElem = document.querySelector(selector);
    if (targetElem) {
        targetElem.innerHTML = html;
    }
};
const showLoading = (selector) => {
    const html = `<div class='text-center'><img src='images/ajax-loader.gif'></div>`;
    insertHtml(selector, html);
};
const insertProperty = (template, propName, propValue) => {
    const propToReplace = new RegExp(`{{${propName}}}`, "g");
    return template.replace(propToReplace, propValue);
};
const switchActive = (activeElement) => {
    const homeButton = document.querySelector("#navHomeButton");
    const catalogButton = document.querySelector("#navCatalogButton");
    if (homeButton && catalogButton) {
        if (activeElement === "catalog") {
            homeButton.classList.remove("active");
            catalogButton.classList.add("active");
        }
        else {
            catalogButton.classList.remove("active");
            homeButton.classList.add("active");
        }
    }
};
const loadHomeHtml = () => {
    showLoading("#main");
    ajaxify.sendGetRequest(homeHtml, (responseText) => {
        switchActive("home");
        insertHtml("#main", responseText);
        attachHomeListeners();
    }, false);
};
const attachHomeListeners = () => {
    var _a, _b;
    (_a = document.querySelector("#catalogButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", () => {
        bh.loadCatalogCategories();
    });
    (_b = document.querySelector("#randomCategoryButton")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => {
        bh.loadRandomCategory();
    });
};
const attachCategoryListeners = () => {
    document.querySelectorAll(".category").forEach((element) => {
        element.addEventListener("click", () => {
            const shortName = element.dataset.category;
            if (shortName) {
                bh.loadCatalogItems(shortName);
            }
        });
    });
};
export const bh = {
    loadRandomCategory() {
        showLoading("#main");
        ajaxify.sendGetRequest(allCategoriesUrl, (categories) => {
            const randomIndex = Math.floor(Math.random() * categories.length);
            const randomCategory = categories[randomIndex];
            bh.loadCatalogItems(randomCategory.short_name);
        });
    },
    loadCatalogCategories() {
        showLoading("#main");
        ajaxify.sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
    },
    loadCatalogItems(categoryShort) {
        showLoading("#main");
        ajaxify.sendGetRequest(`${catalogItemsUrl}${categoryShort}.json`, buildAndShowCatalogItemsHTML);
    },
};
const buildAndShowCategoriesHTML = (categories) => {
    ajaxify.sendGetRequest(categoryHtmlUrl, (categoryHtml) => {
        switchActive("catalog");
        const viewHtml = buildCategoriesViewHtml(categories, categoryHtml);
        insertHtml("#main", viewHtml);
        attachCategoryListeners();
    }, false);
};
const buildCategoriesViewHtml = (categories, categoryHtml) => {
    let finalHtml = "<div class='catalog'>";
    for (const category of categories) {
        let html = categoryHtml;
        html = insertProperty(html, "full_name", category.full_name);
        html = insertProperty(html, "short_name", category.short_name);
        html = html.replace("<div class=\"category\"", `<div class="category" data-category="${category.short_name}"`);
        finalHtml += html;
    }
    finalHtml += "</div>";
    return finalHtml;
};
const buildAndShowCatalogItemsHTML = (data) => {
    ajaxify.sendGetRequest(catalogItemsTitleHtmlUrl, (titleHtml) => {
        ajaxify.sendGetRequest(catalogItemHtmlUrl, (itemHtml) => {
            switchActive("catalog");
            const viewHtml = buildCatalogItemsViewHtml(data, titleHtml, itemHtml);
            insertHtml("#main", viewHtml);
        }, false);
    }, false);
};
const buildCatalogItemsViewHtml = (data, titleHtml, itemHtml) => {
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
    var _a, _b;
    loadHomeHtml();
    (_a = document.querySelector("#navHomeButton")) === null || _a === void 0 ? void 0 : _a.addEventListener("click", loadHomeHtml);
    (_b = document.querySelector("#navLogo")) === null || _b === void 0 ? void 0 : _b.addEventListener("click", () => window.location.reload());
});
