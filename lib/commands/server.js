/**
 * Module dependencies.
 */

var utils = require('../utils/utils');
/**
 * FLUSHDB
 */

(exports.flushdb = function(){
  this.db.data = {};
  return true;
}).mutates = true;

/**
 * FLUSHALL
 */

(exports.flushall = function(){
  this.dbs = [];
  this.selectDB(0);
  return true;
}).mutates = true;

/**
 * DBSIZE
 */

exports.dbsize = function(){
  return (Object.keys(this.db.data).length);
};

/**
 * INFO
 */

exports.info = function(){
  var buf = ''
    , day = 86400000
    , uptime = new Date - this.server.start;

  this.dbs.forEach(function(db, i){
    var keys = Object.keys(db)
      , len = keys.length;
    if (len) {
      buf += 'db' + i + ':keys=' + len + ',expires=0\r\n';
    }
  });

  return (buf);
};

/**
 * BGREWRITEAOF
 */

exports.sync = function(){
	this.rewriter.sync(this);
  return true;
};
