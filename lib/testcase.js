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

module.exports = Testcase;
