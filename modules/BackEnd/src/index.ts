import express, { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import {defineRoutes} from './Routes/routes';

const PORT = 3000;

const app:Express = express();

defineRoutes(app);


app.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`Docs Swagger sur http://localhost:${PORT}/docs`);
});
