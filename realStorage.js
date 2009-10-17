"use strict";
/*
    realStorage -- provide a consistent API for localStorage.
    http://realstorage.googlecode.com/
*/
(function() {

// No need to re-initialize or bother if localStorage doesn't exist
if (window.realStorage || !window.localStorage) {
    return;
}


function wrapStorageArea(storageArea) {

    var wrapper = {

        key: function key(index) {
            /*
                (index:ulong) -> String

                Return the key for the entry at the specified index.

                If index is >= the length of the store, then return null.
            */
            if (index >= storageArea.length) {
                return null;
            }
            else {
                return storageArea.key(index);
            }
        },

        getItem: function getItem(key) {
            /*
               (key:String) -> String

               Return the value stored under the specified key.

               The key is coerced to a string before being used to query the
               store.
            */
            // Firefox 3.5 does not coerce null
            return storageArea.getItem(key !== null ? key : "null");
        },

        setItem: function setItem(key, value) {
            /*
               (key:String, value:String) -> null

               Set the key to the given value.

               Both key and value are converted to strings before being stored.
            */
            // Firefox 3.5 does not coerce null
            storageArea.setItem(key !== null ? key : "null",
                                value !== null ? value : "null");
        },

        removeItem: function removeItem(key) {
            /*
               (key:String) -> null

               Remove the key and its associated value.

               The key is converted to a string before being used.
            */
            // Firefox 3.5 does not coerce null
            storageArea.removeItem(key !== null ? key : "null");
        },

        clear: function clear() {
            /*
               () -> null

               Reset the store.
            */
            storageArea.clear();
        },

        /* NON-STANDARD */

        contains: function contains(key) {
            /*
               (key:String) -> Boolean

               Return true/false based on whether the key exists in the store.
            */
            // Firefox 3.5 does not coerce null
            return storageArea.getItem(key !== null ? key : "null") !== null;
        },

        keysArray: function keysArray() {
            /*
               () -> Array

               Return an array of all keys.
            */
            var keys_array = [];

            for (var x=0; x < storageArea.length; x+=1) {
                keys_array.push(storageArea.key(x));
            }

            return keys_array;
        },

        getObject: function getObject(key) {
            /*
               (key:String, [*args]) -> Object

               Return a parsed JSON object stored under the specified key.
            */
            var args = [storageArea.getItem(key !== null ? key : "null")];

            for (var x=1; x < arguments.length; x+=1) {
                args.push(arguments[x]);
            }

            return JSON.parse.apply(null, args);
        },

        setObject: function setObject(key, value) {
            /*
               (key:String, value: Object, [*args]) -> null

               Store a JSON-compatible object.
            */
            var args = [value];

            for (var x=2; x < arguments.length; x+=1) {
                args.push(arguments[x]);
            }

            storageArea.setItem(key !== null ? key : "null",
                                JSON.stringify.apply(null, args));
        },
        getLength: function getLength() {
            return storageArea.length;
        }
    };

    /*
       ulong
       STANDARD
       The number of keys in the store.
    */
    if (wrapper.__defineGetter__) {
        wrapper.__defineGetter__("length", function() {
                return storageArea.length;
        });
    }

    return wrapper;
}


if (window.localStorage) {
    window.realStorage = wrapStorageArea(window.localStorage);
    window.realStorage.local = window.realStorage;
}
else {
    window.realStorage = {};
}
/* Firefox 3.5 throws an exception when you try to access sessionStorage for a
   page using the file:// protocol */
try {
    if (window.sessionStorage) {
        window.realStorage.session = wrapStorageArea(window.sessionStorage);
    }
} 
catch (exc) {}

})();
