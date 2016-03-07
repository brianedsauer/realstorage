Verified browser compatibility:

  * Chrome 4 - 6
  * Firefox 3.5 - 3.6
  * Internet Explorer 8
  * Safari 4 - 5

Library requirements are denote in <font color='sienna'>sienna</font>.
Any additions or changes between versions are denoted in <font color='green'>green</font>.


---


Functions available directly from the `window.realStorage` object delegate to `localStorage` when available, else to a Gears database if provided.



# W3C Web Storage API #

**[W3C Specification](http://dev.w3.org/html5/webstorage/)**. Code up to date as of **[Editor's Draft 8 August 2009](http://dev.w3.org/cvsweb/html5/webstorage/Overview.html?rev=1.58&content-type=text/x-cvsweb-markup)**.


## length ##
`ulong`

<font color='sienna'>Requires <code>Object.__defineGetter__()</code>.</font>

The number of entries in the store.


## key() ##
`(n:ulong) → String`

Returns the key for the nth entry in the store. The index/key association is stable so long as no keys are added or removed. If an index is equal to or greater than `Storage.length`, `null` is returned.


## getItem() ##
`(key:String) → String|null`

Return the value for the given key. The key is coerced to a string before being used to query the store. If the key is not set in the store, `null` is returned.


## setItem() ##
`(key:String, value:String) → null`

Associate the key with the specified value. Both the key and value are coerced to strings before being stored.


## removeItem() ##
`(key:String) → null`

Remove the key (and its value). The key is coerced to a string before attempting removal. Trying to remove a key that is not in the store is a no-op.


## clear() ##
`() → null`

Empty out the store. Emptying an already empty store is a no-op.


---


# Non-Standard API #

## local ##
`Storage`

<font color='sienna'>Requires <code>localStorage</code> to be available.</font>

`localStorage` wrapped by realStorage. If this is available then calling functions off of realStorage directly will delegate to this object.

<font color='green'>New in 2.0.</font>


## session ##
`Storage`

<font color='sienna'>Requires <code>sessionStorage</code> to be available.</font>

`sessionStorage` wrapped by realStorage.

<font color='green'>New in 2.0.</font>

## gears ##
`Storage`

<font color='sienna'>Requires <a href='http://gears.google.com'>Gears</a> to be available.</font>

Wrapping of realStorage for Gears. Creates a `realStorage-db` with a `realStorage` table. if `local` is not defined then function accessed directly off of realStorage delegate to this object.

<font color='green'>New in 2.0.</font>


## getLength() ##
`() → uint`

Return the number of entries in the store. Provided for instances where an accessor cannot be created for the `length` property.

<font color='green'>New in 2.0.</font>


## contains() ##
`(key:String) → Boolean`

Return a boolean representing whether the key exists in the store.

<font color='green'>New in 1.1.</font>


## keysArray() ##
`() → Array`

Return an array containing all keys.

<font color='green'>New in 1.1.</font>


## setObject() ##
`(key:String, value:Object, [*args]) → Object`

<font color='sienna'>Requires JSON.stringify()</font>

Associate with the key with the [JSON](http://www.json.org/)-compatible object key. All arguments beyond `key` and `value` have the same order and meaning as those optional arguments for `JSON.stringify()`.

<font color='green'>Renamed from setJSONObject() in 2.0.</font>
<br>
<font color='green'>New in 1.2.</font>


<h2>getObject()</h2>
<code>(key:String, [*args]) → Object</code>

<font color='sienna'>Requires JSON.parse()</font>

Return the<a href='http://www.json.org/'>JSON</a>-compatible object as stored under the specified key. All arguments beyond <code>key</code> have the same ordering and meaning as those passed to <code>JSON.parse()</code>.<br>
<br>
<font color='green'>Renamed from getJSONObject() in 2.0.</font>
<br>
<font color='green'>New in 1.2.</font>



<h1>Deprecated/Removed</h1>

<h2>storageArea</h2>

<code>Storage</code>

<code>Storage</code> instance wrapped by realStorage.<br>
<br>
<font color='green'>Removed in 2.0.</font>