var utils = require('../utils/utils')
  , string = utils.string
  , constant = require('../utils/constant');

/**
 * add val to  list
 */
exports.sadd = function(key,val){
  this.writeToAOF('sadd', [key,val]);
  var obj = this.lookup(string(key));
  if (!!obj) {
	  obj.val.push(val);
	  return true;
  }	else {
	  var list = [];
	  list.push(val);
	  this.set(key,list);
	  return true;
  }
};
/**
 * del from list
 */
exports.sdel = function(key,val){
  this.writeToAOF('sdel', [key,val]);
  var obj = this.lookup(string(key));
  if (!!obj) {
  	var index = obj.val.indexOf(val);
  	if (index==-1) {
  		return false;
  	} else {
  		delete obj.val[index];
  		return true;
  	}
  }	else {
	  return false;
  }
};

