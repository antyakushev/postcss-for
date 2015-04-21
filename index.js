var postcss = require('postcss');
var list    = require('postcss/lib/list');
var vars    = require('postcss-simple-vars');

module.exports = postcss.plugin('postcss-for', function (opts) {
    opts = opts || {};

    var unrollLoop = function (rule) {
        var params =       list.space(rule.params),
            iterator =     params[0].slice(1),
        //  from =         params[1],
            index =        params[2],
            incl =         params[3] === 'to' ? 0 : 1,
            top = parseInt(params[4]) + incl;

        var value = {};
        for ( index; index < top; index++ ) {
            var content = rule.clone();
            value[iterator] = index;
            vars({ only: value })(content);
            rule.parent.insertBefore(rule, content.nodes);
        }
        if ( rule.parent ) rule.removeSelf();
    };

    return function (css) {
        css.eachAtRule(function (rule) {
            if ( rule.name === 'for' ) {
                unrollLoop(rule);
            }
        });
    };
});
