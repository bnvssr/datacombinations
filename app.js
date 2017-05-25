  var express = require('express');
  var path = require('path');
  var bodyParser = require('body-parser');
  var app = express();
  var jsonfile = require('jsonfile');

  var port = process.env.PORT || 3000;
  app.use('/assets', express.static(__dirname + '/public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.set('view engine', 'ejs');

  var jsonParser = bodyParser.json();

  var data = path.normalize(__dirname) + '/data/testdata2.json'

  // Pair constructor
  function Pair(key1, value1, key2, value2) {

    Object.defineProperty(this, key1, {
      writable: true,
      enumerable: true,
      configurable: true
    });
    this[key1] = value1

    Object.defineProperty(this, key2, {
      writable: true,
      enumerable: true,
      configurable: true,
    });
    this[key2] = value2

    this["inTestcase"] = 0;

  };

  // Testcase constructor
  function Testcase(categories) {
    for (var i = 0; i < categories.length; i++) {
      Object.defineProperty(this, categories[i], {
        writable: true,
        enumerable: true,
        configurable: true
      });
    };
  };

  // 
  function getPairsFromTestcase(testcase) {
    var pairs = [];
    return pairs
  }

  // Starting from one set of values, find values for all 'undefined' values 
  function createPairwiseTestcase(pair, keys, pairs) {
    var testcase = new Testcase(keys);
    var key1 = Object.keys(pair)[0];
    var key2 = Object.keys(pair)[1];

    // enter values of pair
    testcase[key1] = pair[key1];
    testcase[key2] = pair[key2];

    // get lost of all pairs that are no candidates to complete this testcase
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
      if (first["inTestcase"] == second["inTestcase"])
        return 0;
      if (first["inTestcase"] < second["inTestcase"])
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

  function updateInTestcases(testcase, pairs) {
    var pairsInTestcase = [];
    Object.keys(testcase).map(function (outerKey, outerIndex) {
      Object.keys(testcase).map(function (innerKey, innerIndex) {
        if (innerIndex > outerIndex) {
          pairsInTestcase.push(new Pair(outerKey, testcase[outerKey], innerKey, testcase[innerKey]));
        }
      });
    });

    pairs.map(function (pair) {
      pairsInTestcase.map(function (pairInTestcase) {
        var key1 = Object.keys(pairInTestcase)[0];
        var key2 = Object.keys(pairInTestcase)[1];
        if (pair[key1] === pairInTestcase[key1] && pair[key2] === pairInTestcase[key2]) {
          pair["inTestcase"] += 1;
        }
      });
    });
  };

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
        incompleteTestcase["inTestcases"] = 0;

        var testcase = {};
        var keys = Object.keys(incompleteTestcase);
        keys.forEach(function (key, index) {
          testcase[key] = incompleteTestcase[key];
        });
        testcases.push(testcase);
      });
    }
  };

  app.get('/testdata', function (req, res) {
    res.sendFile(path.normalize(data))
  });

  app.post('/tst/strength1', jsonParser, function (req, res) {

    // determine max number of values
    var nbrTestcases = [];
    req.body.categories.forEach(function (category) {
      nbrTestcases.push(category.value.length);
    });

    for (i = 0; i < Math.max.apply(null, nbrTestcases); i++) {
      var testcase = {};
      for (j = 0; j < req.body.categories.length; j++) {

        x = (i + 1) % req.body.categories[j].value.length;
        if (x === 0) {
          x = req.body.categories[j].value.length;
        }

        testcase[req.body.categories[j].name] = req.body.categories[j].value[x - 1];
      };
      req.body.testcases.push(testcase);
    };

    res.render('visual', {
      testdata: req.body
    });
  });

  app.post('/tst/strength2--', jsonParser, function (req, res) {
    var een = req.body.categories[0];
    var twee = req.body.categories[1];
    var drie = req.body.categories[2];

    var i = 0;

    function getNext(ar) {
      i++;
      return ar.value[(i - 1) % ar.value.length];
    };

    /*
    alle paren van categorie een en twee
    */

    var pairs = [];
    req.body["pairs"] = pairs

    een.value.forEach(function (val1) {
      twee.value.forEach(function (val2) {
        var pair = {};
        pair[een.name] = val1;
        pair[twee.name] = val2;
        req.body.testcases.push(pair); // testcases with values of 'een' en 'twee'

        var pair2 = {};
        pair2[een.name] = val1;
        pair2[twee.name] = val2;
        req.body.pairs.push(pair2); // save all pairs for crossref pairs <=> testcases

      });
    });

    /*
    alle paren van alle drie de categorien
    */

    if (typeof drie !== 'undefined') {

      var allPairs = [];

      // alle paren van een en drie
      een.value.forEach(function (val1) {
        drie.value.forEach(function (val3) {
          var pair = {};
          pair[een.name] = val1;
          pair[drie.name] = val3;
          allPairs.push(pair); // all pairs that need to be added to the testcases
          req.body.pairs.push(pair); // save all pairs for crossref pairs <=> testcases
        });
      });

      // alle paren van twee en drie
      twee.value.forEach(function (val2) {
        drie.value.forEach(function (val3) {
          var pair = {};
          pair[twee.name] = val2;
          pair[drie.name] = val3;
          allPairs.push(pair); // all pairs that need to be added to the testcases
          req.body.pairs.push(pair); // save all pairs for crossref pairs <=> testcases
        });
      });

      //    breid de bestaande testgevallen uit met een derde waarde

      req.body.testcases.map(function (testcase) {
        testcase[drie.name] = getNext(drie);
        return testcase;
      });

      // verwijder alle paren die in de testgevallen aanwezig zijn
      var remainingPairs = allPairs.filter(function (pair) {
        var key1 = Object.keys(pair)[0];
        var key2 = Object.keys(pair)[1];

        var bool = false;
        req.body.testcases.forEach(function (testcase) {
          if (testcase[key1] === pair[key1] && testcase[key2] === pair[key2]) {
            bool = true;
          };
        });
        return !bool;
      });
    }

    res.render('visual', {
      testdata: req.body
    });
  });

  app.post('/tst/strength2', jsonParser, function (req, res) {

    // create array with names of categories
    var keys = [];
    req.body.categories.map(function (category) {
      keys.push(category[Object.keys(category)[0]]);
    });

    // create all possible 'combinations of two'
    var pairs = [];
    for (i = 0; i < req.body.categories.length; i++) { // outer loop through all categories
      for (j = 0; j < i; j++) { // inner loop through all 'later' categories
        req.body.categories[i].value.forEach(function (val1) { // loop through all values in 'outer loop' category
          req.body.categories[j].value.forEach(function (val2) { // loop through all values in 'inner loop' values
            var pair = new Pair(req.body.categories[j].name, val2, req.body.categories[i].name, val1);
            pairs.push(pair); // save all pairs for crossref pairs <=> testcases
          });
        });
      };
    };

    // create testcases
    var testcases = [];
    pairs.map(function (pair) {
      if (pair["inTestcase"] === 0) { // pair not yet in a testcase
        var testcase = createPairwiseTestcase(pair, keys, pairs);
        updateInTestcases(testcase, pairs);
        testcases.push(testcase);
      }
    });

    req.body["testcases"] = testcases;
    req.body["pairs"] = pairs;

    res.render('visual', {
      testdata: req.body
    });

  });

  app.post('/tst/strength2-2', jsonParser, function (req, res) {

    // create first set of test cases from first two categories
    var pairsForRendering = [];
    req.body["pairs"] = pairsForRendering

    // loop through cat-0 and cat-1, create all possible pairs
    //  add pairs to req.body.testcases and req.body.pairs
    req.body.categories[0].value.forEach(function (val1) {
      req.body.categories[1].value.forEach(function (val2) {
        // create initial set of test cases, each test case with two values
        var pair = {};
        pair[req.body.categories[0].name] = val1;
        pair[req.body.categories[1].name] = val2;
        req.body.testcases.push(pair); // testcases with values of 'een' en 'twee'

        // rendering will need all pairs
        var pair2 = {};
        pair2[req.body.categories[0].name] = val1;
        pair2[req.body.categories[1].name] = val2;
        pair2["inTestcase"] = 1; // number of times this pair is included in a test case
        req.body.pairs.push(pair2); // save all pairs for crossref pairs <=> testcases
      });
    });

    // starting with third category, extend testcases with an extra category
    for (i = 2; i < req.body.categories.length; i += 1) {

      // create all possibe pairs of 'already in' categories with the 'extra' category
      // i indexes the extra category, j the 'allready-in' category, array pairs contains the new pairs
      var pairs = [];
      for (j = 0; j < i; j++) {
        req.body.categories[i].value.forEach(function (val1) {
          req.body.categories[j].value.forEach(function (val2) {
            var pair = {};
            pair[req.body.categories[j].name] = val2;
            pair[req.body.categories[i].name] = val1;
            pairs.push(pair); // testcases with values of 'previous' and 'extra'   

            var pair = {};
            pair[req.body.categories[j].name] = val2;
            pair[req.body.categories[i].name] = val1;
            pair["inTestcase"] = 0; // not yet in any testcase          
            req.body.pairs.push(pair); // save all pairs for crossref pairs <=> testcases
          });
        });
      };

      //  extend every testcase with a new value
      req.body.testcases.map(function (testcase, tcNbr) {

        //  get all new pairs (array candidatePairs) that can complete the testcase with a third value
        var candidatePairs = pairs.filter(function (pair) {
          pairKey = Object.keys(pair)[0];
          if (testcase[pairKey] === pair[pairKey]) {
            return pair;
          };
        });

        //  get the number of times a pair is already in a testcase from the matching pair from req.body 
        candidatePairswithNumbers = candidatePairs.map(function (candidatePair) {
          // get the matching pair in req.body
          var bodyPair = req.body.pairs.filter(function (pair, index) {
            var key0OfKeyValuePairInBody = Object.keys(pair)[0];
            var value0OfKeyValuePairInBody = pair[key0OfKeyValuePairInBody];

            var key1OfKeyValuePairInBody = Object.keys(pair)[1];
            var value1OfKeyValuePairInBody = pair[key1OfKeyValuePairInBody];

            //  if the bodyPair has the same keys as the candidatePair
            if (typeof key0OfKeyValuePairInBody !== 'undefined' && typeof key1OfKeyValuePairInBody !== 'undefined') {
              //  and the values of the keys match as well 
              if (pair[key0OfKeyValuePairInBody] === candidatePair[key0OfKeyValuePairInBody] && pair[key1OfKeyValuePairInBody] === candidatePair[key1OfKeyValuePairInBody]) {
                return pair
              };
            };
          });

          candidatePair["inTestcase"] = bodyPair[0]["inTestcase"];
          return candidatePair;
        });

        //  get the candidate with the lowest number, to complete the testcase
        //        var testcasePair = candidatePairswithNumbers.sort(function (first, second) {
        candidatePairswithNumbers.sort(function (first, second) {
          if (first["inTestcase"] == second["inTestcase"])
            return 0;
          if (first["inTestcase"] < second["inTestcase"])
            return -1;
          else
            return 1;
        });
        //       })[0];

        var testcasePair = candidatePairswithNumbers[0];

        //  add value to current testcase
        testcase[Object.keys(testcasePair)[1]] = testcasePair[Object.keys(testcasePair)[1]];

        //  update the numbers in req.body.pairs
        //  1. get array with pairs-with-new-value
        var pairsInTestcase = []
        var newKey = Object.keys(testcasePair)[1];
        Object.keys(testcase).forEach(function (key) {
          if (key !== newKey) {
            var pair = {};
            pair[key] = testcase[key];
            pair[newKey] = testcase[newKey];
            pairsInTestcase.push(pair);
          };
        });

        // 2. update 'number in testcase'
        req.body.pairs.map(function (pair) {
          pairsInTestcase.map(function (pairInTestcase) {
            var key1 = Object.keys(pairInTestcase)[0];
            var key2 = Object.keys(pairInTestcase)[1];
            if (pair[key1] === pairInTestcase[key1] && pair[key2] === pairInTestcase[key2]) {
              pair["inTestcase"] += 1;
            }
          });
        });
      });
    };

    res.render('visual', {
      testdata: req.body
    });
  });

  app.post('/tst/strengthN', jsonParser, function (req, res) {

    var testcases = [];
    var currentCat = 0 //  init,start with first category
    req.body.categories[0].value.forEach(function (val) {

      var testcase = {};
      testcase[req.body.categories[currentCat].name] = val; // 

      addNextValueToTestcase(testcase, testcases, req.body.categories, currentCat + 1);

    });

    req.body["testcases"] = testcases;

    res.render('visual', {
      testdata: req.body
    });

  });

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get('/visual', function (req, res) {
    jsonfile.readFile(data, function (err, tdata) {
      if (err !== null) {} else {
        res.render('visual', {
          testdata: tdata
        });
      };
    });
  });

  app.listen(port);
