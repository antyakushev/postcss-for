# PostCSS For Plugin
[![Build Status](https://travis-ci.org/antyakushev/postcss-for.svg)][ci] [![NPM version](https://badge.fury.io/js/postcss-for.svg)][npm] [![Dependency Status](https://gemnasium.com/antyakushev/postcss-default-unit.svg)][deps]

[PostCSS] plugin that enables `@for` loop syntax in your CSS.

## Usage

```js
postcss([ require('postcss-for') ])
```

Note, that unlike the Sass `@for`, postcss-for in the example below iterates from 1 to 3 *inclusively*.
```css
@for $i from 1 to 3 {
    .b-$i { width: $(i)px; }
}
```

```css
.b-1 {
    width: 1px
}
.b-2 {
    width: 2px
}
.b-3 {
    width: 3px
}
```

This plugin must be set before [postcss-nested] and [postcss-simple-vars]. 
Therefore dollar variable cannot be used as a loop range parameter.

`By` keyword is available:

```css
@for $i from 1 to 5 by 2 {
    .b-$i { width: $(i)px; }
}
```

```css
.b-1 {
    width: 1px
}
.b-3 {
    width: 3px
}
.b-5 {
    width: 5px
}
```



See [PostCSS] docs for examples for your environment.

[PostCSS]:             https://github.com/postcss/postcss
[postcss-nested]:      https://github.com/postcss/postcss-nested
[postcss-simple-vars]: https://github.com/postcss/postcss-simple-vars
[ci]:                  https://travis-ci.org/antyakushev/postcss-for
[deps]:                https://gemnasium.com/antyakushev/postcss-for
[npm]:                 http://badge.fury.io/js/postcss-for
