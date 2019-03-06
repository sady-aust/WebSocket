var express = require('express');
var socket = require('socket.io');
const mongoose = require('mongoose');
const User = require('../WebSocket/models/user');
//App setup
var app = express();

mongoose.connect('mongodb://toufiq97:x0XPYo734WlpnNNn@cluster0-shard-00-00-qqpxw.mongodb.net:27017,cluster0-shard-00-01-qqpxw.mongodb.net:27017,cluster0-shard-00-02-qqpxw.mongodb.net:27017/test?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');

var server = app.listen(process.env.port || 3000, function () {
    console.log("Listen to request on port 3000");

});

//static files
app.use(express.static('public'));

//socket.io setup

var io = socket(server);
io.on('connection', function (socket) {
    console.log("Made socket connection ", socket.id);


    socket.on('onconnect', function (data) {
        /// console.log(data);    
        const user = new User({
            _id: new mongoose.Types.ObjectId(),
            connectionId: socket.id,
            isPlayling:false,
            handle: data.handle
        });

        user.save().then(result => {
            console.log(data.handle + "data Saved");

        }).catch(err => {
            console.log(data.handle + "data Not saved");
        });


        io.sockets.emit('onconnect', {
            connectionid: socket.id,
            handle: data.handle,
            connected: true
        });

    });
    //0CXp7dLh37AqAdaeAAAK
    socket.on('chat', function (data) {
        //  console.log(data);    
        io.sockets.emit('chat', data);
    });

    socket.on("getrandomuser", function (data) {
        let connectionid = data.connectionId;
       
         User.find({ connectionId: { "$ne": connectionid },isPlayling:false }).exec().then((result) => {
             if(result.length>0){
                let aIndex = Math.floor((Math.random() * result.length) );
                io.sockets.emit("getrandomuser",result[aIndex]);
             }
             else{
                io.sockets.emit("getrandomuser",[]);
             }
            
        }); 
    });



    socket.on('userdisconnect', function (data) {
        User.find({ connectionId: data.connectionid }).remove().exec().then(result => {
            console.log(JSON.stringify(data) + " Disconnect");
            console.log(data.connectionid + " Disconnect");
            io.sockets.emit("userdisconnect", ' has left')
        });
    });

    socket.on('typing', function (data) {
        socket.broadcast.emit('typing', data)
    });

});