var Particle = require('particle-api-js');
var particle = new Particle();
var token;
var EventSource = require('eventsource');
var express = require('express');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var deviceID = new Array();
deviceID[0] = '330034001347353236343033';//sensor_1
deviceID[1] = '2b0017001547353236343033';//sensor_2
deviceID[2] = '2f003c000b47353235303037';//sensor_3
deviceID[3] = '240028001847353236343033';//sensor_4
deviceID[4] = '1d0028001847353236343033';//sensor_5

app.get('/', function(req, res){
  res.sendfile('test.html');
});
http.listen(3000, function(){
  console.log('listening on *:3000');
});
app.use('/fonts',express.static(__dirname + '/fonts'));
app.use('/css',express.static(__dirname + '/css'));
app.use('/js',express.static(__dirname + '/js'));

io.on('connection', function(socket){ 
  socket.on('start', function(msg){
  	console.log("Received: ", msg);
      particle.login({username: 'ec544group1@gmail.com', password: 'group1544'}).then(
        function(data0){
            token = data0.body.access_token;
            var fnPrstart = particle.callFunction({ deviceId: deviceID[4], name: 'start', argument: 'start', auth: token });
            fnPrstart.then(
              function(data1) {
                console.log('Function start called succesfully:');//, data1);
              }, function(err) {
                console.log('An error occurred:', err);
              });
        });
    socket.emit('chat message2', "server successfully start the car");
  });
    
  socket.on('stop', function(msg){
      console.log("Received: ", msg);
      particle.login({username: 'ec544group1@gmail.com', password: 'group1544'}).then(
        function(data0){
            token = data0.body.access_token;
            var fnPrstop = particle.callFunction({ deviceId: deviceID[4], name: 'stop', argument: 'stop', auth: data0.body.access_token });
            fnPrstop.then(
              function(data2) {
                console.log('Function stop called succesfully:');//, data2);
              }, function(err) {
                console.log('An error occurred:', err);
              });
        });
      socket.emit('chat message2', "server successfully stop the car");
  });  
    
    //socket.emit('speedsensor', 200);
    particle.login({username: 'ec544group1@gmail.com', password: 'group1544'}).then(
        function(data0){
            token = data0.body.access_token;
            particle.getEventStream({ deviceId: deviceID[1], name: 'speed', auth: token }).then(function(stream) {
                stream.on('event', function(data3) {
                    //console.log(data3.data);
                    //var msg = 200;
                    //socket.emit('speedsensor', msg);
                    socket.emit('speedsensor', data3.data);
                   });
              });
        }
    );

});
