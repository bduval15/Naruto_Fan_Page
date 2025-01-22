document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("articleModal");
    const closeButton = document.querySelector(".close-button");
    const modalContent = document.getElementById("modal-article-content");

    function ajaxGET(url, callback) {
        const xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.readyState == XMLHttpRequest.DONE && this.status == 200) {
                callback(this.responseText);
            } else {
                console.error("Request failed with status:", this.status);
            }
        };
        xhr.open("GET", url);
        xhr.send();
    }

    let cachedArticles = {}; 

function loadArticle(articleId) {
    if (cachedArticles[articleId]) {
        console.log(`Using cached article ${articleId}`);
        modalContent.innerHTML = cachedArticles[articleId];
        modal.style.display = "block";
        return;
    }

    modalContent.innerHTML = "<p>Loading article...</p>"; 
    fetch(`/data/article${articleId}.html`)
        .then(response => response.text())
        .then(htmlContent => {
            cachedArticles[articleId] = htmlContent; 
            modalContent.innerHTML = htmlContent;
            modal.style.display = "block";
        })
        .catch(err => {
            console.error(`Error loading article ${articleId}:`, err);
            modalContent.innerHTML = "<p>Error loading article.</p>";
        });
}

    

    document.querySelectorAll(".read-more").forEach((link) => {
        link.addEventListener("click", function (event) {
            event.preventDefault();
            const articleId = link.getAttribute("data-article-id");
            loadArticle(articleId);
        });
    });

    closeButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    fetch("/data/cat.json") 
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Sidebar Data:", data);
            populateDropdownMenu(data, ".sidebar-item", ".cat-list");
        })
        .catch(err => console.error("Error loading sidebar data:", err));

    fetch("/data/data.json") 
        .then(response => response.json())
        .then(data => {
            console.log("Fetched Middle Data:", data);
            populateDropdownMenu(data, ".middle-item", ".dropdown-list");
        })
        .catch(err => console.error("Error loading middle data:", err));

    function populateDropdownMenu(data, itemSelector, listSelector) {
        const items = document.querySelectorAll(itemSelector);
        items.forEach(item => {
            const categoryName = item.querySelector('h5').textContent.trim();
            const categoryData = data[categoryName] || [];
            const dropdownList = item.querySelector(listSelector);
            if (!dropdownList) {
                console.error(`No ${listSelector} found for`, item);
                return;
            }

            dropdownList.innerHTML = '';

            categoryData.forEach(itemData => {
                const listItem = document.createElement('li');
                listItem.textContent = itemData;
                dropdownList.appendChild(listItem);
            });

            item.addEventListener('mouseenter', function () {
                dropdownList.style.display = 'block';
            });

            item.addEventListener('mouseleave', function () {
                dropdownList.style.display = 'none';
            });
        });
    }

    let images = [];
let currentIndex = 0;
const mainImage = document.getElementById("bg2");
const leftButton = document.getElementById("left-button");
const rightButton = document.getElementById("right-button");

fetch("/data/images.json")
    .then(response => response.json())
    .then(data => {
        images = data.images;
        console.log("Preloading images:", images);
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });

        mainImage.src = images[currentIndex];
        mainImage.style.opacity = "1";
    })
    .catch(err => console.error("Error loading images:", err));

function changeImage(nextIndex) {
    mainImage.style.transition = "opacity 0.3s ease-in-out";
    mainImage.style.opacity = "0";

    setTimeout(() => {
        currentIndex = nextIndex;
        mainImage.src = images[currentIndex];

        mainImage.onload = () => {
            mainImage.style.opacity = "1"; 
        };
    }, 300);
}

leftButton.addEventListener("click", function () {
    const nextIndex = (currentIndex - 1 + images.length) % images.length;
    changeImage(nextIndex);
});

rightButton.addEventListener("click", function () {
    const nextIndex = (currentIndex + 1) % images.length;
    changeImage(nextIndex);
});

