if (!('indexedDB' in window)) {
    console.log('This browser doesn\'t support IndexedDB');
}

var db;
var dbPromise = indexedDB.open("footballbase", 1);

dbPromise.onupgradeneeded = function (event) {

    var db = event.target.result;
    db.createObjectStore("favoriteClubs");
    db.createObjectStore("followingMatches");
}

dbPromise.onerror = function (evt) {
    console.log("IndexedDB error: " + evt.target.errorCode);
};
