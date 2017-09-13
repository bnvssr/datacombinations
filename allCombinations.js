// allCombinations.js

'use strict'

var Testcase = require('./lib/testcase');

function addNextValueToTestcase(incompleteTestcase, testcases, categories, currentCat) {
  if (currentCat < categories.length - 1) {
    categories[currentCat].value.forEach(function (val) {

      incompleteTestcase[categories[currentCat].name] = val; // 
      addNextValueToTestcase(incompleteTestcase, testcases, categories, currentCat + 1);
    });
    //  else this is the last category
  } else {
    categories[currentCat].value.forEach(function (val) {

      incompleteTestcase[categories[currentCat].name] = val;
      //      incompleteTestcase["inTestcases"] = 0;

      var testdata = {};
      var keys = Object.keys(incompleteTestcase);
      keys.forEach(function (key, index) {
        testdata[key] = incompleteTestcase[key];
      });

      //      var testcase = {
      //        "testcase": testdata
      //      };
      //      testcases.push(testcase);
      testcases.push(testdata);

    });
  }
};

exports.getTestcases = function (categories) {
  var testcases = [];

  var currentCat = 0 //  init,start with first category
  categories[0].value.forEach(function (val) {

    var testcase = {};
    testcase[categories[currentCat].name] = val; // 

    addNextValueToTestcase(testcase, testcases, categories, currentCat + 1);

  });
  return {
    categories: categories,
    testcases: testcases
  };
};
