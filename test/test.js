var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts) {
    expect(postcss([plugin(opts)]).process(input).css).to.eql(output);
};

describe('postcss-for', function () {

    it('it iterates from and to', function () {
        test('@for $i from 1 to 3 { b-$i { width: $i px; } }',
             '.b-1 {\n    width: 1 px\n}\n.b-2 {\n    width: 2 px\n}');
    });

    it('it iterates from and through', function () {
        test('@for $i from 1 through 3 { b{ width: $i px; } }',
             'b {\n    width: 1 px\n}\nb {\n    width: 2 px\n}\nb {\n    width: 3 px\n}');
    });

});
