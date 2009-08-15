(function() {

var pesky_keys = [[42, "42"], [null, "null"], [undefined, "undefined"]];

// (At least) Safari 4 throws a fit if teststore.clear is passed directly
module("W3C spec", {setup: function() {teststore.clear();}});

test("setItem() & getItem() work for strings", function() {
    var key = "key";
    var value = "value";

    teststore.setItem(key, value);

    same(teststore.getItem(key), value, "value set is what is gotten");
});


test("getItem() returns null for non-existent keys", function() {
    teststore.clear();

    same(teststore.getItem("any ol' key"), null,
        "null returned for non-existent key");
});

test("key for getItem() converted to a string", function() {

    for (var x in pesky_keys) {
        if (pesky_keys.hasOwnProperty(x)) {
            var value = pesky_keys[x][0];
            var repr = pesky_keys[x][1];

            teststore.setItem(repr, repr);
            same(teststore.getItem(value), repr, repr + " used as a key");
        }
    }
});

test("key/value for setItem() converted to a string "+
     "(Firefox 3.5 incompatibility)", function() {
        var str = "42";

        for (var x in pesky_keys) {
            if (pesky_keys.hasOwnProperty(x)) {
                var value = pesky_keys[x][0];
                var repr = pesky_keys[x][1];
                teststore.setItem(str, value);
                same(teststore.getItem(str), repr,
                     repr + " given as the value");
                teststore.setItem(value, str);
                same(teststore.getItem(repr), str, repr + " set as the key");
            }
        }
    });

test("removeItem() removes items", function() {
    var key = "some key";
    teststore.setItem(key, "42");

    ok(teststore.getItem(key), "key set");

    teststore.removeItem(key);
    same(teststore.getItem(key), null, "key removed");
});

test("removeItem() a no-op if key does not exist", function() {
    teststore.clear();
    teststore.removeItem("some key that doesn't exist");
});

test("removeItem() converts the key to a string", function() {
    for (var x in pesky_keys) {
        if (pesky_keys.hasOwnProperty(x)) {
            var value = pesky_keys[x][0];
            var repr = pesky_keys[x][1];

            teststore.setItem(repr, repr);
            teststore.removeItem(value);
            same(teststore.getItem(repr), null, repr + " removed");
        }
    }
});

test("clear() removes all keys", function() {
    var key1 = "key1";
    var key2 = "key2";
    var value = "42";

    teststore.clear();

    teststore.setItem(key1, value);
    teststore.setItem(key2, value);

    same(teststore.getItem(key1), value, "first key set");
    same(teststore.getItem(key2), value, "second key set");

    teststore.clear();
    same(teststore.getItem(key1), null, "first key gone");
    same(teststore.getItem(key2), null, "second key gone");
});

test("clear() is a no-op if no keys exist", function() {
    teststore.clear();
    teststore.clear();
});

test("length", function() {
    teststore.clear();

    same(teststore.length, 0, "length == 0 after a clear");

    var key = "key";
    teststore.setItem(key, "42");
    same(teststore.length, 1, "length++ after a set")

    teststore.setItem(key, "-13");
    same(teststore.length, 1,
            "length unchanged when changing the value of an existing key");

    teststore.removeItem(key);
    same(teststore.length, 0, "length-- after a removal");

    teststore.setItem(key, "42");
    same(teststore.length, 1, "length++ after another set");
    teststore.clear();
    same(teststore.length, 0, "length == 0 after another clear");
});

test("key() works for all known keys", function() {
    var keys = {key1: "42", key2: "-13", key3: "6"};
    var key_count = 3;

    teststore.clear();
    for (var key in keys) {
        if (keys.hasOwnProperty(key)) {
            teststore.setItem(key, keys[key]);
        }
    }

    for (var x=0; x < teststore.length; x+=1) {
        key = teststore.key(x);
        ok(keys[key], "key returned by key() is valid");
        key_count -= 1;
    }

    same(key_count, 0, "all keys accounted for");
});

test("key() is stable as long as no keys added/removed", function() {
    var keys = {key1: -1, key2: -1, key3: -1};

    teststore.clear();
    for (var key in keys) {
        if (keys.hasOwnProperty(key)) {
            teststore.setItem(key, "42");
        }
    }

    for (var x=0; x < teststore.length; x+=1) {
        keys[teststore.key(x)] = x;
    }

    teststore.setItem("key2", "0");
    for (key in keys) {
        if (keys.hasOwnProperty(key)) {
            same(teststore.key(keys[key]), key, key + " has the same index");
        }
    }
});

test("key() adjusts properly when a key is removed", function() {
    teststore.clear();
    teststore.setItem("key 1", "1");
    teststore.setItem("key 2", "2");
    teststore.setItem("key 3", "3");

    same(teststore.length, 3, "three keys stored");

    var key = teststore.key(1);
    teststore.removeItem(key);
    same(teststore.length, 2, "two keys left");

    ok(teststore.key(1) !== key, "key(1) changed");
});

test("key() returns null when given an index >= the # of keys " +
     "(Firefox 3.5/Safari 4 incompatibility", function() {
    teststore.clear();

    // Specification says nothing about negative values
    var indices = [0, 1];

    for (var x=0; x < indices.length; x+=1) {
        ok(indices[x] >= teststore.length,
            "index " + indices[x] + " >= the # of keys");
        try {
            same(teststore.key(indices[x]), null,
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
