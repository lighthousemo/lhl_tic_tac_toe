const express = require('express');
const SocketServer = require('ws').Server;

const PORT = 4000;
// creates express server
const server = express()
  .use(express.static('public')) // serve static assets (html, js, etc) from the public folder
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server: server });

// Define a function that can broadcast data to all clients
wss.broadcast = (data) => {
  wss.clients.forEach((client) => {
    client.send(data);
  });
};

wss.on('connection', (socket) => {
  console.log('Client connected');
  socket.on('close', () => {
    console.log('Client disconnected')
  });

  var greeting;
  socket.on('message', function(message) {
    console.log("Got message: " + message);
    greeting = message;
  });

  // Wait 3 seconds and send a message to this client.
  setTimeout(function() {
    // reply to the client
    socket.send(greeting + " to you too!");
    // send the client's greeting to all other clients (broadcast)
    wss.broadcast("A client says " + greeting);
  }, 3000);
});

