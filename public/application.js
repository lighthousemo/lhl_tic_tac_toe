
// Connect to the websocket server
const socket = new WebSocket('ws://localhost:4000');

// Set up a callback for when the connection is established.
socket.onopen = (event) => {
  console.log("Connected to the websocket server");
}

// Set up a callback for when a message comes in from the server
socket.onmessage = (event) => {
  // event.data is a string with JSON encoded data.
  console.log("Server said: ", event.data);
  // Parse the string into a JavaScript object
  const message = JSON.parse(event.data);

  // Handle different types of messages.
  // We have to messages: change_color or clicked_title
  if(message.type === "change_color") {
    // Set global variable to keep track of the color
    window.color = message.color;
  }
  if(message.type === "clicked_tile") {
    // Set the color on the tile
    $("#" + message.tile).css({"background-color": message.color});
  }
}

$(() => {
  // Set up a click listener for the tiles.
  $(".tile").on("click", (e) => {
    // When the user clicked a tile, send out a 'clicked_tile' message
    // to the server. the 'tile' value will be the id of the tile
    // that was clicked. Ex: "r1c2"
    socket.send(JSON.stringify({type: "clicked_tile", tile: e.target.id}));
  })
})



