// allValues.js

'use strict'

var Testcase = require('./lib/testcase');

// determine max number of values
function getNbrOfTestcases(categories) {
  var catLength = [];
  categories.forEach(function (category) {
    catLength.push(category.value.length);
  });
  return Math.max.apply(null, catLength)
};

exports.getTestcases = function (categories) {
  var testcases = [];

  var nbrOfTestcases = getNbrOfTestcases(categories);
  for (i = 0; i < nbrOfTestcases; i++) {
    var testcase = {};
    for (j = 0; j < categories.length; j++) {

      x = (i + 1) % categories[j].value.length;
      if (x === 0) {
        x = categories[j].value.length;
      }

      testcase[categories[j].name] = categories[j].value[x - 1];
    };
    testcases.push(testcase);
  };

  return {
    categories: categories,
    testcases: testcases
  };
};
