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

    //    console.log(req.body.testcases);  

    res.render('visual', {
      testdata: req.body
    });
  });

  app.post('/tst/strength2', jsonParser, function (req, res) {
    var een = req.body.categories[0];
    var twee = req.body.categories[1];
    var drie = req.body.categories[2];

    var i = 0;

    function getNext(ar) {
      i++;
      return ar.value[(i - 1) % ar.value.length];
    };

    //    console.log(een);
    //    console.log(twee);
    //    console.log(drie);

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
        console.log("een en twee");
        req.body.pairs.map(function (pair) {
          console.log(pair);
        });
    */

    /*
    alle paren van alle drie de categorien
    */

    var allPairs = []

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

    /*
        console.log("\n een en drie");
        req.body.pairs.map(function (pair) {
          console.log(pair);
        });
    */

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

    /*
        console.log("\n twee en drie");
        req.body.pairs.map(function (pair) {
          console.log(pair);
        });
    */

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

    /*
        console.log("\n--- remaining pairs: " + remainingPairs.length)
        remainingPairs.map(function (pair) {
          console.log(pair);
        });
    */

    /*
        console.log("\n--- all pairs: " + req.body.pairs.length)
        req.body.pairs.map(function (pair) {
          console.log(pair);
        });
    */

    /*
        console.log("\n ---\n" + Object.keys(req.body.pairs[0])[0] + "\n ---");
    */

    res.render('visual', {
      testdata: req.body
    });
  });

  app.get('/', function (req, res) {
    res.render('index');
  });

  app.get('/visual', function (req, res) {
    jsonfile.readFile(data, function (err, tdata) {
      if (err !== null) {
        //      console.log(err)
      } else {
        res.render('visual', {
          testdata: tdata
        });
      };
    });
  });

  app.listen(port);
