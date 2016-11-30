// Code will run on the client.

// As the user for their name so we can send it to the server
var username = prompt("Please enter your name")


// Establish a websocket connection to the server.
var socket = new WebSocket("ws://localhost:4000");

// Listen to when the connection is open.
socket.onopen = (e) => {
  console.log("Connected to server...")

  // You can start sending messages.
  // Tell the server this user's username
  var message = { type: 'set_name', username: username}
  // convert the message to a JSON string and send it over
  socket.send(JSON.stringify(message))
}

// Listen in to messages from the server and console.log them

socket.onmessage = (event) => {
  console.log('event data', event.data)
  var message = JSON.parse(event.data)
  if(message.type === 'picked_tile') {
    $("#" + message.tileId).css({"background-color": message.color});
  }
}

socket.onclose = (event) => {
  console.log('Connection closed.')
}

$(function() { // wait for DOM to load
  $("td").on("click", function(e) {
    var tileId = $(this).attr("id")
    var message = { type: 'picked_tile', tileId: tileId }
    socket.send(JSON.stringify(message))
  })

})
