// server.js
import { createServer } from 'http';
import next from 'next';
import { initIO } from './lib/socket';

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

const httpServer = createServer(handle);
const io = initIO(httpServer)

global.io = io

app.prepare().then(() => {
  

  io.on('connection', (socket: any) => {
    console.log('Yeni bir istemci bağlandı');

    socket.on('join-room', (roomId: any) => {
      socket.join(roomId);
      console.log(`İstemci ${roomId} odasına katıldı`);
    });

    socket.on('leave-room', (roomId: any) => {
      socket.leave(roomId);
      console.log(`İstemci ${roomId} odasından ayrıldı`);
    });
  });

  httpServer.listen(port, () => {
    console.log(`> Sunucu http://${hostname}:${port} adresinde çalışıyor`);
  });
});
