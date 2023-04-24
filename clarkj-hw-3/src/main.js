import { MyBookmark } from "./myBookmark.js";
import { Favorite } from "./favorite.js";
import * as storage from "./storage.js"

/*
const bookmarks = [
    {
      text: "Bing",
      url: "https://www.bing.com",
      comments: "Bing is a web search engine owned and operated by Microsoft."
    },
    {
      text: "Google",
      url: "https://www.google.com",
      comments: "Google Search is a search engine provided and operated by Google."
    },
    {
      text: "DuckDuckGo",
      url: "https://duckduckgo.com/",
      comments: "DuckDuckGo (DDG) is an internet search engine that emphasizes protecting searchers' privacy."
    }
  ];

window.onload = () => {
    let marks = document.querySelector("#bookmarks");
    for(let b of bookmarks)
    {
        const bing = document.createElement("my-bookmark");

        bing.dataset.text = b.text;
        bing.dataset.url = b.url;
        bing.dataset.comments = b.comments;
    
        const newLI = document.createElement("li");
        newLI.appendChild(bing);
        document.querySelector("#bookmarks").appendChild(newLI);
    }
  };
*/

let favorites = [];

window.onload = () => {
    console.log("Window onLoad");
    document.querySelector("form").addEventListener("submit", (evt) => {
        if (evt.submitter == document.querySelector("#favorite-submit-button")) {
            submitClicked(evt);
        } else if (evt.submitter == document.querySelector("#favorite-cancel-button")) {
            clearFormFields(evt);
        }
    });

    loadFavoritesFromStorage();

    console.log(favorites)
};

const submitClicked = (evt) => {
    console.log("Submit clicked");

    let fav = new Favorite();
    fav.fid = crypto.randomUUID();
    fav.text = document.querySelector("#favorite-text").value;
    fav.url = document.querySelector("#favorite-url").value;
    fav.comments = document.querySelector("#favorite-comments").value;

    favorites[favorites.length] = fav;
    createBookmarkComponent(fav.fid, fav.text, fav.url, fav.comments);

    return clearFormFields(evt);
};

const clearFormFields = (evt) => {
    console.log("Clearing form fields");
    document.querySelector("#favorite-text").value = "";
    document.querySelector("#favorite-url").value = "";
    document.querySelector("#favorite-comments").value = "";

    evt.preventDefault();
    return false;
};

const createBookmarkComponent = (fid, text, url, comments) => {
    let marks = document.querySelector("#bookmarks");
    const bookmark = document.createElement("my-bookmark");

    bookmark.dataset.fid = fid;
    bookmark.dataset.text = text;
    bookmark.dataset.url = url;
    bookmark.dataset.comments = comments;
    bookmark.deleteCallback = deleteFavorite;

    const newLI = document.createElement("li");
    newLI.appendChild(bookmark);
    marks.appendChild(newLI);

    storage.setFavorites(favorites);
    updateNumFavorites();
}

const loadFavoritesFromStorage = () => {
    favorites = storage.getFavorites();
    for (let fav of favorites) {
        createBookmarkComponent(fav.fid, fav.text, fav.url, fav.comments);
    }
    updateNumFavorites();
}

const deleteFavorite = (fid) => {
    let index = -1;
    // Did this on my own
    for (let i = 0; i < favorites.length; i++) {
        if (favorites[i].fid == fid) {
            index = i;
        }
    }
    if (index != -1) {
        favorites.splice(index, 1);
    }

    let bookmarks = document.querySelector("#bookmarks").children;
    for (let b of bookmarks) {
        if (b.children[0].dataset.fid == fid) {
            console.log("Deleting");
            b.remove();
        }
    }

    storage.setFavorites(favorites);
    updateNumFavorites();
}

const updateNumFavorites = () => {
    document.querySelector("#num-favorites").textContent = "Number of favorites: " + favorites.length;
}