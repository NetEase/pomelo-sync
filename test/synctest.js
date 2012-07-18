try {
  var MemDatabase = require('dbsync');
} catch (err) {
  var MemDatabase = require('../');
}

var map = require('./synclist').map;
var dbclient = require('./mysql').client;


var opt = {};
opt.write = map;
opt.client = dbclient;
opt.interval = 5000;
opt.aof = true;
var sync = new MemDatabase(this,opt) ;
var key = 'user_key';
var User = function User(name){
	this.name = name;
};

var user1 = new User('hello');
user1.x = user1.y = 999;
user1.uid = 10003;
user1.sceneId = 1;
var resp = sync.set(key,user1);

//sync.flush('updateUser',user1);

//sync.exec('updateUser',10003,user1);

sync.select('selectUser',10004,function(err,data){
	console.log(err + ' ' + data);
});

user1.x = 888;
user1.y = 777;

sync.exec('updateUser',10003,user1);

user1.x = 999;

//sync.flush('updateUser',10003,user1);

