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

window.onload = () => {
  console.log("Window onLoad");
  document.querySelector("#favorite-submit-button").onClick = (evt) => {
    submitClicked(evt);
  };
  document.querySelector("#favorite-cancel-button").onClick = clearFormFields;
};

let submitClicked = (evt) => {
  console.log("Submit clicked");

  evt.preventDefault();
  return false;
};

let clearFormFields = (evt) => {
  console.log("Clearing form fields");
  document.querySelector("#favorite-text").value = "";
  document.querySelector("#favorite-url").value = "";
  document.querySelector("#favorite-comments").value = "";
  evt.preventDefault();
  return false;
};