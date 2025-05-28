"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// server.js
const http_1 = require("http");
const next_1 = __importDefault(require("next"));
const socket_1 = require("./lib/socket");
const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;
const app = (0, next_1.default)({ dev, hostname, port });
const handle = app.getRequestHandler();
const httpServer = (0, http_1.createServer)(handle);
const io = (0, socket_1.initIO)(httpServer);
global.io = io;
app.prepare().then(() => {
    io.on('connection', (socket) => {
        console.log('Yeni bir istemci bağlandı');
        socket.on('join-room', (roomId) => {
            socket.join(roomId);
            console.log(`İstemci ${roomId} odasına katıldı`);
        });
        socket.on('leave-room', (roomId) => {
            socket.leave(roomId);
            console.log(`İstemci ${roomId} odasından ayrıldı`);
        });
    });
    httpServer.listen(port, () => {
        console.log(`> Sunucu http://${hostname}:${port} adresinde çalışıyor`);
    });
});
