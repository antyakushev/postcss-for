var postcss = require('postcss');
var list    = require('postcss/lib/list');
var vars    = require('postcss-simple-vars');

module.exports = postcss.plugin('postcss-for', function (opts) {

    opts = opts || {};
    opts.nested = opts.nested || true;

    var checkNumber, checkParams, processLoops, unrollLoop;

    checkNumber = function (rule) {
        return function (param) {
            if (isNaN(parseInt(param)) || !param.match(/^\d+\.?\d*$/)) {

                if (param.indexOf('$') !== -1) {
                    throw rule.error('Variable cannot be used as a range parameter', { plugin: 'postcss-for' });
                }

                throw rule.error('Range parameter should be a number', { plugin: 'postcss-for' });
            }
        };
    };

    checkParams = function (rule, params) {

        if (!params[0].match(/(^|[^\w])\$([\w\d-_]+)/) ||
             params[1] !== 'from' ||
             params[3] !== 'to' ||
             params[5] !== 'by' ^ params[5] === undefined ) {
            throw rule.error('Wrong loop syntax', { plugin: 'postcss-for' });
        }

        [params[2], params[4], params[6] || '0'].forEach(checkNumber(rule));
    };

    unrollLoop = function (rule) {
        var params = list.space(rule.params);

        checkParams(rule, params);

        var iterator = params[0].slice(1),
            index =   +params[2],
            top =     +params[4],
            dir =      top < index ? -1 : 1,
            by =      (params[6] || 1) * dir;

        var value = {};
        for ( var i = index; i * dir <= top * dir; i = i + by ) {
            var content = rule.clone();
            if (opts.nested) processLoops(content);
            value[iterator] = i;
            vars({ only: value })(content);
            rule.parent.insertBefore(rule, content.nodes);
        }
        if ( rule.parent ) rule.remove();
    };

    processLoops = function (css) {
        css.walkAtRules(function (rule) {
            if ( rule.name === 'for' ) {
                unrollLoop(rule);
            }
        });
    };

    return function (css) {
        processLoops(css);
    };
});
