var postcss = require('postcss');
var expect  = require('chai').expect;

var plugin = require('../');
var postcssCustomProps = require('postcss-custom-properties');

var test = function (input, output, opts) {
    expect(postcss([plugin(opts), postcssCustomProps]).process(input).css).to.eql(output);
};

describe('postcss-for', function () {

    it('it iterates from and to', function () {
        test('@for $i from 1 to 2 { .b-$i { width: $(i)px; } }',
             '.b-1 {\n    width: 1px\n}\n.b-2 {\n    width: 2px\n}');
    });

    it('it iterates from bigger to smaller', function () {
        test('@for $i from 3 to 1 { .b-$i { width: $(i)px; } }',
             '.b-3 {\n    width: 3px\n}\n.b-2 {\n    width: 2px\n}\n.b-1 {\n    width: 1px\n}');
    });

    it('it iterates from and to by two', function () {
        test('@for $i from 1 to 4 by 2 { .b-$i { width: $(i)px; } }',
             '.b-1 {\n    width: 1px\n}\n.b-3 {\n    width: 3px\n}');
    });

    it('it supports nested loops', function () {
        test('@for $i from 1 to 2 { @for $j from 1 to 2 {.b-$(i)-$(j) {} } }',
             '.b-1-1 {}\n.b-1-2 {}\n.b-2-1 {}\n.b-2-2 {}');
    });

    it('it supports ranges with a variable from the parent for loop', function () {
        test('@for $j from 1 to 3 { @for $i from 1 to $j {.b-$(i)-$(j) {} } }',
             '.b-1-1 {}\n.b-1-2 {}\n.b-2-2 {}\n.b-1-3 {}\n.b-2-3 {}\n.b-3-3 {}');
    });

    it('it supports ranges with variables from any parent for loop', function () {
        test('@for $w from 1 to 2 { @for $x from 1 to $w { @for $y from $x to $w { @for $z from $y to $w { .c-$(w)-$(z)-$(y)-$(x) {} }}}}',
             '.c-1-1-1-1 {}\n.c-2-1-1-1 {}\n.c-2-2-1-1 {}\n.c-2-2-2-1 {}\n.c-2-2-2-2 {}');
    });

    it('it supports locality of variables in nested for loops', function () {
        test('@for $w from 1 to 2 { @for $x from 1 to $w { \n@for $y from 1 to 2 { @for $z from $y to $w { .c-$(w)-$(z)-$(y)-$(x) {} }}\n@for $y from 1 to 3 { @for $z from $y to $w { .d-$(w)-$(z)-$(y)-$(x) {} }}\n}}',
             '.c-1-1-1-1 {}\n.c-1-2-2-1 {}\n.c-1-1-2-1 {}\n.d-1-1-1-1 {}\n.d-1-2-2-1 {}\n.d-1-1-2-1 {}\n.d-1-3-3-1 {}\n.d-1-2-3-1 {}\n.d-1-1-3-1 {}\n.c-2-1-1-1 {}\n.c-2-2-1-1 {}\n.c-2-2-2-1 {}\n.d-2-1-1-1 {}\n.d-2-2-1-1 {}\n.d-2-2-2-1 {}\n.d-2-3-3-1 {}\n.d-2-2-3-1 {}\n.c-2-1-1-2 {}\n.c-2-2-1-2 {}\n.c-2-2-2-2 {}\n.d-2-1-1-2 {}\n.d-2-2-1-2 {}\n.d-2-2-2-2 {}\n.d-2-3-3-2 {}\n.d-2-2-3-2 {}');
    });

    it('it supports ranges with negative numbers', function () {
        test('@for $i from -1 to 0 { .b-$i { width: $(i)px; } }',
             '.b--1 {\n    width: -1px\n}\n.b-0 {\n    width: 0px\n}');
    });

    it('it supports :root selector', function () {
        test(':root { \n@for $weight from 100 to 900 by 100 \n{ --foo-$(weight): $weight; }\n}\n.b { font-weight: var(--foo-200) }',
           '.b { font-weight: 200 }');
    });

    it('it throws an error on wrong syntax', function () {
        expect(function () {
            test('@for $i since 1 until 3 { .b-$i { width: $(i)px; } }');
        }).to.throw('<css input>:1:1: Wrong loop syntax');
    });

    it('it throws an error on missing by parameter', function () {
        expect(function () {
            test('@for $i from 1 to 3 by { .b-$i { width: $(i)px; } }');
        }).to.throw('<css input>:1:1: Wrong loop syntax');
    });

    it('it throws an error on wrong range parameters', function () {
        expect(function () {
            test('@for $i from a to c { .b-$i { width: $(i)px; } }');
        }).to.throw('<css input>:1:1: Range parameter should be a number');
    });

    it('it throws an error if range parameter is an external variable', function () {
        expect(function () {
            test('@for $i from 1 to $columns { .b-$i { width: $(i)px; } }');
        }).to.throw('<css input>:1:1: External variable (not from a parent for loop) cannot be used as a range parameter');
    });

    it('it throws an error if range parameter is from a previous non-parent for loop', function () {
        expect(function () {
            test('@for $w from 1 to 3 { @for $x from 1 to $w { \n@for $y from $x to $w { @for $z from $y to $w { .c-$(w)-$(z)-$(y)-$(x) {} }}\n@for $a from $y to $w { .d-$(w)-$(y)-$(a)-$(x) {} }}}');
        }).to.throw('<css input>:3:1: External variable (not from a parent for loop) cannot be used as a range parameter');
    });

    it('it doesn\'t retain the stack after exiting multiple layers and throws an error for bad range parameters', function () {
        expect(function () {
            test('@for $w from 1 to 3 { @for $x from 1 to $w { @for $a from $x to $w { @for $b from $a to $w { .c-$(w)-$(b)-$(a)-$(x) {} }}}}\n@for $a from 1 to 3 { @for $b from $a to $w { .D-$(w)-$(b)-$(a)-$(x) {} }}');
        }).to.throw('<css input>:2:23: External variable (not from a parent for loop) cannot be used as a range parameter');
    });

});
