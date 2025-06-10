import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';

import {SWAGGER_CONFIG} from './swaggerConfig'

export function defineRoutes(app:Express){
    app.get('/hello', (req, res) => {
        res.json({ message: 'Hello World' });
    });

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(SWAGGER_CONFIG));
}