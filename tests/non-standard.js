(function() {

module("non-standard API");

storageTest("contains()", function(store) {
    var key = "some key";

    store.setItem(key, "42");
    ok(store.contains(key), "true for existing key");
    ok(!store.contains(key + "bad"), "false for non-existent key");
});

storageTest("contains() returns true for a value of null", function(store) {
    var key = "some key";

    store.setItem(key, null);
    ok(store.contains(key),
        "'null' as a value for an existing key is OK");
});

storageTest("keysArray()", function(store) {
    store.clear();

    var keys_array = store.keysArray();

    same(keys_array, [], "empty store returns an empty array");

    var keys = {"a": "a", "b": "b", "c": "c"};

    for (var x in keys) {
        if (keys.hasOwnProperty(x)) {
            store.setItem(x, x);
        }
    }

    var keys_array = store.keysArray();
    var found_keys = {};

    for (x=0; x < keys_array.length; x+=1) {
        var key = keys_array[x];
        found_keys[key] = key;
    }

    same(found_keys, keys, "all keys returned in array");
});

if (window.JSON !== undefined) {
    storageTest("getJSONObject()/setJSONObject()", function(store) {
        var key = "some key";
        var value = {answer: 42};

        store.setJSONObject(key, value);
        same(store.getJSONObject(key), value,
                "value returned as an Object");
    });

    storageTest("getJSONObject()/setJSONObject() do not coerce",
            function(store) {
        var key = "some key";
        var value = 42;

        store.setJSONObject(key, value);
        same(store.getJSONObject(key), value,
                "in went a number, out came a number");

        store.setJSONObject(key, String(value));
        same(store.getJSONObject(key), String(value),
                "in went a string, out came a string");
    });

    storageTest("optional arguments to setJSONObject()", function(store) {
        var key = "some key";
        var value = {yes: true, no: false};
        var whitelist = ["yes"];
        var expect = {yes: true};

        store.setJSONObject(key, value, whitelist);
        same(store.getJSONObject(key), expect,
                "second argument passed through to JSON.stringify()");

        /* Hard to test the third argument as Safari 4 and Firefox 3.5 disagree
           on its usage. */
    });

    storageTest("optional arguments to getJSONObject()", function(store) {
        var doubleValue = function(key, value) {
            if ((typeof value) === (typeof 42)) {
                return value * 2;
            }
            else {
                return value;
            }
        };
        var key = "some key";
        var value = {1: 1, 2: 2, 3: 3};
        var expect = {1: 2, 2: 4, 3: 6};

        store.setJSONObject(key, value);
        same(store.getJSONObject(key, doubleValue), expect,
                "second argument passed through to JSON.parse()");
    });
}

})();
