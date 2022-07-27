/************************** TA RECEIVES MESSAGE WHNEVER NO MATCH FOUND **************************************/

var io = require('socket.io-client');
var socket = io.connect("http://localhost:3000/", {reconnect: true});

socket.on("message", (arg) => {
    console.log(arg); 
});
