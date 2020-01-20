"use strict";

var _express = _interopRequireDefault(require("express"));

var _socket = _interopRequireDefault(require("socket.io"));

var _http = _interopRequireDefault(require("http"));

var _cors = _interopRequireDefault(require("cors"));

var _router = _interopRequireDefault(require("./router"));

var _users = require("./controllers/users.js");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var app = (0, _express["default"])();

var server = _http["default"].createServer(app);

var io = (0, _socket["default"])(server);
io.on('connect', function (socket) {
  socket.on('join', function (_ref, callback) {
    var name = _ref.name,
        room = _ref.room;

    var _addUser = (0, _users.addUser)({
      id: socket.id,
      name: name,
      room: room
    }),
        error = _addUser.error,
        user = _addUser.user;

    if (error) return callback(error);
    socket.join(user.room);
    socket.emit('message', {
      user: 'admin 🗣️',
      text: "".concat(user.name, " , welcome to room ").concat(user.room, "."),
      role: 'admin',
      when: new Date().valueOf()
    });
    socket.broadcast.to(user.room).emit('message', {
      user: 'admin 🗣️ ',
      text: "".concat(user.name, " has joined!"),
      role: 'admin',
      when: new Date().valueOf()
    });
    io.to(user.room).emit('roomData', {
      room: user.room,
      users: (0, _users.getUsersInRoom)(user.room)
    });
    callback();
  });
  socket.on('sendMessage', function (message, callback) {
    var user = (0, _users.getUser)(socket.id);
    io.to(user.room).emit('message', {
      id: socket.id,
      user: user.name,
      text: message,
      when: new Date().valueOf()
    });
    callback();
  });
  socket.on('disconnect', function () {
    var user = (0, _users.removeUser)(socket.id);

    if (user) {
      io.to(user.room).emit('message', {
        user: 'admin' + '🗣️',
        text: "".concat(user.name, " has left."),
        role: 'admin',
        when: new Date().valueOf()
      });
      io.to(user.room).emit('roomData', {
        room: user.room,
        users: (0, _users.getUsersInRoom)(user.room)
      });
    }
  });
}); // CORS Error Handling

app.use(function (req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');

  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    res.status(200).json({});
  }

  next();
});
app.use(_router["default"]);
var PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log("Server connected on PORT ".concat(PORT));
});
//# sourceMappingURL=index.js.map