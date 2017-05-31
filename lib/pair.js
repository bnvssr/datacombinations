 // pair.js

 var Testcase = require('./Testcase')

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

 module.exports = Pair;
