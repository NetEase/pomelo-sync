var DataSync = require('../');

var dbclient = require('./mysql').client;


var opt = {};
opt.mappingPath = __dirname+ '/mapping';
opt.client = dbclient;
opt.interval = 5000;
opt.aof = false;
var sync = new DataSync(opt);
var key = 'user_key';
var User = function User(name){
	this.name = name;
};

var user1 = new User('hello');
user1.x = user1.y = 999;
user1.uid = 10003;
user1.sceneId = 1;
var resp = sync.set(key,user1);

console.log('resp %j' , sync.get(key));

//sync.flush('updateUser',user1);

//sync.exec('updateUser',10003,user1);

sync.select('bag.selectUser',10004,function(err,data){
	console.log(err + ' ' + data);
});

user1.x = 888;
user1.y = 777;

console.log(' count ' + sync.rewriter.count);

sync.exec('player.updateUser',10003,user1);

user1.x = 999;

//sync.flush('updateUser',10003,user1);

setInterval(function(){
 console.log(' count 2 ' + sync.isDone());
},1000);
