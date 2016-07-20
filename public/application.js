var playerName = prompt("Enter your name");

// game logic functions
var tictac = {
  makeMove: function(e) {
    // get the tile that was clicked. ex: "r1c2"
    var tile = e.target.attributes.id.nodeValue;
    console.log("made move ", tile);
    // notify the server that a move was made.
    // send an object that looks like this {move: "r1c2"}
    socket.send(JSON.stringify({type: "move", move: tile}));
  },
  highlightTile: function(id) {
    // make the tile red
    document.querySelector("#" + id).style["background-color"] = "red";
  }
}

// connect to websocket server
var socket = new WebSocket("ws://localhost:4000/socketserver")

socket.onopen = function() {
  var greeting = {type: "greeting", message: "Hello from Chrome", playerName: playerName}
  socket.send(JSON.stringify(greeting));
};

socket.onmessage = function(event) {
  console.log("Received message: ", event.data);
  var dataObj = JSON.parse(event.data);

  if(dataObj.type === "move") {
    tictac.highlightTile(dataObj.move);
  } else {
    console.log("Received unknown message type from server ", dataObj.type);
  }
}


// wait for the DOM to load
document.addEventListener("DOMContentLoaded", function(event) {
  // listen for a click on one of the <td>s
  var tds = document.getElementsByTagName("td");
  for(var i=0; i < tds.length; i++) {
    // call the makeMove function every time the user clicks on a tile
    tds[i].addEventListener("click", tictac.makeMove)
  }
});
