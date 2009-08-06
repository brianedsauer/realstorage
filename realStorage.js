/*
    realStorage -- provide a consistent API for localStorage.
    http://realstorage.googlecode.com/
*/
(function() {

// No need to re-initialize
if (window.realStorage) {
    return;
}

// localStorage is a pre-requisite
if (!window.localStorage) {
    throw new Error("realStorage requires localStorage");
}

realStorage = function() {};

// Object implementing the Storage interface
var store = localStorage;

/*
   Delegates are used over setting the prototype for realStorage because the
   typical implementation of localStorage is through a native object which
   consistently messes up the lookup chain.
*/

/*
   int
   STANDARD
   The number of entries in the store.
*/
// XXX Use a getter when possible
realStorage.length = store.length;


realStorage.key = function(index) {
    /*
        (index:int) -> String
        STANDARD
        Return the key for the entry at the specified index.
    */
    return store.key(index);
};


/*realStorage.keysArray = function() {
    var keys = [];

    for (var x=0; x < realStorage.length; x+=1) {
        keys.push(realStorage.key(x));
    }

    return keys;
};*/


/*realStorage.contains = function(key) {
    return realStorage.getItem(key) !== null;
};*/


realStorage.getItem = function(key) {
    /*
       (key:String) -> String
       STANDARD
       Return the value stored under the specified key.
    */
    return store.getItem(key);
};


realStorage.setItem = function(key, value) {
    /*
       (key:String, value:String) -> null
       STANDARD
       Set the key to the given value.

       Both key and value are converted to strings before being stored.
    */
    store.setItem(key, new String(value));
    realStorage.length = store.length;
};


realStorage.removeItem = function(key) {
    /*
       (key:String) -> null
       STANDARD
       Remove the key and its associated value.
    */
    store.removeItem(key);
    realStorage.length = store.length;
};


realStorage.clear = function() {
    /*
       () -> null
       STANDARD
       Reset the store.
    */
    store.clear();
    realStorage.length = store.length;
};


window.realStorage = realStorage;

})();
