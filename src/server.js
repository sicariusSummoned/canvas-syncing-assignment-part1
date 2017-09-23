const http = require('http');
const fs = require('fs');
const socketio = require('socket.io');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

let score = 0;


const onRequest = (request, response) => {
  fs.readFile(`${__dirname}/../client/index.html`, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, {
      'Content-Type': 'text/html',
    });
    response.end(data);
  });
};

const app = http.createServer(onRequest).listen(port);
app.listen(port);


const io = socketio(app);


io.on('connection', (socket) => {
  socket.join('room1');

  socket.on('updateScore', (data) => {
    score += data;

    io.sockets.in('room1').emit('updated', score);
  });

  socket.on('disconnect', () => {
    socket.leave('room1');
  });
});


console.log(`Listening on 127.0.0.1: ${port}`);
