// ------------------ HTML helpers ------------------
function insertHtml(selector, html) {
    const targetElem = document.querySelector(selector);
    if (targetElem) {
        targetElem.innerHTML = html;
    }
}
function showLoading(selector) {
    const html = "<div class='text-center'><img src='images/ajax-loader.gif'></div>";
    insertHtml(selector, html);
}
function insertProperty(template, propName, propValue) {
    const propToReplace = `{{${propName}}}`;
    return template.replace(new RegExp(propToReplace, "g"), propValue);
}
function switchActive(activeElement) {
    const homeButton = document.querySelector("#navHomeButton");
    const catalogButton = document.querySelector("#navCatalogButton");
    if (!homeButton || !catalogButton)
        return;
    if (activeElement === "catalog") {
        homeButton.classList.remove("active");
        catalogButton.classList.add("active");
    }
    else {
        catalogButton.classList.remove("active");
        homeButton.classList.add("active");
    }
}
// ------------------ AJAX helper ------------------
function sendGetRequest(url, callback, isJsonResponse = true) {
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
const homeHtml = "build/snippets/home-snippets.html";
const allCategoriesUrl = "build/data/categories.json";
const categoryHtml = "build/snippets/category-snippets.html";
const catalogItemsUrl = "build/data/catalog/";
const catalogItemsTitleHtml = "build/snippets/catalog-items-title.html";
const catalogItemHtml = "build/snippets/catalog-item.html";
// ------------------ Loaders ------------------
function loadHomeHtml() {
    sendGetRequest(homeHtml, (response) => {
        switchActive("home");
        insertHtml("#main", response);
    }, false);
}
function loadCatalogCategories() {
    showLoading("#main");
    sendGetRequest(allCategoriesUrl, buildAndShowCategoriesHTML);
}
function loadCatalogItems(categoryShort) {
    showLoading("#main");
    sendGetRequest(catalogItemsUrl + categoryShort + ".json", buildAndShowCatalogItemsHTML);
}
function loadRandomCategory() {
    showLoading("#main");
    sendGetRequest(allCategoriesUrl, (categories) => {
        const randomIndex = Math.floor(Math.random() * categories.length);
        const randomCategory = categories[randomIndex];
        loadCatalogItems(randomCategory.short_name);
    });
}
// ------------------ View Builders ------------------
function buildAndShowCategoriesHTML(categories) {
    sendGetRequest(categoryHtml, (template) => {
        switchActive("catalog");
        const viewHtml = buildCategoriesViewHtml(categories, template);
        insertHtml("#main", viewHtml);
    }, false);
}
function buildCategoriesViewHtml(categories, template) {
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
function buildAndShowCatalogItemsHTML(data) {
    sendGetRequest(catalogItemsTitleHtml, (titleHtml) => {
        sendGetRequest(catalogItemHtml, (itemHtml) => {
            switchActive("catalog");
            const viewHtml = buildCatalogItemsViewHtml(data, titleHtml, itemHtml);
            insertHtml("#main", viewHtml);
        }, false);
    }, false);
}
function buildCatalogItemsViewHtml(data, titleHtml, itemHtml) {
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
function init() {
    document.addEventListener("DOMContentLoaded", () => {
        showLoading("#main");
        loadHomeHtml();
        const homeBtn = document.querySelector("#navHomeButton");
        const logoBtn = document.querySelector("#navLogo");
        homeBtn === null || homeBtn === void 0 ? void 0 : homeBtn.addEventListener("click", loadHomeHtml);
        logoBtn === null || logoBtn === void 0 ? void 0 : logoBtn.addEventListener("click", () => window.location.reload());
    });
}
init();
// Публічні функції для виклику з HTML
export { loadCatalogCategories, loadCatalogItems, loadRandomCategory };
