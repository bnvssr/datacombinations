  var express = require('express');
  var path = require('path');
  var bodyParser = require('body-parser');
  var app = express();
  var jsonfile = require('jsonfile');

  var Pair = require('./lib/pair');
  var Testcase = require('./lib/testcase');
  var allValues = require('./allValues');
  var allPairs = require('./allPairs');
  var allCombinations = require('./allCombinations');
  var constants = require('./lib/const')

  var port = process.env.PORT || 3000;
  app.use('/assets', express.static(__dirname + '/public'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({
    extended: true
  }));
  app.set('view engine', 'ejs');

  var jsonParser = bodyParser.json();

  ///////////////////////////////////
  // testcase.js

  //  var Pair = require('./pair');

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

  //  module.exports = Testcase;

  ////////////////////////////////
  // pair.js

  //  var Testcase = require('./Testcase');

  var Pair = function (key1, value1, key2, value2) {

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

  Pair.prototype.getNbrInTestcase = function () {
    return this.inTestcase;
  };

  Pair.prototype.setNbrInTestcase = function (nbr) {
    this.inTestcase += nbr;
  };

  Pair.prototype.key1 = function () {
    return Object.keys(this)[0];
  };

  Pair.prototype.value1 = function () {
    return this[Object.keys(this)[0]];
  };

  Pair.prototype.key2 = function () {
    return Object.keys(this)[1];
  };

  Pair.prototype.value2 = function () {
    return this[Object.keys(this)[1]];
  };

  Pair.prototype.updateNbrInTestcase = function (testcase, pairs, nbr) {

    var pairsInTestcase = testcase.getPairsInTestcase();

    pairs.map(function (pair) {
      pairsInTestcase.map(function (pairInTestcase) {
        if (pair.value1() === pairInTestcase.value1() && pair.value2() === pairInTestcase.value2()) {
          pair.setNbrInTestcase(nbr);
        }
      });
    });
  };

  //  module.exports = Pair;

  //////////////////////////////////

  var data = path.normalize(__dirname) + '/data/testdata2.json'
  app.get('/', function (req, res) {
    res.render('index');
  });

  app.post('/tst/allValues', jsonParser, function (req, res) {

    let {
      categories,
      testcases
    } = allValues.getTestcases(req.body.categories);

    req.body.testcases = testcases;
    res.render('visual', {
      testdata: req.body
    });
  });

  app.post('/tst/allValues/dataOnly', jsonParser, function (req, res) {

    let {
      categories,
      testcases
    } = allValues.getTestcases(req.body.categories);

    res.json([categories, testcases]);
  });

  app.post('/tst/allPairs', jsonParser, function (req, res) {

    let {
      categories,
      testcases,
      pairs
    } = allPairs.getTestcases(req.body.categories);
    var returnObject = allPairs.getTestcases(req.body.categories);

    req.body["testcases"] = testcases;
    req.body["pairs"] = pairs;

    res.render('visual', {
      testdata: req.body
    });

  });

  app.post('/tst/allPairs/dataOnly', jsonParser, function (req, res) {

    let {
      categories,
      testcases,
      pairs
    } = allPairs.getTestcases(req.body.categories);
    var returnObject = allPairs.getTestcases(req.body.categories);

    res.json([categories, testcases, pairs]);

  });

  app.post('/tst/allCombinations', jsonParser, function (req, res) {

    let {
      categories,
      testcases
    } = allCombinations.getTestcases(req.body.categories);
    //    var testcases = allCombinations.getTestcases(req.body.categories);

    req.body["testcases"] = testcases;
    res.render('visual', {
      testdata: req.body
    });

  });

  app.post('/tst/allCombinations/dataOnly', jsonParser, function (req, res) {

    let {
      categories,
      testcases
    } = allCombinations.getTestcases(req.body.categories);

    res.json([categories, testcases]);

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

  app.get('/testdata', function (req, res) {
    res.sendFile(path.normalize(data))
  });

  app.listen(port);
