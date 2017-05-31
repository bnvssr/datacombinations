//  writable and configurable default to false, so these are true constants
function define(name, value) {
  Object.defineProperty(exports, name, {
    value: value,
    enumerable: true
  });
}

define("ALLVALUES", "all values");
define("ALLPAIRS", "all pairs");
define("ALLCOMBINATIONS", "all conmbinbations");
