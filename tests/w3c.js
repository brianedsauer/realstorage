(function() {

var pesky_keys = [[42, "42"], [null, "null"], [undefined, "undefined"]];

var store = window.realStorage;

// (At least) Safari 4 throws a fit if store.clear is passed directly
module("W3C spec", {teardown: function() {store.clear();}});

test("setItem/getItem work for strings", function() {
    var key = "key";
    var value = "value";

    store.setItem(key, value);

    same(store.getItem(key), value, "value set is what is gotten");
});


test("getItem returns null for non-existent keys", function() {
    store.clear();

    same(store.getItem("any ol' key"), null,
        "null returned for non-existent key");
});

test("key for getItem converted to a string", function() {

    for (var x=0; x < pesky_keys.length; x+=1) {
        var value = pesky_keys[x][0];
        var repr = pesky_keys[x][1];

        store.setItem(repr, repr);
        same(store.getItem(value), repr, repr + " used as a key");
    }
});

test("key/value for setItem converted to a string (Firefox 3.5 incompatibility)",
    function() {
        var str = "42";

        for (var x=0; x < pesky_keys.length; x+=1) {
            var value = pesky_keys[x][0];
            var repr = pesky_keys[x][1];
            store.setItem(str, value);
            same(store.getItem(str), repr,
                 repr + " given as the value");
            store.setItem(value, str);
            same(store.getItem(repr), str, repr + " set as the key");
        }
    });

test("removeItem removes items", function() {
    var key = "some key";
    store.setItem(key, "42");

    ok(store.getItem(key), "key set");

    store.removeItem(key);
    same(store.getItem(key), null, "key removed");
});

test("removeItem a no-op if key does not exist", function() {
    store.clear();
    store.removeItem("some key that doesn't exist");
});

test("removeItem converts the key to a string", function() {
    for (var x=0; x < pesky_keys.length; x+=1) {
        var value = pesky_keys[x][0];
        var repr = pesky_keys[x][1];

        store.setItem(repr, repr);
        store.removeItem(value);
        same(store.getItem(repr), null, repr + " removed");
    }
});

test("'clear' removes all keys", function() {
    var key1 = "key1";
    var key2 = "key2";
    var value = "42";

    store.clear();

    store.setItem(key1, value);
    store.setItem(key2, value);

    same(store.getItem(key1), value, "first key set");
    same(store.getItem(key2), value, "second key set");

    store.clear();
    same(store.getItem(key1), null, "first key gone");
    same(store.getItem(key2), null, "second key gone");
});

test("'clear' is a no-op if no keys exist", function() {
    store.clear();
    store.clear();
});

test("length", function() {
    store.clear();

    same(store.length, 0, "length == 0 after a clear");

    var key = "key";
    store.setItem(key, "42");
    same(store.length, 1, "length++ after a set")

    store.setItem(key, "-13");
    same(store.length, 1,
            "length unchanged when changing the value of an existing key");

    store.removeItem(key);
    same(store.length, 0, "length-- after a removal");

    store.setItem(key, "42");
    same(store.length, 1, "length++ after another set");
    store.clear();
    same(store.length, 0, "length == 0 after another clear");
});

test("'key' works for all known keys", function() {
    var keys = {key1: "42", key2: "-13", key3: "6"};
    var key_count = 3;

    store.clear();
    for (var key in keys) {
        store.setItem(key, keys[key]);
    }

    for (var x=0; x < store.length; x+=1) {
        key = store.key(x);
        ok(keys[key], "key returned by 'key' is valid");
        key_count -= 1;
    }

    same(key_count, 0, "all keys accounted for");
});

test("'key' stable as long as no keys added/removed", function() {
    var keys = {key1: -1, key2: -1, key3: -1};

    store.clear();
    for (var key in keys) {
        store.setItem(key, "42");
    }

    for (var x=0; x < store.length; x+=1) {
        keys[store.key(x)] = x;
    }

    store.setItem("key2", "0");
    for (key in keys) {
        same(store.key(keys[key]), key, key + " has the same index");
    }
});

test("'key' adjusts properly when a key is removed", function() {
    store.clear();
    store.setItem("key 1", "1");
    store.setItem("key 2", "2");
    store.setItem("key 3", "3");

    same(store.length, 3, "three keys stored");

    var key = store.key(1);
    store.removeItem(key);
    same(store.length, 2, "two keys left");

    ok(store.key(1) !== key, "key(1) changed");
});

test("'key' returns null when given an index >= the # of keys " +
     "(Firefox 3.5/Safari 4 incompatibility", function() {
    store.clear();

    // Specification says nothing about negative values
    var indices = [0, 1];

    for (var x=0; x < indices.length; x+=1) {
        ok(indices[x] >= store.length,
            "index " + indices[x] + " >= the # of keys");
        try {
            same(store.key(indices[x]), null,
                    "null returned for index " + indices[x]);
        }
        catch (e) {
            ok(false, "index " + indices[x] + " triggered an exception: " + e);
        }
    }
});


// XXX setItem (atomic) QUOTA_EXCEEDED_ERR returned if setting failed

// XXX attrs are stored

// XXX storage mutex

// XXX storage event

// XXX initStorageEvent() and initStorageEventNS()
})();
