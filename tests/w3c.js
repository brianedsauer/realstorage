(function() {

var store = window.localStorage;

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
    var key = 42;
    var repr = "42";
    var value = "nothing";
    store.setItem(repr, value);
    same(store.getItem(key), value, "key given as a non-string");
});

test("key/value for setItem converted to a string (Firefox 3.5 incompatibility)",
    function() {
        var to_test = [[42, "42"], [null, "null"], [undefined, "undefined"]];
        var str = "42";
        for (var x=0; x < to_test.length; x+=1) {
            var value = to_test[x][0];
            var repr = to_test[x][1];
            store.setItem(str, value);
            same(store.getItem(str), repr,
                 repr + " returned as a string value");
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


// XXX setItem (atomic) QUOTA_EXCEEDED_ERR returned if setting failed


/* XXX key
        - stable as long as keys do not change
        - returns null when n > # of keys
*/

// XXX attrs are stored

/* XXX Whenever the properties of a localStorage attribute's Storage object are
   to be examined, returned, set, or deleted, whether as part of a direct
   property access, when checking for the presence of a property, during
   property enumeration, when determining the number of properties present, or
   as part of the execution of any of the methods or attributes defined on the
   Storage interface. the user agent must first obtain the storage mutex. */

/* XXX When the setItem(), removeItem(), and clear() methods are called on a
   Storage object x that is associated with a local storage area, if the
   methods did something, then in every HTMLDocument object whose Window
   object's localStorage attribute's Storage object is associated with the same
   storage area, other than x, a storage event must be fired */

/* XXX If the event is being fired due to an invocation of the setItem() or
   removeItem() methods, the event must have its key attribute set to the name
   of the key in question, its oldValue attribute set to the old value of the
   key in question, or null if the key is newly added, and its newValue
   attribute set to the new value of the key in question, or null if the key
   was removed.

    Otherwise, if the event is being fired due to an invocation of the clear()
    method, the event must have its key, oldValue, and newValue attributes set to
    null.

    In addition, the event must have its url attribute set to the address of the
    document whose Storage object was affected; its source attribute set to the
    that document's browsing context's WindowProxy object, if the two documents are
    in the same unit of related browsing contexts, or null otherwise; and its
    storageArea attribute set to the Storage object from the Window object of the
    target Document that represents the same kind of Storage area as was affected
    (i.e. session or local) */   

/* XXX The initStorageEvent() and initStorageEventNS() methods must initialize
   the event in a manner analogous to the similarly-named methods in the DOM3
   Events interfaces. */
})();
