const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Configure express server
const PORT = 4000;
const app = express();
app.use(express.static('public')) // serve static assets (html, js, etc) from the public folder
// Create the socket server
const server = http.createServer(app);
const socket_server = new WebSocket.Server({ server });
// Start listening for connections
server.listen(PORT, () => console.log(`Listening on ${ PORT }`));

// Set up a callback for when a client connects to the server.
// This creates a pipeline between the client and the server.
socket_server.on('connection', function connection(pipeline) {
  console.log("Client connected to socket server.");

  // Set up a callback for when a message is received from the client
  // at the other end of this pipeline.
  pipeline.on('message', function(data) {
    // 'data' is just a JSON encoded string. We need to decode it.
    var message = JSON.parse(data);
    // Handle the clicked_tile message.
    if(message.type === "clicked_tile") {
      // Attach the color of the sender of the message before broadcasting
      message.color = pipeline.color
      // Send a message to all connected clients to announce the click
      broadcast(message);
    }
  })

  // The code below is called as soon as the client connects to the server.
  // Assigns a random color to the user
  const color = getRandomColor();
  pipeline.send(JSON.stringify({type: "change_color", color: color}));
  // Set the color on the pipeline so we can access the user's color on future requests
  pipeline.color = color;
});

const COLORS = ["red", "tomato", "blue", "green", "black"]

function getRandomColor() {
  return COLORS[Math.floor(Math.random()*COLORS.length)]
}

/**
 * Send the given object to all connected websocket clients.
 * i.e. all open pipelines
 * data - an object to send to all clients
 */
function broadcast(data) {
  // The 'clients' property on the socket_server object is maintained
  // by the ws library. It contains an array of all the pipelines
  // that the server is currently keeping track of
  socket_server.clients.forEach((pipeline) => {
    // Not all pipelines are 'open', so we only want to broadcast the message
    // to open pipelines.
    if(pipeline.readyState === WebSocket.OPEN) {
      pipeline.send(JSON.stringify(data));
    }
  });
};
