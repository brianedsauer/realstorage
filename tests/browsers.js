module("browser incompatibilities", {teardown: realStorage.clear});

test("toString for null (Firefox 3.5)", function() {
    var key = 42;
    realStorage.setItem(42, null);
    same(realStorage.getItem(42), "null", "null as a value returns \"null\"");
});
