# Restructuring for what? #

A long-term goal is to get realStorage working not only with localStorage, but also sessionStorage and Google Gears. And in doing so it will require some restructuring to make sure all of those back-ends get tested properly. The idea would be to expose all three potential realStorage implementations directly and have realStorage itself default to something reasonable for those who don't care whether localStorage or Gears is used.

To wrap both localStorage and sessionStorage, the code should be reworked so as to simply take a Web Storage object and wrap it as needed. It probably would also be best to test the objects to see how they are broken in order to avoid any extra overhead incurred by handling a browser incompatibility.

The non-standard API should be broken out so that it can be shared amongst both the localStorage wrapper and the Gears implementation as the extended API simply uses the Web Storage API.

Finally, the tests should be redone so that they are given the object to test. That allows for having a wrapper around QUnit's test() function that will construct separate tests for each storage object (both the wrapped localStorage and sessionStorage along with the Gears implementation).


# Details #

```
function wrapStorageArea(storageArea) {
  /* After verifying that the storageArea has the expected attributes, construct an object that has the defined realStorage API and hides browser incompatibilities. */
  
  // Verify basic API exists ...
  wrapper = {};
  if (storageArea_has_correct_getItem) {
    function getItem(key) {return storageArea.getItem(key);};
    wrapper.getItem = getItem;
  }
  else {
    function getItemFixed(key) { ... };
    wrapper.getItem = getItemFixed;
  }

  // ...
  return wrapper;
}

// Apply wrapStorageArea to localStorage, sessionStorage if available
realStorage = {};
// XXX Might need to change how detection is done as Firefox 3.5 throws an error at least under QUnit through Firebug when accessing sessionStorage.
if (window.localStorage)
  realStorage.local = wrapStorageArea(window.localStorage);
if (window.sessionStorage)
  realStorage.session = wrapStorageArea(window.sessionStorage);
```