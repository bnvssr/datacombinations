// app.js

'use strict'

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

var port = process.env.PORT || 3000;
app.use('/assets', express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.set('view engine', 'ejs');

var jsonParser = bodyParser.json();

var data = path.normalize(__dirname) + '/data/testdataAAB.json'
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

  //    res.json([categories, testcases]);
  res.json({
    "categories": categories,
    "testcases": testcases
  });
});

app.post('/tst/allPairs', jsonParser, function (req, res) {

  let {
    categories,
    testcases,
    pairs
  } = allPairs.getTestcases(req.body.categories);

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

  res.json({
    "categories": categories,
    "testcases": testcases,
    "pairs": pairs
  });

});

app.post('/tst/allCombinations', jsonParser, function (req, res) {

  let {
    categories,
    testcases
  } = allCombinations.getTestcases(req.body.categories);

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

  res.json({
    "categories": categories,
    "testcases": testcases
  });

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
