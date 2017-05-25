var pair = require('../lib/pair');

p = new pair("Key1", "value1", "Key2", "value2");

describe("verify pair methods - ", function () {

  it("returns parameter inTestcases zero after init", function () {
    expect(p.getNbrInTestcase()).toEqual(0);
  });

  it("increase number in testcases attribute by one", function () {
    p.increaseNbrInTestcase();
    expect(p.inTestcase).toEqual(1);
  });

  it("returns key1", function () {
    expect(p.key1()).toBe("Key1");
  });

  it("returns key2", function () {
    expect(p.key2()).toBe("Key2");
  });

  it("returns key1 value", function () {
    expect(p.value1()).toBe("value1");
  });

  it("returns key2 value", function () {
    expect(p.value2()).toBe("value2");
  });

});
