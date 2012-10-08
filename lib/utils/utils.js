var util = require('util');
/**
 * Convert object to a string.
 *
 * @param {object} buf
 * @return {String}
 */

exports.string = function(o) {
	   try {
        return JSON.stringify(o);}
    catch(ex){
        return util.inspect(o,true,100,true);
    }
    return o;
};

/**
 * Parse a `pattern` and return a RegExp.
 *
 * @param {String} pattern
 * @return {RegExp}
 */

exports.parsePattern = function(pattern){
    pattern = pattern
        .replace(/\*/g, '.*')
        .replace(/\?/g, '.');
    return new RegExp('^' + pattern + '$');
};

/**
 * invoke callback function
 * @param cb
 */
exports.invoke = function(cb) {
	  if(!!cb && typeof cb == 'function') {
		    cb.apply(null, Array.prototype.slice.call(arguments, 1));
	  }
};
