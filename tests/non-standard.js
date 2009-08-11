(function() {

var reset = function() {realStorage.clear()};

module("non-standard API", {setup: reset, teardown: reset});

test("'contains'", function() {
    var key = "key";

    realStorage.setItem(key, "42");
    ok(realStorage.contains(key), "true for existing key");
    ok(!realStorage.contains(key + "bad"), "false for non-existent key");
});

test("'contains' returns true for a value of null", function() {
    var key = "key";

    realStorage.setItem(key, null);
    ok(realStorage.contains(key),
        "'null' as a value for an existing key is OK");
});

})();
