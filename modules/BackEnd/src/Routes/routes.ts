import { Express } from 'express';
import swaggerUi from 'swagger-ui-express';
import jwt from 'jsonwebtoken';

import {SWAGGER_CONFIG} from './swaggerConfig'
const SECRET_KEY = 'change-moi'; // TODO : Move to env var or .env file

export function defineRoutes(app:Express){
    app.get('/hello', (req, res) => {
        res.json({ message: 'Hello World' });
    });

    app.post('/login', (req, res) => {
        const { username, password } = req.body;

        // Simule une authentification
        if (username === 'admin' && password === 'admin') {
            const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(SWAGGER_CONFIG));
}