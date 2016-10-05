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

var colors = ['tomato', 'cornflowerblue', 'bisque', 'chocolate', 'salmon', 'honeydew'];

wss.on('connection', (socket) => {
  console.log('Client connected');
  var randomColor = colors[getRandomInt(0, colors.length -1)];
  socket.send(JSON.stringify({type: "colorAssigned", color: randomColor}));
  socket.color = randomColor;

  socket.on('close', () => {
    console.log('Client ' + socket.color + ' disconnected.');
  });

  socket.on('message', (rawMessage) => {
    const message = JSON.parse(rawMessage);
    console.log("Got message: ", message);
    if(message.type == "colorTile") {
      // broadcast the tile click to all clients
      wss.broadcast(rawMessage);
    }
  })

});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
