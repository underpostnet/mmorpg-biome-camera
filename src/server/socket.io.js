import { Server } from 'socket.io';
import { JSONweb } from './formatted.js';
import dotenv from 'dotenv';
import { setRandomAvailablePoint } from './biome.js';
dotenv.config();

const ioHost = `ws://localhost:${process.env.PORT}`;

const types = ['user', 'bot'];
const elements = {};
types.map((type) => (elements[type] = []));

const ioSSR = `
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
    const user = setRandomAvailablePoint({
      vel: 0.3,
      dimFactor: 1,
      direction: 'left',
      status: 'new',
      components: [
        {
          id: 'background',
          color: 'red',
          active: false,
          visible: true,
        },
        {
          id: 'skins',
          skin: 'agent',
          frameInterval: 200,
          positions: [
            { sprites: { stop: { id: '02', frames: 0 }, mov: { id: '12', frames: 1 } }, directions: ['up'] },
            {
              sprites: { stop: { id: '04', frames: 0 }, mov: { id: '14', frames: 1 } },
              directions: ['left', 'down-left', 'up-left'],
            },
            {
              sprites: { stop: { id: '06', frames: 0 }, mov: { id: '16', frames: 1 } },
              directions: ['right', 'down-right', 'up-right'],
            },
            { sprites: { stop: { id: '08', frames: 0 }, mov: { id: '18', frames: 1 } }, directions: ['down'] },
          ],
          active: true,
        },
      ],
      id: socket.id,
    });
    elements[type].push(user);
    clients.push(socket);
    const clientIndex = clients.indexOf(socket);
    console.log(`socket.io | currents clients: ${clients.length}`);
    socket.emit(type, JSON.stringify(user));
    clients.map((client, i) => {
      if (i !== clientIndex) {
        client.emit(type, JSON.stringify(user));
        socket.emit(type, JSON.stringify({ ...elements[type][i], status: 'new' }));
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
      switch (element.status) {
        case 'update':
          const clientIndex = clients.indexOf(socket);
          delete element.id;
          Object.keys(element).map((attr) => {
            elements[type][clientIndex][attr] = element[attr];
          });
          console.log(`socket.io | update ${type} ${args}`);
          clients.map((client, i) => {
            if (i !== clientIndex) client.emit(type, args);
          });
          break;
        default:
          break;
      }
    });
  });

  return ioServer;
};

export { io, ioSSR };
