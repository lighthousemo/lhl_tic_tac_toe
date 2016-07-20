const express = require('express');
const SocketServer = require('ws').Server;

const PORT = 4000;
// creates express server
const server = express()
  .use(express.static('public')) // serve static assets (html, js, etc) from the public folder
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const wss = new SocketServer({ server }); // creates socket server

// wss is the websocket server object.
wss.on('connection', (ws) => { // ws is the socket connection to the specific client who connected.
  console.log("Client connected.");

  // set up a callback that will be called every time the server receives a message
  ws.on('message', (message) => {
    console.log("Message: " + message);
    const messageObj = JSON.parse(message);
    if(messageObj.type === "greeting") {
      console.log("greeting from " + messageObj.playerName);
      // Store the player name on the ws object.
      // From now on you can access ws.playerName to get the name
      // of the current player.
      ws.playerName = messageObj.playerName;
    } else if(messageObj.type === "move") {
      console.log(ws.playerName + " made a move ");
      // automatically rebroadcast the message to all connected clients
      broadcast(message); // message is a JSON string
    } else {
      console.log("Received message with unknown type ", messageObj.type);
    }
  })
})

// Define a helper function that takes in some data and sends it
// to all connected clients.
function broadcast(data) {
  // wss.clients returns an array of all active ws objects (active connections).
  wss.clients.forEach((client) => {
    console.log("Broadcasting: ", data);
    client.send(data);
  });
};


