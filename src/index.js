import express from 'express';
import socketio from 'socket.io';
import http from 'http';
import cors from 'cors';
import route from './router';
import {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom
} from './controllers/users.js';

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connect', socket => {
  socket.on('join', ({ name, room }, callback) => {
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    socket.join(user.room);

    socket.emit('message', {
      user: 'admin 🗣️',
      text: `${user.name} , welcome to room ${user.room}.`,
      role: 'admin',
      when: new Date().valueOf()
    });
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin 🗣️ ',
      text: `${user.name} has joined!`,
      role: 'admin',
      when: new Date().valueOf()
    });

    io.to(user.room).emit('roomData', {
      room: user.room,
      users: getUsersInRoom(user.room)
    });

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);

    io.to(user.room).emit('message', {
      id: socket.id,
      user: user.name,
      text: message,
      when: new Date().valueOf()
    });

    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin' + '🗣️',
        text: `${user.name} has left.`,
        role: 'admin',
        when: new Date().valueOf()
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: getUsersInRoom(user.room)
      });
    }
  });
});
// CORS Error Handling
app.use(cors);
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    res.status(200).json({});
  }
  next();
});
app.use(route);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server connected on PORT ${PORT}`);
});
