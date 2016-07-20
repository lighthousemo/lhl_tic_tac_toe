const express = require('express');
const SocketServer = require('ws').Server;

const PORT = 4000;
const server = express() // creates express server
  .use(express.static('public'))
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server }); // creates socket server

wss.on('connection', (ws) => { // ws is the socket connection to the specific client who connected.
  console.log("Client connected.");

  ws.on('message', (message) => {
    console.log("Message: " + message);
  })
})


