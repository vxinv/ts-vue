var assert = require('assert');
var test = require('../../src/api/articles')


describe('Array', function () {
    describe('#indexOf()', function () {
        it('should return -1 when the value is not present', function () {
            assert.equal([1, 2, 3].indexOf(4), -1);
        });
    });
});

describe("upload", function () {
    it('should ', function () {
        test.uploadString("ssssssssssss", "sss")
        console.log("end")
    });
})
