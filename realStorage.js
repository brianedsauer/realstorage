"use strict";
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


RealStorage = function(storageArea) {
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
RealStorage.prototype = {

    key: function(index) {
        /*
            (index:ulong) -> String
            STANDARD
            Return the key for the entry at the specified index.

            If index is >= the length of the store, then return null.
        */
        if (index >= this.length) {
            return null;
        }
        else {
            return this.storageArea.key(index);
        }
    },

    getItem: function(key) {
        /*
           (key:String) -> String
           STANDARD
           Return the value stored under the specified key.

           The key is converted to a string before being used to query the
           store.
        */
        return this.storageArea.getItem(String(key));
    },

    setItem: function(key, value) {
        /*
           (key:String, value:String) -> null
           STANDARD
           Set the key to the given value.

           Both key and value are converted to strings before being stored.
        */
        this.storageArea.setItem(String(key), String(value));
    },

    removeItem: function(key) {
        /*
           (key:String) -> null
           STANDARD
           Remove the key and its associated value.

           The key is converted to a string before being used.
        */
        this.storageArea.removeItem(String(key));
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

/*
   ulong
   STANDARD
   The number of keys in the store.
*/
// JSLint complains about ``get length()`` descriptor being invalid syntax.
// ECMA5: Make into a proper descriptor.
RealStorage.prototype.__defineGetter__("length", function() {
        return this.storageArea.length;});


window.realStorage = new RealStorage(localStorage);

})();
