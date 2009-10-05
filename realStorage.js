"use strict";
/*
    realStorage -- provide a consistent API for localStorage.
    http://realstorage.googlecode.com/
*/
(function() {

// No need to re-initialize or bother if localStorage doesn't exist
if (window.realStorage || window.localStorage === undefined) {
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
            if (index >= this.length) {
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

               The key is converted to a string before being used to query the
               store.
            */
            return storageArea.getItem(String(key));
        },

        setItem: function setItem(key, value) {
            /*
               (key:String, value:String) -> null

               Set the key to the given value.

               Both key and value are converted to strings before being stored.
            */
            storageArea.setItem(String(key), String(value));
        },

        removeItem: function removeItem(key) {
            /*
               (key:String) -> null

               Remove the key and its associated value.

               The key is converted to a string before being used.
            */
            storageArea.removeItem(String(key));
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
            return wrapper.getItem(key) !== null;
        },

        keysArray: function keysArray() {
            /*
               () -> Array

               Return an array of all keys.
            */
            var keys = [];

            for (var x=0; x < wrapper.length; x+=1) {
                keys.push(localStorage.key(x));
            }

            return keys;
        },

        getJSONObject: function getJSONObject(key) {
            /*
               (key:String, [*args]) -> Object

               Return a parsed JSON object stored under the specified key.
            */
            var args = [wrapper.getItem(key)];

            for (var x=1; x < arguments.length; x+=1) {
                args.push(arguments[x]);
            }

            return JSON.parse.apply(null, args);
        },

        setJSONObject: function setJSONObject(key, value) {
            /*
               (key:String, value: Object, [*args]) -> null

               Store a JSON-compatible object.
            */
            var args = [value];

            for (var x=2; x < arguments.length; x+=1) {
                args.push(arguments[x]);
            }

            storageArea.setItem(String(key), JSON.stringify.apply(null, args));
        }
    };

    /*
       ulong
       STANDARD
       The number of keys in the store.
    */
    // JSLint complains about ``get length()`` descriptor being invalid syntax.
    // ECMA5: Make into a proper descriptor.
    wrapper.__defineGetter__("length", function() {
            return storageArea.length;});

    return wrapper;
}


window.realStorage = wrapStorageArea(window.localStorage);

})();
