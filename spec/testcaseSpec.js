var Testcase = require('../lib/testcase');

var keys = ["Kleur", "Vorm", "Effect"]
var testcase = new Testcase(keys);

describe("Testcase - ", function () {

  it("return 'true' when key is in testcase", function () {
    expect(testcase.containsKey("Kleur")).toBe(true);
  });

  it("return 'false' when key is not in testcase", function () {
    expect(testcase.containsKey("kleur")).toBe(false);
  });

});
