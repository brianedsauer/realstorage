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

test("value for setItem converted to a string (Firefox 3.5 incompatibility)",
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

// XXX getItem returns null if key does not exist

// XXX setItem (atomic) QUOTA_EXCEEDED_ERR returned if setting failed

// XXX removeItem (atomic) no-op if key does not exist

// XXX clear (atomic) no-op if empty

// XXX length

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
