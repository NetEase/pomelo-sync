/**
 * Module dependencies.
 */

var utils = require('../utils/utils')
  , string = utils.string
  , constant = require('../utils/constant');

/**
 * GET <key>
 */

exports.get = function(key){
  var obj = this.lookup(string(key));
  if (!!obj)
    return obj.val;
  else 
    return null;
};

/**
 * GETSET <key> <val>
 */

exports.getset = function(key, val){
	this.writeToAOF('getset', [key,val]);
  var strKey = string(key);

  this.db.data[strKey] = { val: val };
  
  return this.get(key);
};

/**
 * SET <key> <str>
 */

(exports.set = function(key, val){
  this.writeToAOF('set', [key,val]);
  key = string(key);
  this.db.data[key] = { val: val};
  return true;
}).mutates = true;

/**
 * SETNX <key> <val>
 */

(exports.setnx = function(key, val){
  key = string(key);
  if (this.lookup(key)) return false;
  this.db.data[key] = {val: val };
  return true;
}).mutates = true;

/**
 * SETEX <key> <seconds> <val>
 */

(exports.setex = function(key, seconds, val){
  var key = string(key);

  this.db.data[key] = {
  		val: val
    , expires: Date.now() + (string(seconds) * 1000)
  };
  
  return true;
}).mutates = true;

/**
 * INCR <key>
 */

(exports.incr = function(key){
  var key = string(key)||'',obj = this.lookup(key);

  if (!obj) {
    this.db.data[key] = {val: 1 };
    return 1;
  }  else {
    return ++obj.val;
  } 
}).mutates = true;

/**
 * INCRBY <key> <num>
 */

(exports.incrby = function(key, num){
  var key = string(key)
    , obj = this.lookup(key)
    , num = +string(num);

  if (isNaN(num))  throw new Error(constant.TypeError);

  if (!obj) {
    obj = this.db.data[key] = {val: num };
    return (obj.val);
  } else {
    return (obj.val += num);
  } 
}).mutates = true;

/**
 * DECRBY <key> <num>
 */

(exports.decrby = function(key, num){
  var key = string(key)
    , obj = this.lookup(key)
    , num = +string(num);

  if (isNaN(num)) throw new Error(constant.OutOfRange);

  if (!obj) {
    obj = this.db.data[key] = {val: -num };
    return (obj.val);
  } else {
  	return (obj.val -= num);
  } 
}).mutates = true;

/**
 * DECR <key>
 */

(exports.decr = function(key){
  var key = string(key)
    , obj = this.lookup(key);

  if(!obj) {
    this.db.data[key] = { val: -1 };
    return -1;
  } else {
    return --obj.val;
  } 
}).mutates = true;

/**
 * STRLEN <key>
 */

exports.strlen = function(key){
  var key = string(key)
    , val = this.lookup(key);
  if (val) {
    return val.length;
  } else {
    return 0;
  } 
};

/**
 * MGET <key>+
 */

(exports.mget = function(keys){
  var len = keys.length;
  var list = [];
  for (var i = 0; i < len; ++i) {
    var obj = this.lookup(keys[i]);
    list.push(obj);
  }
  return list;
}).multiple = 1;

/**
 * MSET (<key> <val>)+
 */

exports.mset = function(strs){
  var len = strs.length
    , key
    , val;

  for (var i = 0; i < len; ++i) {
    key = string(strs[i++]);
    this.db.data[key] = { val: strs[i] };
  }
  return true;
};

exports.mset.multiple = 2;
exports.mset.mutates = true;

/**
 * MSETNX (<key> <val>)+
 */

exports.msetnx = function(strs){
  var len = strs.length
    , keys = []
    , key
    , val;

  // Ensure none exist
  for (var i = 0; i < len; ++i) {
    keys[i] = key = string(strs[i++]);
    if (this.lookup(key)) return false;;
  }

  // Perform sets
  for (var i = 0; i < len; i += 2) {
    key = keys[i];
    this.db.data[key] = {val: strs[i] }
  }
  
  return true;
};

exports.msetnx.multiple = 2;
exports.msetnx.mutates = true;
