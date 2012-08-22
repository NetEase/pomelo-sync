var Client = require('mysql').Client;
var client = new Client();

client.host = 'pomelo.163.com';
client.user = 'xy';
client.password = 'dev';
client.database = 'Pomelo';
 
queryHero = function(limit,offset,cb){
  var users = [];
  var sql = 'SELECT * FROM Hero  limit ? offset ? ';
  var args = [limit,offset];
  client.query(sql,args,function selectCb(error, results, fields) {
      if (error) {
          console.log('queryHero Error: ' + error.message);
          cb(null,users);
      }
      for (var i = 0;i<results.length;i++) {
      	var user = {uid:results[i]['id'],username:results[i]['username'],passwd:results[i]['passwd']||'123'};
    	  users.push(user);
      };
      cb(null,users);
  });
};

genHero = function(last,max,cb){
  var sceneId = 1,level = 1 , x = 100,y = 100;var _username = 'ypha',_name='ypha';
    for (var i = last ;i<=max;i++) {
    var username = _username +  i;
    var name = _name +  i;
    var roleId = '000' + Math.round(Math.random()*(9-1)+1);
	 	var sql = 'insert into Hero (username,name,roleId,sceneId,level,x,y) values(?,?,?,?,?,?,?)';
		var args = [username,name,roleId,sceneId,level,x,y];
		client.query(sql, args, function(err,res){
			if(err !== null){
	 			cb(err, 'error');
			} else {
				var userId = res.insertId;
				cb(null,userId);
			}
		});
    };
};

exports.client = client;
