/**
 * Module dependencies.
 */

var utils = require('../utils/utils')
, invoke = utils.invoke
, string = utils.string;

/**
 *load data from db 
 */
exports.select = function(key, val,cb){
    this.tick(key,val,cb);
};

/**
 * do instant
 */
exports.tick = function(key,val,cb){
    if (this.rewriter && this.rewriter.write[key]) {
		    invoke(this.rewriter.write[key],this.client,val,cb);
    }
};
/*
 * 
 * flush data to db
 * 
 */
exports.exec = function(){
    var mergerKey;
    switch (arguments.length) {
    case 2:
        this.save(arguments[0],arguments[1]);
        break;
    case 3:
        mergerKey = [arguments[0],arguments[1]].join('');
        this.mergerMap[mergerKey] = {key:arguments[0],val:this.clone(arguments[2])};
        this.writeToAOF(arguments[0], [arguments[2]]);
        break;
    default:
        break;
    }
};

/***
 * clone new object
 */
exports.clone = function(obj){
	  if (obj === Object(obj)){
		    if (Object.prototype.toString.call(obj) == '[object Array]'){
			      return obj.slice();
		    } else {
			      var ret = {};
			      Object.keys(obj).forEach(function (val) {
				        ret[val] = obj[val];
			      });
			      return ret;	
		    }
	  } else {
		    return null;
	  }
};
/**
 * 
 * flush data to db
 * 
 */
exports.save = function(key, val){
	  var target = this.clone(val);
	  if (!!target) {
		    this.writeToAOF(key, [val]);
		    this.flushQueue.push({key:key,val:val});
	  }
};

/**
 * update data to db
 * 
 */
exports.update = function(key, val){
	  this.save(key,val);
};


/**
 * delete data to db
 */
exports.delete = function(key,val){
	  this.save(key,val);
};

/**
 * flush all data go head
 */
exports.flushAll = function(){
	  if (this.rewriter)
		    this.rewriter.sync(this);
};
/**
 * reutrn job is done 
 */

exports.isDone = function(){
    var writerDone = true,queueLen = false,mapLen = false;
    if (this.rewrite){writerDone = this.rewriter.isDone();}
    queueLen = (this.flushQueue.getLength()===0);
    mapLen = (this.getMergeLength()===0);
    return writerDone && queueLen && mapLen;
};
/**
 *return the merge length
 */
 exports.getMergeLength = function(){
    var length = 0;
    for (var key in this.mergerMap) {
        length+=1;
    }
    return length;
}
/*
 * 
 * flush data to db
 * 
 */
exports.flush = function(){
    var mergerKey;
    if (arguments.length>=3) {
        mergerKey = [arguments[0],arguments[1]].join('');
        var exists = this.mergerMap[mergerKey];
        if (!!exists) {
            this.writeToAOF([arguments[0],['_remove']].join(''),[exists]);
            delete this.mergerMap[mergerKey];
        } 
        this.writeToAOF(arguments[0], [arguments[2]]);
        return this.rewriter.flush(this,arguments[0],arguments[2]);
    } else {
        this.log.error('invaild arguments,flush must have at least 3 arguments');
        return false;
    }
};


exports.flushCB = function(key,val,cb){
    this.writeToAOF(key, [val]);
    this.tick(key,val,cb);
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
	return this.rewriter.sync();
};
