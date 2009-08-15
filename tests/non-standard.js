(function() {

module("non-standard API", {setup: function() {realStorage.clear()}});

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

if (window.JSON !== undefined) {
    test("getJSONObject()/setJSONObject()", function() {
        var key = "key";
        var value = {answer: 42};

        realStorage.setJSONObject(key, value);
        same(realStorage.getJSONObject(key), value,
                "value returned as an Object");
    });

    test("getJSONObject()/setJSONObject() do not coerce", function() {
        var key = "key";
        var value = 42;

        realStorage.setJSONObject(key, value);
        same(realStorage.getJSONObject(key), value,
                "in went a number, out came a number");

        realStorage.setJSONObject(key, String(value));
        same(realStorage.getJSONObject(key), String(value),
                "in went a string, out came a string");
    });
}

})();
