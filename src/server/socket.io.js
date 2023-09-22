import { Server } from 'socket.io';
import { JSONweb } from './formatted.js';
import dotenv from 'dotenv';
import { setRandomAvailablePoint, validateBiomeCollision, biomeMatrixSolid } from './biome.js';
import pathfinding from 'pathfinding';
import { getDistance, getId, insertTransitionCoordinates, newInstance, range, round10 } from './common.js';

dotenv.config();

const ioHost = `ws://localhost:${process.env.PORT}`;
const globalTimeEventInterval = 50;
const types = ['user', 'bot', 'skills'];
const elements = {};
const params = {};

types.map((type) => ((elements[type] = []), (params[type] = {})));

const ioClientSRC = `
  const ioHost = ${JSONweb(ioHost)};
  const types = ${JSONweb(types)};
  const globalTimeEventInterval = ${globalTimeEventInterval};
        `;

const clients = [];

// Create arrays for levels and experience limits
const levels = [];
const experienceLimits = [];

// Define the base experience and growth factor
const baseExperience = 100; // You can adjust this value
const growthFactor = 1.5; // You can adjust this value

// Calculate the experience limits for levels 1 to 100
range(1, 100).map((level) => {
  // Calculate the experience required for the current level using an exponential formula
  const experienceRequired = Math.floor(baseExperience * Math.pow(growthFactor, level - 1));

  // Add the level and its corresponding experience limit to the arrays
  levels.push(level);
  experienceLimits.push(experienceRequired);
});

// Print the arrays to see the results
// console.log('Levels:', levels);
// console.log('Experience Limits:', experienceLimits);

const baseStats = (options) => {
  return {
    dimFactor: 1,
    direction: 'down',
    status: 'new',
    life: 50,
    lifeRegeneration: 5,
    lifeRegenerationInterval: 500,
    maxLife: 100,
    energy: 50,
    energyRegeneration: 5,
    energyRegenerationInterval: 500,
    maxEnergy: 100,
    vel: 0.2,
    level: 0,
    xp: 0,
    physicalDamage: 10,
    ...options,
  };
};

const components = {
  background: (options) => {
    return {
      id: 'background',
      color: 'red',
      visible: true,
      active: false,
      ...options,
    };
  },
  sprites: (options) => {
    return {
      id: 'sprites',
      spriteType: 'skins',
      spriteId: 'anon',
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
      visible: true,
      active: true,
      ...options,
    };
  },
  'life-bar': (options) => {
    return {
      id: 'life-bar',
      visible: true,
      active: true,
      ...options,
    };
  },
  skills: (options) => {
    return {
      id: 'skills',
      skill: 'red-stone',
      costs: {
        energy: 1,
        level: 0,
      },
      element: {
        vel: 0.5,
        components: [
          components['sprites']({
            frameInterval: 200,
            spriteType: 'skills',
            spriteId: 'red-stone',
            positions: [
              {
                sprites: { stop: { id: '08', frames: 2 }, mov: { id: '08', frames: 2 } },
                directions: ['left', 'down-left', 'up-left', 'right', 'down-right', 'up-right', 'down', 'up'],
              },
            ],
          }),
        ],
      },
      bonus: {
        physicalDamage: 5,
      },
      params: {
        lifeTime: 500,
        triggerVel: 200,
        effectVel: 50,
      },
      visible: true,
      active: true,
      ...options,
    };
  },
};

range(0, 30).map((i) => {
  const bot = setRandomAvailablePoint(
    baseStats({
      components: [components['background'](), components['sprites']({ spriteId: 'purple' }), components['life-bar']()],
      id: getId(elements.bot, 'id', 'bot-'),
    })
  );
  const biomeMatrixSolidBot = biomeMatrixSolid.map((vy, y) =>
    vy.map((vx, x) => {
      if (validateBiomeCollision({ ...bot, x, y })) return 1;
      return 0;
    })
  );
  params.bot[bot.id] = {
    path: [],
    biomeMatrixSolid: biomeMatrixSolidBot,
    originX: newInstance(bot.x),
    originY: newInstance(bot.y),
    rangePositionSearch: 2,
    searchTarget: true,
  };
  elements.bot.push(bot);
});

const formattedPath = (type, element) => {
  if (element.vel < 1)
    params[type][element.id].path = insertTransitionCoordinates(
      params[type][element.id].path,
      round10(1 / element.vel)
    );
  else if (round10(element.vel) > 1)
    params[type][element.id].path = params[type][element.id].path
      .map((point, i) => (i % round10(element.vel) === 0 ? point : null))
      .filter((point) => point !== null);
  params[type][element.id].path = params[type][element.id].path.filter((p) => Array.isArray(p));
};

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

  const finder = new pathfinding.AStarFinder({
    allowDiagonal: true, // enable diagonal
    dontCrossCorners: true, // corner of a solid
    heuristic: pathfinding.Heuristic.chebyshev,
  });

  ioServer.on('connection', (socket) => {
    // const headers = socket.handshake.headers;
    // const ip = socket.handshake.address;
    console.log(`socket.io | connection id: ${socket.id}`);
    const type = 'user';
    const user = setRandomAvailablePoint(
      baseStats({
        components: [
          components['background']({ color: 'blue' }),
          components['sprites']({ spriteId: 'eiri' }),
          components['life-bar'](),
          components['skills'](),
        ],
        vel: 0.5,
        id: socket.id,
      })
    );
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
    elements.bot.map((bot, i) => socket.emit('bot', JSON.stringify(bot)));
    elements.skills.map((skills, i) => socket.emit('skills', JSON.stringify(skills)));

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
          // console.log(`socket.io | update ${type} ${args}`);
          clients.map((client, i) => {
            if (i !== clientIndex) client.emit(type, args);
          });
          break;
        default:
          break;
      }
    });

    socket.on('skills', (...args) => {
      const skillEvent = JSON.parse(args);
      const skillData = components['skills']({ id: skillEvent.id });
      const skillElement = baseStats({
        ...skillData.element,
        ...skillEvent.element,
        id: getId(elements.skills, 'id', `${skillEvent.id}-`),
      });
      // console.log('On skillElement', skillElement);
      elements['skills'].push(skillElement);
      clients.map((client) => client.emit('skills', JSON.stringify(skillElement)));
      params['skills'][skillElement.id] = {
        velInterval: setInterval(() => {
          switch (skillElement.direction) {
            case 'down':
              skillElement.y += skillElement.vel;
              break;
            case 'up':
              skillElement.y -= skillElement.vel;
              break;
            case 'left':
              skillElement.x -= skillElement.vel;
              break;
            case 'down-left':
              skillElement.y += skillElement.vel;
              skillElement.x -= skillElement.vel;
              break;
            case 'up-left':
              skillElement.y -= skillElement.vel;
              skillElement.x -= skillElement.vel;
              break;
            case 'right':
              skillElement.x += skillElement.vel;
              break;
            case 'down-right':
              skillElement.y += skillElement.vel;
              skillElement.x += skillElement.vel;
              break;
            case 'up-right':
              skillElement.y -= skillElement.vel;
              skillElement.x += skillElement.vel;
              break;
            default:
              break;
          }
          clients.map((client) =>
            client.emit(
              'skills',
              JSON.stringify({ x: skillElement.x, y: skillElement.y, id: skillElement.id, status: 'update' })
            )
          );
        }, globalTimeEventInterval),
      };
      setTimeout(() => {
        clearInterval(params['skills'][skillElement.id].velInterval);
        delete params['skills'][skillElement.id];
        elements['skills'] = elements['skills'].filter((e) => e.id !== skillElement.id);
        clients.map((client) => client.emit('skills', JSON.stringify({ id: skillElement.id, status: 'disconnect' })));
      }, skillData.params.lifeTime);
    });
  });

  elements.bot.map((bot, i) => {
    setInterval(() => {
      elements['user'].map((user, iu) => {
        if (getDistance(elements.bot[i].x, elements.bot[i].y, user.x, user.y) < 3 && params.bot[bot.id].searchTarget) {
          params.bot[bot.id].searchTarget = false;
          params.bot[bot.id].path = params.bot[bot.id].path = finder.findPath(
            round10(elements.bot[i].x),
            round10(elements.bot[i].y),
            round10(user.x),
            round10(user.y),
            new pathfinding.Grid(params.bot[bot.id].biomeMatrixSolid)
          );
          formattedPath('bot', bot);
          setTimeout(() => {
            params.bot[bot.id].searchTarget = true;
          }, globalTimeEventInterval * params.bot[bot.id].path.length * 0.8);
        }
      });

      if (params.bot[bot.id].path.length === 0 && params.bot[bot.id].searchTarget) {
        while (params.bot[bot.id].path.length === 0) {
          const endPositionBot = setRandomAvailablePoint(
            { ...bot },
            {
              originX: params.bot[bot.id].originX,
              originY: params.bot[bot.id].originY,
              rangePositionSearch: params.bot[bot.id].rangePositionSearch,
            }
          );
          params.bot[bot.id].path = finder.findPath(
            round10(elements.bot[i].x),
            round10(elements.bot[i].y),
            endPositionBot.x,
            endPositionBot.y,
            new pathfinding.Grid(params.bot[bot.id].biomeMatrixSolid)
          );
        }
        formattedPath('bot', bot);
      }
      if (params.bot[bot.id].path[0]) {
        elements.bot[i].x = params.bot[bot.id].path[0][0];
        elements.bot[i].y = params.bot[bot.id].path[0][1];
        clients.map((client) =>
          client.emit(
            'bot',
            JSON.stringify({
              status: 'update',
              x: elements.bot[i].x,
              y: elements.bot[i].y,
              id: elements.bot[i].id,
            })
          )
        );
        params.bot[bot.id].path.shift();
      }
    }, globalTimeEventInterval);
  });

  return ioServer;
};

export { io, ioClientSRC };
