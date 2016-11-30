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
  socket.color = getRandomColor();

  // wait 3 seconds and say hello

  setTimeout(() => {
    socket.send(JSON.stringify({ type: "hello"}))
  }, 2000)

  // listen in for messages
  socket.on('message', (message) => {
    message = JSON.parse(message);
    console.log('Got message', message)

    if(message.type === 'set_name') {
      // Keep track of the user who owns the socket
      socket.currentUser = message.username;
    } else if(message.type === 'picked_tile') {
      // let all clients know that a tile was picked.
      // broadcast.
      wss.clients.forEach((clientSocket) => {
        var upgradedMessage = {
          type: 'picked_tile',
          tileId: message.tileId,
          username: socket.username,
          color: socket.color
        }
        clientSocket.send(JSON.stringify(upgradedMessage))
      })

    }
  })


})


function getRandomColor() {
  var colors = ['red', 'tomato', 'green', 'chartreuse', 'blue', 'black']
  return colors[Math.floor(Math.random()*colors.length)]
}




