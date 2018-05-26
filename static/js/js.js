document.addEventListener("DOMContentLoaded", function () {
    var aside_content = document.getElementById("aside__content").clientHeight;
    var main_content = document.getElementById("main_content");
    var wrapper = document.getElementById("wrapper");

    //console.log(wrapper.clientHeight);
    wrapper.style.minHeight = aside_content + 107 + "px";
    //console.log(wrapper.clientHeight);

    if (aside_content + 90 < document.documentElement.clientHeight) {
        main_content.style.maxHeight = "none";
        main_content.style.height =
            document.documentElement.clientHeight - 210 + "px";
        //console.log("yes!");
    } else {
        //console.log("no!");
        main_content.style.height = "auto";
        main_content.style.maxHeight = aside_content - 119 + "px";
    }

    /*----  button "add book" -----*/
    var add__book = document.getElementById("add__book");
    var popup = document.getElementById("popup");
    var popup__form__close = document.getElementById("popup__form__close");
    add__book.addEventListener("click", function () {
        //console.log("add book");
        popup.style.display = "flex";
    });

    popup__form__close.addEventListener("click", closeForm);
    /*----  /button "add book" -----*/
    var event = new Event("click");
    document.getElementsByClassName("categories__menu__item__link")[0].dispatchEvent(event);
});

window.addEventListener("resize", function () {
    var wrapper = document.getElementById("wrapper");
    var main_content = document.getElementById("main_content");
    var main_container = document.getElementById("main_container");
    var aside_content = document.getElementById("aside__content").clientHeight;
    if (aside_content + 90 < document.documentElement.clientHeight) {
        main_content.style.maxHeight = "none";
        main_content.style.height =
            document.documentElement.clientHeight - 210 + "px";
        //console.log("yes!");
    } else {
        //console.log("no!");
        main_content.style.height = "auto";
        main_content.style.maxHeight = aside_content - 119 + "px";
    }
});

function closeForm() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
}

function updateRating(event) {
    var target = event.target;
    if (target.tagName === 'INPUT') {
        var data = target.getAttribute('id').split('-');
        var newRating = data[0];
        var bookId = data[1];
        //console.log(bookId,newRating);
        //console.log(newRating,bookId);
        xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            //console.log(xhttp.readyState + "_"+ xhttp.status);
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                console.log("rating_changed");
                if (document.getElementsByClassName("categories__menu__item-active")[0].childNodes[0].classList.contains("mostPopular")) {
                    var event = new Event("click");
                    //console.log(document.getElementsByClassName("categories__menu__item__link")[2]);
                    setTimeout(document.getElementsByClassName("categories__menu__item__link")[2].dispatchEvent(event), 5000);
                }
                //console.log(document.getElementsByClassName("categories__menu__item-active")[0].childNodes[0].classList.contains("mostPopular"));
            }
        };

        xhttp.onerror = function () {
            var event = new Event("click");
            setTimeout(document.getElementsByClassName("categories__menu__item__link")[1].dispatchEvent(event), 2000);
        };
        xhttp.open('PUT', '/books' + bookId, true);
        xhttp.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
        var str = 'newRating=' + newRating;
        xhttp.send(str);
    } else {
        //console.log("мимо");
    }

}

function renderingBooks(data) {
    var main_content = document.getElementById("main_content");
    main_content.innerHTML = "";
    var pictureDirect = "img/pictures/";
    if (data.length == 0 || data == null) {
        main_content.innerHTML = "<h2 class='h2'>No books were found for this request</h2>"
    } else {
        for (var key in data) {
            var newBook = document.createElement('div');
            var title = document.createElement('span');
            var picture = document.createElement(('div'));
            var author = document.createElement('span');
            var main_content = document.getElementById("main_content");
            var rating = document.createElement('span');
            rating.classList.add("book__info", "book_rating");
            var starRating = document.createElement('div');
            starRating.classList.add('star-rating');
            var starRatingWrap = document.createElement('div');
            starRatingWrap.classList.add('star-rating__wrap');
            rating.appendChild(starRating);
            starRating.appendChild(starRatingWrap);
            rating.setAttribute('onclick', 'updateRating(event)');
            var j = 0;
            for (var i = 5; i > 0; i--) {
                var input = document.createElement('input');
                var label = document.createElement('label');
                input.classList.add('star-rating__input');
                label.classList.add('star-rating__ico', 'fa', 'fa-star-o', 'fa-lg')
                input.setAttribute('type', 'radio');
                input.setAttribute('name', '' + key);
                input.setAttribute('id', '' + i + '-' + data[key].id);
                label.setAttribute('for', '' + i + '-' + data[key].id);
                if (data[key].rating == i) {
                    input.setAttribute('checked', 'checked');
                }
                starRatingWrap.appendChild(input);
                starRatingWrap.appendChild(label);
                j++;
            }
            picture.classList.add("book__picture");
            picture.innerHTML = "<img style='width: 100%; height: 100%' src=" + pictureDirect + data[key].picture + ">";
            title.classList.add("book__info", "book_name");
            title.innerHTML = data[key].title;
            author.classList.add("book__info", "book__author");
            author.innerHTML = data[key].author;
            newBook.classList.add("main__content__item");
            newBook.appendChild(picture);
            newBook.appendChild(title);
            newBook.appendChild(author);
            newBook.appendChild(rating);
            main_content.appendChild(newBook);
        }
    }
}


function get_ajax(url, callback) {
    var req = new XMLHttpRequest();

    req.onreadystatechange = function () {
        if (req.readyState == 4 && req.status == 200) {
            //console.log('responseText:' + req.responseText);
            try {
                var data = JSON.parse(req.responseText);
                //console.log(data);
            } catch (err) {
                console.log(err.message);
                return;
            }

            callback(data);
        }
    }

    req.open('GET', url, true);
    req.send();
}


// function sendForm() {
//     getRecentBooks();
// }


function renderBooks(filter, currentItem) {
    deactivateAllCategories();
    var selected = currentItem;
    var closestLi = selected.closest(".categories__menu__item");
    closestLi.classList.add("categories__menu__item-active");


    switch (filter) {
        case "all":
            getAllBooks();
            break;
        case "free":
            getFreeBooks();
            break;
        case "recent":
            getRecentBooks();
            break;
        case "popular":
            getPopularBooks();
    }
}

function getAllBooks() {
    get_ajax("/books", function (data) {
        renderingBooks(data);
    })
}


function getFreeBooks() {
    get_ajax("/books?que=free", function (data) {
        renderingBooks(data);
    })
}

function getRecentBooks() {
    get_ajax("/books?que=most_recent", function (data) {
        renderingBooks(data);
    })
}

function getPopularBooks() {
    get_ajax("/books?que=most_popular", function (data) {
        renderingBooks(data);
    })
}


function deactivateAllCategories() {
    var items = document.getElementsByClassName("categories__menu__item");
    for (var i = 0; i < items.length; i++) {
        items[i].classList.remove("categories__menu__item-active");
    }
}

function getName(str) {
    if (str.lastIndexOf("\\")) {
        var i = str.lastIndexOf("\\") + 1;
    } else {
        var i = str.lastIndexOf("/") + 1;
    }
    var filename = str.slice(i);
    var uploaded = document.getElementById("add__file__form__label");
    uploaded.innerHTML = filename;
}


function search(elem) {
    var word = elem.value;
    get_ajax('/search?word=' + word, function (data) {
        renderingBooks(data);
    });
}

function sendForm() {
    var picture = document.getElementById('add__file__form__upload').files[0];
    var author = document.getElementById("input-author").value;
    var title = document.getElementById("input-title").value;
    var price = document.getElementById("input-price").value;

    var formData = new FormData();
    formData.processData = false;
    formData.contentType = false;
    formData.append('img', picture);
    formData.append('author', author);
    formData.append('title', title);
    formData.append('price', price);

    xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            //console.log(xhttp.response);
            var event = new Event("click");
            setTimeout(document.getElementsByClassName("categories__menu__item__link")[1].dispatchEvent(event), 3000);
            closeForm();
        }
    }
    xhttp.open('POST', '/books', true);
    xhttp.send(formData);
}


