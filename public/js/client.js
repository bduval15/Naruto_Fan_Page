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

    function loadArticle(articleId) {
        ajaxGET(`/data/article${articleId}.html`, function (htmlContent) { 
            console.log("Article loaded:", htmlContent);
            modalContent.innerHTML = htmlContent;
            modal.style.display = "block";
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
    const mainImage = document.getElementById('bg2');
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');

    ajaxGET('/data/images.json', function (data) {
        images = JSON.parse(data).images;
        console.log("Loaded images:", images);

        mainImage.src = images[currentIndex];
        mainImage.style.opacity = "1";
    });

    function changeImage() {
        if (images.length > 0) {
            mainImage.style.transition = "opacity 0.5s ease-in-out";
            mainImage.style.opacity = "0";

            setTimeout(() => {
                mainImage.src = images[currentIndex];

                mainImage.onload = () => {
                    mainImage.style.opacity = "1";
                };
            }, 500);
        }
    }

    leftButton.addEventListener('click', function () {
        currentIndex = (currentIndex - 1 + images.length) % images.length;
        changeImage();
    });

    rightButton.addEventListener('click', function () {
        currentIndex = (currentIndex + 1) % images.length;
        changeImage();
    });
});
