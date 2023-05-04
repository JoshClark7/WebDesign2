import * as map from "./map.js";
import * as ajax from "./ajax.js";
import "./appHeader.js";
import "./appFooter.js";
import * as storage from "./storage.js";

// I. Variables & constants
// NB - it's easy to get [longitude,latitude] coordinates with this tool: http://geojson.io/
const lnglatNYS = [-75.71615970715911, 43.025810763917775];
const lnglatUSA = [-98.5696, 39.8282];
let geojson;
let favoriteIds = [];
let currentParkId;


// II. Functions
const setupUI = () => {
    document.querySelector("#btn1").onclick = () => {
        console.log("Button 1");
        map.setZoomLevel(5.2);
        map.setPitchAndBearing(0, 0);
        map.flyTo(lnglatNYS);
    };

    document.querySelector("#btn2").onclick = () => {
        map.setZoomLevel(5.5);
        map.setPitchAndBearing(45, 0);
        map.flyTo(lnglatNYS);
    };

    document.querySelector("#btn3").onclick = () => {
        map.setZoomLevel(3);
        map.setPitchAndBearing(0, 0);
        map.flyTo(lnglatUSA);
    };

    document.querySelector("#favorite-button").onclick = () => {
        addToFavorites(currentParkId);
    };

    document.querySelector("#delete-button").onclick = () => {
        deleteFavorite(currentParkId);
    };

    document.querySelector("#favorite-button").style.visibility = "hidden";
    document.querySelector("#delete-button").style.visibility = "hidden";
}

const init = () => {
    map.initMap(lnglatNYS);
    ajax.downloadFile("data/parks.geojson", (str) => {
        geojson = JSON.parse(str);
        console.log(geojson);
        map.addMarkersToMap(geojson, showFeatureDetails);
        setupUI();
        favoriteIds = storage.getFavorites();
        refreshFavorites();
    });
};

const showFeatureDetails = (id) => {
    console.log(`showFeatureDetails - id=${id}`);
    currentParkId = id;
    const feature = getFeatureById(id);
    document.querySelector("#details-1").innerHTML = `Info for ${feature.properties.title}`;
    document.querySelector("#details-2").innerHTML = `
	<p><b>Address: </b>${feature.properties.title}</p>
	<p><b>Website: </b><a href=tel:${feature.properties.phone}>${feature.properties.phone}</a></p>
	<p><b>Website: </b><a href=${feature.properties.url}>${feature.properties.url}</a></p>`;
    document.querySelector("#details-3").innerHTML = `${feature.properties.description}`;
    let favBtn = document.querySelector("#favorite-button");
    let delBtn = document.querySelector("#delete-button");
    favBtn.style.visibility = "visible";
    delBtn.style.visibility = "visible";

    favBtn.disabled = false;
    delBtn.disabled = true;
    for (const favId of favoriteIds) {
        if (favId == id) {
            favBtn.disabled = true;
            delBtn.disabled = false;
        }
    }
};

const getFeatureById = (id) => {
    for (const feature of geojson.features) {
        if (feature.id == id) {
            return feature;
        }
    }
};

const refreshFavorites = () => {
    const favoritesContainer = document.querySelector("#favorites-list");
    favoritesContainer.innerHTML = "";
    for (const id of favoriteIds) {
        favoritesContainer.appendChild(createFavoriteElement(id));
    }
};

const createFavoriteElement = (id) => {
    const feature = getFeatureById(id);
    const a = document.createElement("a");
    a.className = "panel-block";
    a.id = feature.id;
    a.onclick = () => {
        showFeatureDetails(a.id);
        map.setZoomLevel(6);
        map.flyTo(feature.geometry.coordinates);
    };
    a.innerHTML = `
	<span class="panel-icon">
		<i class="fas fa-map-pin"></i>
	</span>
	${feature.properties.title}
	`;

    return a;
};

const addToFavorites = (id) => {
    if (favoriteIds.indexOf(id) == -1) {
        favoriteIds[favoriteIds.length] = id;
        refreshFavorites();
        showFeatureDetails(id);
        storage.setFavorites(favoriteIds);
    }
};

const deleteFavorite = (id) => {
    favoriteIds.splice(favoriteIds.indexOf(id), 1);
    refreshFavorites();
    showFeatureDetails(id);
    storage.setFavorites(favoriteIds);
};

init();