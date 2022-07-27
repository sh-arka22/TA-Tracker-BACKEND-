// const io = require('../server').io;
console.log(io);

exports.soio = io.on("connection", (socket)=>{
    socket.emit("message", "no interview matched");
})