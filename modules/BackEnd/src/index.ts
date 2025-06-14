import express, { Express } from 'express';
import cors from 'cors';

import {defineRoutes} from './Routes/routes';

const PORT = 3000;

const app:Express = express();
app.use(express.json());
app.use(cors());

defineRoutes(app);


app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`Docs Swagger sur http://localhost:${PORT}/docs`);
});
