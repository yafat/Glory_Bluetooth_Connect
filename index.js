var readline = require('readline');

var net = require('net');

var client = new net.Socket();
var is_connected = false;

try{
	client.connect(8889, '192.168.3.118', function() {
		console.log('Connected');
		is_connected = true;
	});

	client.on('data', function(data) {
		console.log('Received: ' + data);
	});

	client.on('close', function() {
		console.log('Connection closed');
	});
}catch(e){
	console.log('Connection Failed');
}
var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.on('line', function (cmd) {
  console.log('send command: '+cmd);
  if(cmd == 'get_pic'){
  	swrite(cmd);
  }
});
function swrite(cmd){
	if(is_connected === true){
	  	client.write(cmd + '\n');
	  }else{
	  	console.log('Can not send cmd:'+cmd+', Socket is not connected.');
	  }
}