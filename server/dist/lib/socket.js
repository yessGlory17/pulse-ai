"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initIO = initIO;
exports.getIO = getIO;
// lib/socket.js
const socket_io_1 = require("socket.io");
let io;
function initIO(server) {
    io = new socket_io_1.Server(server, {
        path: '/api/socketio',
    });
    console.log("IO: ", io);
    return io;
}
function getIO() {
    console.log("GET IO: ", io);
    if (!io) {
        throw new Error('Socket.IO henüz başlatılmadı.');
    }
    return io;
}
