var io = require('socket.io').listen(80);

io.socket.on('connection', function(socket) {
  console.log('connected baby');
});
