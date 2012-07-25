/**
 * Module dependencies.
 */
var utils = require('../utils/utils')
, invoke = utils.invoke;

/**
 * EXPIRE <key> <seconds>
 */

exports.expire = function(key, seconds){
	  var obj = this.lookup(string(key));

	  if (obj) {
		    obj.expires = Date.now() + (string(seconds) * 1000);
		    return true;
	  } else {
		    return false;
	  }
};

/**
 * EXPIREAT <key> <seconds>
 */

exports.expireat = function(key, seconds){
	  var obj = this.lookup(string(key));

	  if (obj) {
		    obj.expires = +string(seconds) * 1000;
		    return true;
	  } else {
		    return false;
	  }
};


(exports.del = function(key){
	  var ikey = string(key);
	  if (this.lookup(ikey)) {
		    delete this.db.data[ikey];
		    return true;
	  } else {
		    return false;
	  }
}).mutates = true;

/**
 * PERSIST <key>
 */

exports.persist = function(key){
	  var obj = this.lookup(string(key));

	  if (obj && 'number' == typeof obj.expires) {
		    delete obj.expires;
		    return true;
	  } else {
		    return false;
	  }
};

/**
 * TTL <key>
 */

exports.ttl = function(key){
	  var obj = this.lookup(string(key));

	  if (obj && 'number' == typeof obj.expires) {
		    return (Math.round((obj.expires - Date.now()) / 1000));
	  } else {
		    return 0;
	  }
};

/**
 * TYPE <key>
 */

exports.type = function(key){
	  var obj = this.lookup(string(key));

	  if (obj) {
		    return (obj.type);
	  } else {
		    return undefined;
	  }
};

/**
 * EXISTS <key>
 */

exports.exists = function(key){
	  return (this.lookup(string(key)));
};

/**
 * RANDOMKEY
 */

exports.randomkey = function(){
	  var keys = Object.keys(this.db.data)
	  , len = keys.length;

	  if (len) {
		    var key = keys[Math.random() * len | 0];
		    return (key);
	  } else {
		    return null;
	  }
};



/**
 * RENAME <from> <to>
 */

(exports.rename = function(from, to){
	  var data = this.db.data;

	  // Fail if attempting to rename a non-existant key
	  from = string(from);
	  if (!this.lookup(from)) throw error('no such key');

	  // Fail on same keys
	  to = string(to);
	  if (from == to) throw error('source and destination objects are the same');

	  // Map key val / key type
	  var type = data[from].type
	  , obj = data[to] = data[from];
	  obj.type = type;
	  delete data[from];

	  return true;
}).mutates = true;

/**
 * KEYS <pattern>
 */

exports.keys = function(pattern){
	  var pattern = string(pattern)
	  , keys = Object.keys(this.db.data)
	  , matched = [];

	  // Optimize for common "*"
	  if ('*' == pattern) return (keys);

	  // Convert pattern to regexp
	  pattern = utils.parsePattern(pattern);

	  // Filter
	  for (var i = 0, len = keys.length; i < len; ++i) {
		    if (pattern.test(keys[i])) {
			      matched.push(keys[i]);
		    }
	  }

	  return (matched);
};
