(function() {

var reset = function() {realStorage.clear()};

module("non-standard API", {setup: reset, teardown: reset});

test("contains()", function() {
    var key = "key";

    realStorage.setItem(key, "42");
    ok(realStorage.contains(key), "true for existing key");
    ok(!realStorage.contains(key + "bad"), "false for non-existent key");
});

test("contains() returns true for a value of null", function() {
    var key = "key";

    realStorage.setItem(key, null);
    ok(realStorage.contains(key),
        "'null' as a value for an existing key is OK");
});


test("keysArray()", function() {
    var keys_array = realStorage.keysArray();

    same(keys_array, [], "empty store returns an empty array");

    var keys = {"a": "a", "b": "b", "c": "c"};

    for (var x in keys) {
        if (keys.hasOwnProperty(x)) {
            realStorage.setItem(x, x);
        }
    }

    var keys_array = realStorage.keysArray();
    var found_keys = {};
    
    for (x=0; x < keys_array.length; x+=1) {
        var key = keys_array[x];
        found_keys[key] = key;
    }

    same(found_keys, keys, "all keys returned in array");
});

})();
