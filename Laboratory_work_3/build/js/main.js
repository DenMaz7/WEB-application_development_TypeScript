"use strict";
function getCategoryPositions(category) {
    const filename = `./${category}.json`;
    const request = new XMLHttpRequest();
    request.open("GET", filename);
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const rtext = request.responseText;
            const rjson = JSON.parse(rtext);
            setPositions(rjson, category);
        }
    };
    request.send();
}
getCategoryPositions("cakes");
function setPositions(categoryData, categoryName) {
    const container = document.getElementById("main");
    if (!container)
        return;
    container.innerHTML = '';
    categoryData.forEach((element) => {
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
        bookDiv.appendChild(img);
        bookDiv.appendChild(h2);
        bookDiv.appendChild(h3);
        bookDiv.appendChild(desc);
        bookDiv.appendChild(price);
        bookDiv.appendChild(button);
        container.appendChild(bookDiv);
    });
}
let prevRand = null;
function setButtonEvents() {
    const randomCategory = document.getElementById("randomCategory");
    if (!randomCategory)
        return;
    randomCategory.addEventListener('click', function (event) {
        event.preventDefault();
        const categories = [];
        document.querySelectorAll(".category-link").forEach(link => {
            const id = link.getAttribute("id");
            if (id)
                categories.push(id);
        });
        if (categories.length === 0)
            return;
        let rand = Math.floor(Math.random() * categories.length);
        while (rand === prevRand) {
            rand = Math.floor(Math.random() * categories.length);
        }
        prevRand = rand;
        getCategoryPositions(categories[rand]);
    });
    document.querySelectorAll('.category-link').forEach(link => {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            const category = this.getAttribute('id');
            if (category)
                getCategoryPositions(category);
        });
    });
}
function loadCategoryData() {
    const request = new XMLHttpRequest();
    request.open("GET", "../categories.json");
    request.onreadystatechange = () => {
        if (request.readyState === XMLHttpRequest.DONE) {
            const rtext = request.responseText;
            const rjson = JSON.parse(rtext);
            setCategoryData(rjson);
            setButtonEvents();
        }
    };
    request.send();
}
function setCategoryData(dataSet) {
    const container = document.getElementById("main");
    if (!container)
        return;
    container.innerHTML = '';
    dataSet.forEach((element) => {
        const div = document.createElement("div");
        div.classList.add("category");
        div.setAttribute("onclick", `$bh.loadCatalogItems('${element.short_name}');`);
        const img = document.createElement("img");
        img.classList.add("bi");
        img.src = `images/catalog/${element.short_name}/${element.short_name}.jpg`;
        img.alt = element.full_name;
        const h2 = document.createElement("h2");
        h2.innerText = element.full_name;
        div.appendChild(img);
        div.appendChild(h2);
        container.appendChild(div);
    });
}
loadCategoryData();
