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


wrapStorage = function(storageArea) {
    /*
        Constructor for wrapping a Storage interface.
    */
    this.storageArea = storageArea;
};


/*
    Must use a delegate for every function as localStorage and friends are
    implemented using native code which means there is no prototype to inherit
    from.
*/
wrapStorage.prototype = {

    get length() {
        /*
           int
           STANDARD
           The number of entries in the store.
        */
        return this.storageArea.length;
    },

    key: function(index) {
        /*
            (index:int) -> String
            STANDARD
            Return the key for the entry at the specified index.
        */
        return this.storageArea.key(index);
    },

    getItem: function(key) {
        /*
           (key:String) -> String
           STANDARD
           Return the value stored under the specified key.
        */
        return this.storageArea.getItem(key);
    },

    setItem: function(key, value) {
        /*
           (key:String, value:String) -> null
           STANDARD
           Set the key to the given value.

           Both key and value are converted to strings before being stored.
        */
        var key_str = new String(key);
        var value_str = new String(value);
        this.storageArea.setItem(key_str, value_str);
    },

    removeItem: function(key) {
        /*
           (key:String) -> null
           STANDARD
           Remove the key and its associated value.
        */
        this.storageArea.removeItem(key);
    },

    clear: function() {
        /*
           () -> null
           STANDARD
           Reset the store.
        */
        this.storageArea.clear();
    }
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

window.realStorage = new wrapStorage(localStorage);

})();
