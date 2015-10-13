var readline = require('readline');
var BTSP = require('bluetooth-serial-port')
  , BTserial = new BTSP.BluetoothSerialPort()
  , fs = require('fs')
  , BTDevices = [];

var rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});
var dataBuffer = "";

rl.on('line', function (cmd) {
  console.log('send command: '+cmd);
  if(cmd == 'search_New'){
    BTserial.close();
    console.log("search for Bluetooth Device");
    BTserial.inquire();
  }else if(cmd == 'list_Devices'){
    console.log("return list of Bluetooth Devices");
    for (var i = 0; i < BTDevices.length; i++) {
        console.log('device ( address: '+TDevices[i].address+', name: '+TDevices[i].name+', channel:'+ TDevices[i].channel +' ) ' );
    }
    console.log('list_Devices finished.')
  }else if(cmd == 'open_connect'){
    rl.question("Give me the address of BT ", function(address) {
      console.log("Try to connect by address:"+ address);
      for (var i = 0; i < BTDevices.length; i++) {
            var channel;
            if (BTDevices[i].address === address) {
                channel = BTDevices[i].channel;
            };
        };
        BTserial.connect(address, channel, function() {
            console.log('connected_Bluetooth ( address:'+ address + ' ) ');
        },function (){
            console.log('Cannot connect');
        });
    });
  }else if(cmd == 'close_connect'){
    BTserial.close();
    console.log('Connect Closed');
  }else if(cmd == 'send_data'){
    rl.question("Give me the address of BT ", function(data) {
        var buffer = new Buffer(data, 'utf8')
        BTserial.write(buffer, function (err, bytesWritten){
            if (err) {
                console.log(err);
            }
            if (bytesWritten == buffer.length) {
                console.log('All bytes are send');
            }
        });
    });
  }
});

BTserial.on('found', function(address, name) {
    BTserial.findSerialPortChannel(address, function(channel) {
        console.log('Found device ( address:'+ address +', name:'+ name +', channel:'+ channel+ ')' );
        BTDevices.push({address: address, name: name, channel: channel});
    });
});
BTserial.on('failure',function(err){
    console.log('failure: '+ err)
});
BTserial.on('finished',function(){
    console.log('finished searching')
    console.log('search_Bluetooth_stopped');  
});
BTserial.on('data', function(buffer) {
    dataBuffer = dataBuffer + buffer.toString('utf8');
    if(dataBuffer.indexOf("\n") != -1){
        console.log(dataBuffer.slice(0,1));
        dataBuffer = "";
    }
});