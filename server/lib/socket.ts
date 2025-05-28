// lib/socket.js
import { Server } from 'socket.io';

let io: Server;

export function initIO(server: any) {
  io = new Server(server, {
    path: '/api/socketio',
  });

  console.log("IO: ", io)

  return io;
}

export function getIO() {
    console.log("GET IO: ", io)
  if (!io) {
    throw new Error('Socket.IO henüz başlatılmadı.');
  }
  return io;
}
