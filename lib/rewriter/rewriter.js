/**
 * Module dependencies.
 */
var utils = require('../utils/utils');
var invoke = utils.invoke;
/**
 * Initialize a new AOF Rewriter with the given `db`.
 * 
 * @param {options}
 * 
 */
var Rewriter = module.exports = function Rewriter(server) {
    this.server = server;
    this.count = 0;
};

/**
 * Initiate sync.
 */

Rewriter.prototype.sync = function(){
	  var self = this,mergerKey,mergerMap,data = null,exec,server = self.server;
    if (!server.client){
		    server.log.error('db sync client is null');
		    return ;
	  }
    exec = function(data) {
        self.count+=1;
		    invoke(server.mapping[data.key],server.client,data.val,function(){
            self.count-=1;
        });
    };
	  server.flushQueue.shiftEach(function(data){
        exec(data);
    });
    mergerMap = server.mergerMap;  
    for (mergerKey in mergerMap){
        data = mergerMap[mergerKey];
        exec(data);
        delete mergerMap[mergerKey];	
    }
    return true;
};

/*
 *
 * flush db
 *
 */
Rewriter.prototype.flush = function(key,val){
	  var self = this,server = self.server;
	  if (!server.client){
		    server.log.error('db sync client is null');
		    return ;
	  }
    self.count+=1;
		return invoke(server.mapping[key],server.client,val,function(){self.count-=1;});
};

/*
 *
 * judge task is done
 *
 */
Rewriter.prototype.isDone = function() {
    return this.count===0;
};
