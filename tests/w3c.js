(function() {

var store = window.localStorage;

module("W3C spec", {teardown: function() {store.clear();}});

test("key for getItem converted to a string", function() {
    var key = 42;
    var value = "nothing";
    store.setItem(key, "nothing");
    same(store.getItem(key), value, "key as a non-string");
    same(store.getItem(key.toString()), value, "key converted to string");
});

test("value for getItem converted to a string (Firefox 3.5 incompatibility)",
    function() {
        var values = [[42, "42"], [null, "null"], [undefined, "undefined"]];
        var key = "42";
        for (var x=0; x < values.length; x+=1) {
            var value = values[x][0];
            var repr = values[x][1];
            store.setItem(key, value);
            same(store.getItem(key), repr,
                 repr + " returned as a string");
        }
    });

// XXX getItem
// XXX setItem
// XXX removeItem
// XXX clear
// XXX length
// XXX key

})();
