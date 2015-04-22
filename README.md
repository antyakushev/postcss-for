# PostCSS For Plugin
[![Build Status](https://travis-ci.org/antyakushev/postcss-for.svg)][ci] [![NPM version](https://badge.fury.io/js/postcss-for.svg)][npm] [![Dependency Status](https://gemnasium.com/antyakushev/postcss-default-unit.svg)][deps]

[PostCSS] plugin that enables SASS-like `@for` loop syntax in your CSS.

```css
@for $i from 1 to 3 {
    .b-$i { width: $i px; }
}
```

```css
.b-1 {
    width: 1 px
}
.b-2 {
    width: 2 px
}
```

## Usage

Note, that you must set this plugin before [postcss-nested]
and [postcss-simple-vars]. Therefore dollar variable cannot be used as a loop range parameter.

```js
postcss([ require('postcss-for') ])
```

See [PostCSS] docs for examples for your environment.

[PostCSS]:             https://github.com/postcss/postcss
[postcss-nested]:      https://github.com/postcss/postcss-nested
[postcss-simple-vars]: https://github.com/postcss/postcss-simple-vars
[ci]:                  https://travis-ci.org/antyakushev/postcss-for
[deps]:                https://gemnasium.com/antyakushev/postcss-for
[npm]:                 http://badge.fury.io/js/postcss-for
