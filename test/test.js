var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');

var test = function (input, output, opts) {
    expect(postcss([plugin(opts)]).process(input).css).to.eql(output);
};

describe('postcss-for', function () {

    it('it iterates from and to', function () {
        test('@for $i from 1 to 2 { .b-$i { width: $i px; } }',
             '.b-1 {\n    width: 1 px\n}\n.b-2 {\n    width: 2 px\n}');
    });

    it('it iterates from bigger to smaller', function () {
        test('@for $i from 3 to 1 { .b-$i { width: $i px; } }',
             '.b-3 {\n    width: 3 px\n}\n.b-2 {\n    width: 2 px\n}\n.b-1 {\n    width: 1 px\n}');
    });

    it('it iterates from and to by two', function () {
        test('@for $i from 1 to 4 by 2 { .b-$i { width: $i px; } }',
             '.b-1 {\n    width: 1 px\n}\n.b-3 {\n    width: 3 px\n}');
    });

    it('it throws an error on wrong syntax', function () {
        expect(function () {
            test('@for $i since 1 until 3 { .b-$i { width: $i px; } }');
        }).to.throw('<css input>:1:1: Wrong loop syntax');
    });

    it('it throws an error on wrong range parameters', function () {
        expect(function () {
            test('@for $i from a to c { .b-$i { width: $i px; } }');
        }).to.throw('<css input>:1:1: Range parameter should be a number');
    });

    it('it throws an error if range parameter is a variable', function () {
        expect(function () {
            test('@for $i from 1 to $columns { .b-$i { width: $i px; } }');
        }).to.throw('<css input>:1:1: Variable cannot be used as a range parameter');
    });

});
