$(document).ready(function() {
  // Connect to the socket server
  var socket = new WebSocket("ws://localhost:4000/socketserver");

  var color;

  socket.onopen = function(event) {
    console.log("Connected to websocket server");
  }
  // listen for incoming messages and print them out
  socket.onmessage = function(event) {
    console.log(event.data);
    var message = JSON.parse(event.data);
    if(message.type === "colorAssigned") {
      // set the color of this client
      color = message.color;
      $(".identity").text("Your color is " + color).css({color: color});
    } else if(message.type === "colorTile") {
      $("#" + message.coordinate).css({"background-color": message.color});
    }
  }

  $("td").on("click", function() {
    var coordinate = $(this).attr("id");
    console.log("Coordinate ", coordinate);
    var message = {type: "colorTile", coordinate: coordinate, color: color}
    socket.send(JSON.stringify(message));
  });

});




