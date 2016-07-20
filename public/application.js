// connect to websocket server
var socket = new WebSocket("ws://localhost:4000/socketserver")

socket.onopen = function() {
  socket.send("Hello from Chrome");
};
