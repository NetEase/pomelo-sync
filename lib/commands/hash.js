/**
 * Module dependencies.
 */

var utils = require('../utils/utils')
  , string = utils.string
  , invoke = utils.invoke
  , constant = require('../utils/constant');
/**
 * HLEN <key>
 */

exports.hlen = function(key){
  var obj = this.lookup(string(key));

  if (!obj) {
  	return 0;
  } else if ('hash' == obj.type) {
    return Object.keys(obj.val).length;
  } else {
  	return -1;
  }
};

/**
 * HVALS <key>
 */

exports.hvals = function(key){
  var obj = this.lookup(string(key));
  if (!obj) {
  	return null
  } else if ('hash' == obj.type) {
    return (Object.keys(obj.val).map(function(key){
      return obj.val[key];
    }));
  } else {
  	return null;
  }
};

/**
 * HKEYS <key>
 */

exports.hkeys = function(key){
  var obj = this.lookup(string(key));
  if (!obj) {
  	return null;
  } else if ('hash' == obj.type) {
    return Object.keys(obj.val);
  } else {
  	return null;
  }
};

/**
 * HSET <key> <field> <val>
 */

(exports.hset = function(key, field, val){
  var key = string(key)
    , field = string(field)
    , obj = this.lookup(key);

  if (obj && 'hash' != obj.type) return false;
  obj = obj || (this.db.data[key] = { type: 'hash', val: {} });

  obj.val[field] = val;
  
  return true;
  
}).mutates = true;

/**
 * HMSET <key> (<field> <val>)+
 */

(exports.hmset = function(data){
  var len = data.length
    , key = string(data[0])
    , obj = this.lookup(key)
    , field
    , val;

  if (obj && 'hash' != obj.type)  return false;;
  obj = obj || (this.db.data[key] = { type: 'hash', val: {} });

  for (var i = 1; i < len; ++i) {
    field = string(data[i++]);
    val = data[i];
    obj.val[field] = val;
  }

  return true;
  
}).mutates = true;

exports.hmset.multiple = 2;
exports.hmset.skip = 1;

/**
 * HGET <key> <field>
 */

exports.hget = function(key, field){
  var key = string(key)
    , field = string(field)
    , obj = this.lookup(key)
    , val;
  if (!obj) {
  	return null;
  } else if ('hash' == obj.type) {
    if (val = obj.val[field]) {
    	return val;
    } else {
    	return null;
    }
  } else {
  	return null;
  }
};

/**
 * HGETALL <key>
 */

exports.hgetall = function(key){
  var key = string(key)
    , obj = this.lookup(key)
    , list = [];

  if (!obj) {
  	return null;
  } else if ('hash' == obj.type) {
    for (var field in obj.val) {
      list.push(field, obj.val[field]);
    }
    return list;
  } else {
  	return null;
  }
};

/**
 * HEXISTS <key> <field>
 */

exports.hexists = function(key, field){
  var key = string(key)
    , field = string(field)
    , obj = this.lookup(key);

  if (obj) {
    if ('hash' == obj.type) {
      var result = (field in obj.val);
      return result;
    } else {
    	return false;
    }
  } else {
  	return false;
  }
};
