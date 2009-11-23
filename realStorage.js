"use strict";
/*
    realStorage -- provide a consistent API for localStorage.
    http://realstorage.googlecode.com/
*/
(function() {

// No need to re-initialize or bother if localStorage doesn't exist
if (window.realStorage) {
    return;
}


function wrapGears() {

    function dbExecute(sql, args, process) {
        var db = google.gears.factory.create('beta.database');
        db.open('realStorage-db');

        db.execute('CREATE TABLE IF NOT EXISTS realStorage ' +
                   '(key TEXT PRIMARY KEY, value TEXT)');

        var result = db.execute(sql, args);

        var to_return = null;
        if (process !== undefined) {
            to_return = process(result);
        }

        result.close();
        db.close();

        return to_return;
    }

    var storageArea = {
        setItem: function setItem(key, value) {
            dbExecute('INSERT OR REPLACE INTO realStorage VALUES (?, ?)',
                        [String(key), String(value)]);
        },
        
        getItem: function getItem(key) {
            function process(result) {
                if (result.isValidRow()) {
                   return result.field(0);
                }
                
                else {
                    return null;
                }
            }
       
           return dbExecute('SELECT value FROM realStorage WHERE key=?',
                                   [String(key)], process);
        },

        removeItem: function removeItem(key) {
            dbExecute('DELETE FROM realStorage WHERE key=?', [String(key)]);
        },

        getLength: function getLength() {
            function process(result) {
                return result.field(0);
            }

            return dbExecute('SELECT COUNT(*) FROM realStorage', [], process);
        },

        key: function key(index) {
            function process(result) {
                return result.field(0);
            }

            return dbExecute('SELECT key FROM realStorage ' +
                                    'ORDER BY key ASC ' +
                                    'LIMIT 1 OFFSET ?', [index], process);
        },

        clear: function clear() {
            dbExecute('DELETE FROM realStorage');
        }
    };

    storageArea.contains = function contains(key) {
        return storageArea.getItem(key !== null ? key : "null") !== null;
    };

    storageArea.keysArray = function keysArray() {
        var keys_array = [];

        for (var x=0; x < storageArea.getLength(); x+=1) {
            keys_array.push(storageArea.key(x));
        }

        return keys_array;
    };

    storageArea.getObject = function getObject(key) {
        var args = [storageArea.getItem(key !== null ? key : "null")];

        for (var x=1; x < arguments.length; x+=1) {
            args.push(arguments[x]);
        }

        return JSON.parse.apply(null, args);
    };

    storageArea.setObject = function setObject(key, value) {
        var args = [value];

        for (var x=2; x < arguments.length; x+=1) {
            args.push(arguments[x]);
        }

        storageArea.setItem(key !== null ? key : "null",
                            JSON.stringify.apply(null, args));
    };

    return storageArea;
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

        getObject: function getObject(key, jsonArg) {
            /*
               (key:String, [*args]) -> Object

               Return a parsed JSON object stored under the specified key.
            */
            var json = storageArea.getItem(key !== null ? key : "null");

            return JSON.parse(json, jsonArg);
        },

        setObject: function setObject(key, value, jsonArg1, jsonArg2) {
            /*
               (key:String, value: Object, [*args]) -> null

               Store a JSON-compatible object.
            */
            var json = JSON.stringify(value, jsonArg1, jsonArg2);
            storageArea.setItem(key !== null ? key : "null", json);
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

var localWrapped = window.localStorage ?
                    wrapStorageArea(window.localStorage) : undefined;
var sessionWrapped = undefined;
var gearsWrapped = window.google && google.gears ?
                    wrapGears() : undefined;

/* Firefox 3.5 throws an exception when you try to access sessionStorage for a
   page using the file:// protocol */
try {
    if (window.sessionStorage) {
        var sessionWrapped = wrapStorageArea(window.sessionStorage);
    }
} 
catch (exc) {}

// Set default realStorage implementation.
if (localWrapped) {
    window.realStorage = localWrapped;
}
else if (gearsWrapped) {
    window.realStorage = gearsWrapped;
}
else {
    window.realStorage = {};
}

// Bind storage properties.
if (localWrapped !== undefined) {
    window.realStorage.local = localWrapped;
}
if (sessionWrapped !== undefined) {
    window.realStorage.session = sessionWrapped;
}
if (gearsWrapped !== undefined) {
    window.realStorage.gears = gearsWrapped;
}

})();
