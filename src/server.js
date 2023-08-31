// server modules
import express from 'express';
import dotenv from 'dotenv';

import { createServer } from 'http';
import { io } from './server/socket.io.js';
import { views } from './server/views.js';
import { biomeRouter } from './api/biome/biome.router.js';

dotenv.config();

const app = express();

// parse requests of content-type - application/json
app.use(express.json({ limit: '100MB' }));

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true, limit: '20MB' }));

// json formatted response
app.set('json spaces', 2);

// api
biomeRouter(app);

// render views
views(app);

// instance server
const server = createServer({}, app);

// start socket.io
io(server);

server.listen(process.env.PORT, () => console.log(`Server is running on port ${process.env.PORT}`));
