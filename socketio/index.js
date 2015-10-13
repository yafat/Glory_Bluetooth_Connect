var readline = require('readline');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var net = require('net');
var client = new net.Socket();
var is_connected = false;
app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.broadcast.emit('hi');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
  socket.on('cmd', function(cmd){
    console.log('rec cmd='+cmd);
    if(cmd == 'get_pic' || cmd == 'select_type=1'){
      swrite(cmd);
    }
  });
});


http.listen(3000, function(){
  console.log('listening on *:3000');
});
try{
  client.connect(8889, '192.168.3.118', function() {
    console.log('Server Connected');
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
function swrite(cmd){
  if(is_connected === true){
      client.write(cmd + '\n');
    }else{
      console.log('Can not send cmd:'+cmd+', Socket is not connected.');
    }
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