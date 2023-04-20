import { MyBookmark } from "./myBookmark.js";
import { Favorite } from "./favorite.js";

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
  
  favorites[0] = new Favorite();
  favorites[0] = 
    {
      fid: crypto.randomUUID(), // or just hard-code "d2e7e357-1b1f-4eea-b8f9-25af8aa17138"
      text: "RIT", 
      url: "https://www.rit.edu", 
      comments: "A private university located near Rochester, NY."
    };

    console.log(favorites)
};

const submitClicked = (evt) => {
  console.log("Submit clicked");

  evt.preventDefault();
  return false;
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

}