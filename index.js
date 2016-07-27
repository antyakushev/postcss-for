var postcss = require('postcss');
var list    = require('postcss/lib/list');
var vars    = require('postcss-simple-vars');

module.exports = postcss.plugin('postcss-for', function (opts) {

    opts = opts || {};
    opts.nested = opts.nested || true;

    var parentsHaveIterator, manageIterStack, checkNumber, checkParams, processLoops, processOriginalLoops, unrollLoop;
    var iterStack = [];

    parentsHaveIterator = function (rule, param) {
        if(rule.parent == null) { return false; }
        if(rule.parent.type === 'root') { return false; }
        if(rule.parent.params == null) { return false; }

        var parentIterVar = list.space(rule.parent.params);

        if (parentIterVar[0] == null) { return false; }
        if (parentIterVar[0] === param) { return true; }
        if ( iterStack.indexOf(param) !== -1) { return true; }
        return parentsHaveIterator(rule.parent, param);
    };

    manageIterStack = function (rule) {
        if (rule.parent.type !== 'root') {
            var parentIterVar = rule.parent.params && list.space(rule.parent.params)[0];
            if (iterStack.indexOf(parentIterVar) === -1) {
                // If parent isn't in stack, wipe stack
                iterStack.splice(0, iterStack.length);
            } else {
                // If parent is in stack, remove stack after parent
                iterStack.splice(iterStack.indexOf(parentIterVar) + 1, iterStack.length - iterStack.indexOf(parentIterVar) - 1);
            }
        } else {
            // If parent (root) isn't in stack, wipe stack
            iterStack.splice(0, iterStack.length);
        }
        // Push current rule on stack regardless
        iterStack.push( list.space(rule.params)[0] );
    };

    checkNumber = function (rule) {
        return function (param) {
            if (isNaN(parseInt(param)) || !param.match(/^-?\d+\.?\d*$/)) {
                if (param.indexOf('$') !== -1) {
                    if( !parentsHaveIterator(rule, param) ) {
                        throw rule.error('External variable (not from a parent for loop) cannot be used as a range parameter', { plugin: 'postcss-for' });
                    }
                } else {
                    throw rule.error('Range parameter should be a number', { plugin: 'postcss-for' });
                }
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
            value[iterator] = i;
            vars({ only: value })(content);
            if (opts.nested) processLoops(content);
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

    processOriginalLoops = function (css) {
        css.walkAtRules(function (rule) {
            if ( rule.name === 'for' ) {
                if (rule.parent) {
                    manageIterStack(rule);
                }
                unrollLoop(rule);
            }
        });
    };

    return function (css) {
        processOriginalLoops(css);
    };
});
