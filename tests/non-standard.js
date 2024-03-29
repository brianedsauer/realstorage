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
    storageTest("getObject()/setObject()", function(store) {
        var key = "some key";
        var value = {answer: 42};

        store.setObject(key, value);
        same(store.getObject(key), value,
                "value returned as an Object");
    });

    storageTest("getObject()/setObject() do not coerce",
            function(store) {
        var key = "some key";
        var value = 42;

        store.setObject(key, value);
        same(store.getObject(key), value,
                "in went a number, out came a number");

        store.setObject(key, String(value));
        same(store.getObject(key), String(value),
                "in went a string, out came a string");
    });

    storageTest("optional arguments to setObject()", function(store) {
        var key = "some key";
        var value = {yes: true, no: false};
        var whitelist = ["yes"];
        var expect = {yes: true};

        store.setObject(key, value, whitelist);
        same(store.getObject(key), expect,
                "second argument passed through to JSON.stringify()");

        /* Hard to test the third argument as Safari 4 and Firefox 3.5 disagree
           on its usage. */
    });

    storageTest("optional arguments to getObject()", function(store) {
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

        store.setObject(key, value);
        same(store.getObject(key, doubleValue), expect,
                "second argument passed through to JSON.parse()");
    });

storageTest("getLength()", function(store) {
    store.clear();

    same(store.getLength(), 0, "length == 0 after a clear");

    var key = "some key";
    store.setItem(key, "42");
    same(store.getLength(), 1, "length++ after a set")

    store.setItem(key, "-13");
    same(store.getLength(), 1,
            "length unchanged when changing the value of an existing key");

    store.removeItem(key);
    same(store.getLength(), 0, "length-- after a removal");

    store.setItem(key, "42");
    same(store.getLength(), 1, "length++ after another set");
    store.clear();
    same(store.getLength(), 0, "length == 0 after another clear");
});}

})();
