var express = require('express');
var socket = require('socket.io');

//App setup
var app = express();
var server = app.listen(process.env.port || 3000,function(){
    console.log("Listen to request on port 3000");
    
});

//static files
app.use(express.static('public'));

//socket.io setup

var io = socket(server);
io.on('connection',function(socket){
    console.log("Made socket connection ",socket.id);

    socket.on('chat',function(data){
        console.log(data);    
        io.sockets.emit('chat',data);
    });

    
    socket.on('disconnect', function() {
        console.log( 'user has left ')
        io.broadcast.emit( "userdisconnect" ,'user has left')
    
    
    });

    socket.on('typing',function(data){
        socket.broadcast.emit('typing',data)
    });
    
});