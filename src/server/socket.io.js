import { Server } from 'socket.io';
import { JSONweb } from './formatted.js';
import dotenv from 'dotenv';
dotenv.config();

const matrixCells = 16;
const matrixCellsPaintByCell = 3;
const matrixCellsAmplitude = 2;
const ioHost = `ws://localhost:${process.env.PORT}`;

const types = ['user', 'bot'];
const elements = {};
types.map((type) => (elements[type] = []));

const ioSSR = `
  const matrixCells = ${matrixCells};
  const matrixCellsAmplitude = ${matrixCellsAmplitude};
  const matrixCellsPaintByCell = ${matrixCellsPaintByCell};
  const ioHost = ${JSONweb(ioHost)};
  const types = ${JSONweb(types)};
        `;

const clients = [];

const io = (httpServer) => {
  const ioServer = new Server(httpServer, {
    cors: {
      origin: `http://localhost:${process.env.PORT}`,
      // origins: [],
      methods: ['GET', 'POST', 'DELETE', 'PUT'],
      allowedHeaders: [
        'Access-Control-Allow-Headers',
        'Access-Control-Allow-Origin',
        'X-Requested-With',
        'X-Access-Token',
        'Content-Type',
        'Host',
        'Accept',
        'Connection',
        'Cache-Control',
      ],
      credentials: true,
    },
  });

  ioServer.on('connection', (socket) => {
    // const headers = socket.handshake.headers;
    // const ip = socket.handshake.address;
    console.log(`socket.io | connection id: ${socket.id}`);
    const type = 'user';
    const user = {
      x: 1,
      y: 1,
      vel: 0.3,
      components: [
        {
          id: 'background',
          color: 'red',
          active: true,
          visible: true,
        },
      ],
      id: socket.id,
      status: 'live',
    };
    elements[type].push(user);
    clients.push(socket);
    const clientIndex = clients.indexOf(socket);
    console.log(`socket.io | currents clients: ${clients.length}`);
    socket.emit(type, JSON.stringify(user));
    clients.map((client, i) => {
      if (i !== clientIndex) {
        client.emit(type, JSON.stringify(user));
        socket.emit(type, JSON.stringify(elements[type][i]));
      }
    });

    socket.on('disconnect', (reason) => {
      console.log(`socket.io | disconnect ${socket.id} due to reason: ${reason}`);
      const clientIndex = clients.indexOf(socket);
      clients.map((client, i) => {
        if (i !== clientIndex)
          client.emit(type, JSON.stringify({ id: elements[type][clientIndex].id, status: 'disconnect' }));
      });
      clients.splice(clientIndex, 1);
      elements[type].splice(clientIndex, 1);
      console.log(`socket.io | currents clients: ${clients.length}`);
    });

    socket.on(type, (...args) => {
      const element = JSON.parse(args);
      const clientIndex = clients.indexOf(socket);
      elements[type][clientIndex] = element;
      console.log(`socket.io | update ${type} ${args}`);
      clients.map((client, i) => {
        if (i !== clientIndex) client.emit(type, args);
      });
    });
  });

  return ioServer;
};

export { io, ioSSR };
