/**
 * Module dependencies.
 */

/**
 * Initialize a new AOF MysqlRewriter with the given `db`.
 * 
 * @param {options}
 * 
 */

var Rewriter = module.exports = function Rewriter(options) {
		this.write = options.write;
};

/**
 * Initiate sync.
 */

Rewriter.prototype.sync = function(server){
	  var self = this,mergerKey,mergerMap,data = null,exec;
	  if (!server.client){
		    server.log.error('db sync client is null');
		    return ;
	  }
    exec = function(data) {
        try{
		        self.write[data.key](server.client,data.val);
		    } catch(ex){
			      server.log.error('sync failed:' + JSON.stringify(data) + ' stack:' + ex.stack);
		    }
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
};


