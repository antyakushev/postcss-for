# PostCSS For [![Build Status](https://travis-ci.org/antyakushev/postcss-for.svg)](https://travis-ci.org/antyakushev/postcss-for)

[PostCSS] plugin that enables SASS-like f@for loop syntax in your CSS.

[PostCSS]: https://github.com/postcss/postcss

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

```js
postcss([ require('postcss-for') ])
```

See [PostCSS] docs for examples for your environment.
