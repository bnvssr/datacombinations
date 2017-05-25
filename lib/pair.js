 // pair.js

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

 Pair.prototype.increaseNbrInTestcase = function () {
   this.inTestcase++;
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

 module.exports = Pair;
