var request = require("request");

var base_url = "http://localhost:3000";

describe("Datacombinations Server", function () {
  describe("GET /testdata", function () {

    it("returns JSON testdata array", function (done) {
      request.get(base_url + "/testdata", function (error, response, body) {
        //        console.log("body:\n" + body);
        //        console.log("response:\n" + JSON.stringify(response));
        //        console.log("error:\n" + error);
        expect(body).toContain("categories");
        done();
      });
    });
  });
});
