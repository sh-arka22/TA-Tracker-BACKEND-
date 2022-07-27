const http = require('http');
const app = require('./server/app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
server.listen(port);