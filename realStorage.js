/*
    realStorage -- provide a consistent API for localStorage.
    http://realstorage.googlecode.com/
*/
"use strict";

(function() {

// No need to re-initialize or both if no localStorage
if (window.realStorage || window.localStorage === undefined) {
    return;
}

// Test for browser incompatibilities
compat = (function() {
    var compat = {};
    var x = 0;
    var test_attr = null;

    do {
        test_attr = [" realStorage", x].join('');
    } while (localStorage.getItem(test_attr) !== null);

    /* 
        Is null coerced?

        Firefox 3.5
    */
    localStorage.setItem(test_attr, null);
    compat.coerce_null = localStorage.getItem(test_attr) !== null;

    /*
        Does key(.length) return null?

        Firefox 3.5, Safari 4.0
    */
    try {
        localStorage.key(localStorage.length);
        compat.key_length = true;
    }
    catch (exc) {
        compat.key_length = false;
    }

    // Cleanup
    localStorage.removeItem(test_attr);

    return compat;
})();


/* Compatibility requirements */
if (compat.coerce_null) {
    function getItem(key) {
        return localStorage.getItem(key);
    }

    function setItem(key, value) {
        localStorage.setItem(key, value);
    }

    function removeItem(key) {
        localStorage.removeItem(key);
    }
}
else {
    function getItem(key) {
        return localStorage.getItem(String(key));
    }

    function setItem(key, value) {
        localStorage.setItem(String(key), String(value));
    }

    function removeItem(key) {
        localStorage.removeItem(String(key));
    }
}

if (compat.key_length) {
    function key(index) {
        return localStorage.key(index);
    }
}
else {
    function key(index) {
        if (index >= localStorage.length) {
            return null;
        }
        else {
            return localStorage.key(index);
        }
    }
}


/* Dependent on compatibility changes */
function contains(key) {
    return getItem(key) !== null;
}

function getJSONObject(key) {
    var args = [getItem(key)];

    for (var x=1; x < arguments.length; x+=1) {
        args.push(arguments[x]);
    }

    return JSON.parse.apply(null, args);

}

function setJSONObject(key, value) {
    var args = [value];

    for (var x=2; x < arguments.length; x+=1) {
        args.push(arguments[x]);
    }

    setItem(key, JSON.stringify.apply(null, args));
}


/* No compatibility dependencies */
function clear() {
    return localStorage.clear();
}

function keysArray() {
    var keys = [];

    for (var x=0; x < localStorage.length; x+=1) {
        keys.push(localStorage.key(x));
    }

    return keys;
}


realStorage = {
    // Standard
    getItem: getItem,
    setItem: setItem,
    removeItem: removeItem,
    key: key,
    clear: clear,
    // Extra
    contains: contains,
    keysArray: keysArray,
    getJSONObject: getJSONObject,
    setJSONObject: setJSONObject
};
// Standard
realStorage.__defineGetter__("length", function() {
    return localStorage.length;});


window.realStorage = realStorage;

})();
