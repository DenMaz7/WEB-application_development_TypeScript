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
        const div = document.createElement("div");
        const img = document.createElement("img");
        const h1 = document.createElement("h1");
        const text = document.createElement("p");
        const price = document.createElement("span");
        text.innerHTML = element.description;
        h1.innerHTML = element.name;
        price.innerHTML = `Price: ${element.price}`;
        const url = `./images/${categoryName}/${element.id}.jpg`;
        img.setAttribute("src", url);
        div.appendChild(h1);
        div.appendChild(img);
        div.appendChild(text);
        div.appendChild(price);
        container.appendChild(div);
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
    const container = document.getElementById("Categories");
    if (!container)
        return;
    dataSet.forEach((element) => {
        const a = document.createElement("a");
        a.classList.add("category-link");
        a.innerText = element.name;
        a.id = element.name;
        const img = document.createElement("img");
        const src = `./images/${element.name}/category.jpg`;
        img.setAttribute("src", src);
        a.appendChild(img);
        container.appendChild(a);
    });
}
loadCategoryData();
