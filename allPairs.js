// allPairs.js

'use strict'

var Testcase = require('./lib/testcase');
var Pair = require('./lib/pair');

var pair = new Pair("", "", "", "");

function getKeys(categories) {
  var keys = [];
  categories.map(function (category) {
    //      keys.push(category[Object.keys(category)[0]])
    keys.push(category.name);
  });
  return keys;
};

// Starting from one set of values, find values for all 'undefined' values 
function createPairwiseTestcase(pair, keys, pairs) {
  var testcase = new Testcase(keys);

  // enter values of pair
  var key1 = Object.keys(pair)[0];
  testcase.setKeyValuePair(key1, pair[key1]);
  var key2 = Object.keys(pair)[1];
  testcase.setKeyValuePair(key2, pair[key2]);

  // filter out all pairs that are no candidates to complete this testcase
  var candidatePairs = pairs.filter(function (candidate) {

    // no shared categories
    if (typeof candidate[key1] === 'undefined' && typeof candidate[key2] === 'undefined') {
      return true;
    }

    // category key1 shared, check if value matches as well
    if (typeof candidate[key1] !== 'undefined' && typeof candidate[key2] === 'undefined') {
      if (candidate[key1] === pair[key1]) {
        return true;
      }
    }

    // category key2 shared, check if value matches as well
    if (typeof candidate[key2] !== 'undefined' && typeof candidate[key1] === 'undefined') {
      if (candidate[key2] === pair[key2]) {
        return true;
      }
    }
  });

  // get pairs with the least occurrences in testcases in front of array  
  candidatePairs.sort(function (first, second) {
    if (first.getNbrInTestcase() == second.getNbrInTestcase())
      return 0;
    if (first.getNbrInTestcase() < second.getNbrInTestcase())
      return -1;
    else
      return 1;
  });

  // get value for each empty key/value pair
  Object.keys(testcase).map(function (key) {
    // get a value, only if it is empty 
    if (typeof testcase[key] === 'undefined') {
      // get first value available from candidates
      candidatePairs.map(function (candidatePair) {
        if (typeof candidatePair[key] !== 'undefined') {
          testcase[key] = candidatePair[key];
        }
      });
    };
  });

  return testcase;
};

function getPairs(categories) {

  var pairs = [];
  for (var i = 0; i < categories.length; i++) { // outer loop through all categories
    for (var j = 0; j < i; j++) { // inner loop through all 'later' categories
      categories[i].value.forEach(function (val1) { // loop through all values in 'outer loop' category
        categories[j].value.forEach(function (val2) { // loop through all values in 'inner loop' values
          var pair = new Pair(categories[j].name, val2, categories[i].name, val1);
          pairs.push(pair); // save all pairs for crossref pairs <=> testcases
        });
      });
    };
  };

  return pairs;

};

exports.getTestcases = function (categories) {

  //  to be returned, together with categories
  var pairs = [];
  var testcases = [];

  //  get keys for the key/value pairs in a testcase
  var keys = getKeys(categories);

  pairs = getPairs(categories);
  pairs.map(function (pair) {
    // if a pair is not yet in a testcase ==>  create a testcase
    if (pair.getNbrInTestcase() === 0) {
      var testcase = createPairwiseTestcase(pair, keys, pairs);

      // add one to 'inTestcase' attribute for all pairs in testcase
      pair.updateNbrInTestcase(testcase, pairs, 1);

      testcases.push(testcase);
    }
  });

  testcases = testcases.filter(function (testcase) {

    var keepTestcase = false;

    var pairsInTestcase = testcase.getPairsInTestcase();
    pairsInTestcase.map(function (pairInTestcase) {
      pairs.map(function (pair) {
        if (pairInTestcase.value1() === pair.value1() && pairInTestcase.value2() === pair.value2() && pair.getNbrInTestcase() === 1) {
          keepTestcase = true;
        };
      });
    });
    if (!keepTestcase) {
      pair.updateNbrInTestcase(testcase, pairs, -1)
    };
    return keepTestcase;
  });

  return {
    categories: categories,
    testcases: testcases,
    pairs: pairs
  };

};
