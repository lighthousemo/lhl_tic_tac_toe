const express = require('express');
const SocketServer = require('ws').Server;

const PORT = 4000;
// creates express server
const server = express()
  .use(express.static('public')) // serve static assets (html, js, etc) from the public folder
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));


const wss = new SocketServer({ server });

wss.on('connection', (socket) => {
  // every client has their own socket
  console.log("Client connected... ")

  // wait 3 seconds and say hello

  setTimeout(() => {
    socket.send("hello")
  }, 2000)


})




