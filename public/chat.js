//Make Connection
var socket = io.connect('http://13.232.139.98:8084');
//var socket = io.connect('http://localhost:3000');
//query DOM
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var connectionHandle = document.getElementById('connecthandle');
var btn = document.getElementById('send');
var connect = document.getElementById('connect');
var chooserandom = document.getElementById('chooserandom');
var output = document.getElementById('output'); 
var feedback = document.getElementById('feedback');

//emmit Event
btn.addEventListener('click',function(){
    socket.emit('chat',{
        message : message.value,
        handle : handle.value
    });
});

connect.addEventListener('click',function(){
    console.log(connectionHandle.value);
    
    socket.emit('onconnect',{
        handle:connectionHandle.value
    });
    socket.on('onconnect',function(data){
        console.log(data);
        
    });
});

chooserandom.addEventListener('click',function(){
   
    
     socket.emit('getrandomuser',{
        connectionId:"0CXp7dLh37AqAdaeAAAK"
    }); 

  
    
   
});

socket.on('getrandomuser',function(data){
    console.log(data);
    
});
message.addEventListener('keypress',function(){
    socket.emit('typing',handle.value);
});
//Listen for events
socket.on('chat',function(data){
    feedback.innerHTML = '';
    output.innerHTML += '<p><strong>'+data.handle+":</strong>"+data.message+'</p>';
});

socket.on('typing',function(data){
    feedback.innerHTML = '<p><em>'+data+' is typing a message..'+'<em><p>';
});

