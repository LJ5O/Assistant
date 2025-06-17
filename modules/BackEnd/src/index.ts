import express, { Express } from 'express';
import cors from 'cors';

import {defineRoutes} from './Routes/routes';
import { BrainManager } from './BrainHandle/BrainHandle';

const PORT = 3000;

const app:Express = express();
app.use(express.json());
app.use(cors());

const brain = new BrainManager("../Brain/src/main.py")
brain.start()

defineRoutes(app, brain);

process.on('SIGINT', () => {
  console.log('\nStopping...');
  brain.stop();
  process.exit();
});

app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`Docs Swagger sur http://localhost:${PORT}/docs`);
});
