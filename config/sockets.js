exports.init = function() {
  geddy.on('started', function(){
    geddy.io.sockets.on('connection', function(socket) {
      socket.emit('hello', {message: "world"});
      socket.on('message', function(message) {
        console.log(message);
      });
    });
  });
};
