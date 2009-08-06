module("module");

test("module set on window", function() {
    ok(window.realStorage, "window.realStorage exists");
});


test("W3C Storage interface is defined", function() {
    var attrs = ["length", "key", "getItem", "setItem", "removeItem", "clear"];

    for (var x=0; x < attrs.length; x+=1) {
        var attr = attrs[x];

        ok(realStorage[attr] !== undefined, attr + " exists");
    }
});
