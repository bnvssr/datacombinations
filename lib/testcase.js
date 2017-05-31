var Pair = require('./pair');

var Testcase = function (keys) {
  for (var i = 0; i < keys.length; i++) {
    Object.defineProperty(this, keys[i], {
      writable: true,
      enumerable: true,
      configurable: true
    });
  };
};

Testcase.prototype.containsKey = function (key) {
  var contains = false;
  Object.keys(this).map(function (k) {
    if (k === key) {
      contains = true;
    };
  });
  return contains;
};

Testcase.prototype.getPairsInTestcase = function () {
  var testcase = this;
  var pairs = [];
  Object.keys(testcase).map(function (outerKey, outerIndex) {
    Object.keys(testcase).map(function (innerKey, innerIndex) {
      if (innerIndex > outerIndex) {
        var pair = new Pair(outerKey, testcase[outerKey], innerKey, testcase[innerKey]);
        pairs.push(pair);
      };
    });
  });
  return pairs;
};

Testcase.prototype.setKeyValuePair = function (key, value) {
  this[key] = value;
};

module.exports = Testcase;
