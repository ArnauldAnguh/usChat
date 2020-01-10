"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getUsersInRoom = exports.getUser = exports.removeUser = exports.addUser = void 0;
var users = [];

var addUser = function addUser(_ref) {
  var id = _ref.id,
      name = _ref.name,
      room = _ref.room;
  name = name.trim().toLowerCase();
  room = room.trim().toLowerCase();
  var existingUser = users.find(function (user) {
    return user.room === room && user.name === name;
  });
  if (!name || !room) return {
    error: 'Username and room are required.'
  };
  if (existingUser) return {
    error: 'Username is taken.'
  };
  var user = {
    id: id,
    name: name,
    room: room
  };
  users.push(user);
  return {
    user: user
  };
};

exports.addUser = addUser;

var removeUser = function removeUser(id) {
  var index = users.findIndex(function (user) {
    return user.id === id;
  });
  if (index !== -1) return users.splice(index, 1)[0];
};

exports.removeUser = removeUser;

var getUser = function getUser(id) {
  return users.find(function (user) {
    return user.id === id;
  });
};

exports.getUser = getUser;

var getUsersInRoom = function getUsersInRoom(room) {
  return users.filter(function (user) {
    return user.room === room;
  });
};

exports.getUsersInRoom = getUsersInRoom;
//# sourceMappingURL=users.js.map