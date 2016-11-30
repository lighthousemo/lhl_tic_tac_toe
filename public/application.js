// Code will run on the client.


// Establish a websocket connection to the server.
var socket = new WebSocket("ws://localhost:4000");

// Listen to when the connection is open.
socket.onopen = (e) => {
  console.log("Connected to server...")
}

// Listen in to messages from the server and console.log them

socket.onmessage = (event) => {
  console.log('event data', event.data)
}

socket.onclose = (event) => {
  console.log('Connection closed.')
}

