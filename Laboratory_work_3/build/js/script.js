function getCategoryPositions(category) {
    var filename = "./".concat(category, ".json");
    var request = new XMLHttpRequest();
    request.open("GET", filename);
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var rtext = request.responseText;
            var rjson = JSON.parse(rtext);
            setPositions(rjson, category);
        }
    };
    request.send();
}
getCategoryPositions("Cakes");
function setPositions(categoryData, categoryName) {
    var container = document.getElementById("catalog-container");
    if (!container)
        return;
    container.innerHTML = '';
    categoryData.forEach(function (element) {
        var div = document.createElement("div");
        var img = document.createElement("img");
        var h1 = document.createElement("h1");
        var text = document.createElement("p");
        var price = document.createElement("span");
        text.innerHTML = element.description;
        h1.innerHTML = element.name;
        price.innerHTML = "Price: ".concat(element.price);
        var url = "./images/".concat(categoryName, "/").concat(element.id, ".jpg");
        img.setAttribute("src", url);
        div.appendChild(h1);
        div.appendChild(img);
        div.appendChild(text);
        div.appendChild(price);
        container.appendChild(div);
    });
}
var prevRand = null;
function setButtonEvents() {
    var specialsLink = document.getElementById("specials-link");
    if (!specialsLink)
        return;
    specialsLink.addEventListener('click', function (event) {
        event.preventDefault();
        var categories = [];
        document.querySelectorAll(".category-link").forEach(function (link) {
            var id = link.getAttribute("id");
            if (id)
                categories.push(id);
        });
        if (categories.length === 0)
            return;
        var rand = Math.floor(Math.random() * categories.length);
        while (rand === prevRand) {
            rand = Math.floor(Math.random() * categories.length);
        }
        prevRand = rand;
        getCategoryPositions(categories[rand]);
    });
    document.querySelectorAll('.category-link').forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            var category = this.getAttribute('id');
            if (category)
                getCategoryPositions(category);
        });
    });
}
function loadCategoryData() {
    var request = new XMLHttpRequest();
    request.open("GET", "../categories.json");
    request.onreadystatechange = function () {
        if (request.readyState === XMLHttpRequest.DONE) {
            var rtext = request.responseText;
            var rjson = JSON.parse(rtext);
            setCategoryData(rjson);
            setButtonEvents();
        }
    };
    request.send();
}
function setCategoryData(dataSet) {
    var container = document.getElementById("Categories");
    if (!container)
        return;
    dataSet.forEach(function (element) {
        var a = document.createElement("a");
        a.classList.add("category-link");
        a.innerText = element.name;
        a.id = element.name;
        var img = document.createElement("img");
        var src = "./images/".concat(element.name, "/category.jpg");
        img.setAttribute("src", src);
        a.appendChild(img);
        container.appendChild(a);
    });
}
loadCategoryData();
