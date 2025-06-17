import { Express, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import jwt from 'jsonwebtoken';

import {SWAGGER_CONFIG} from './swaggerConfig'

import { ask } from '../Logic/Chat/ask'
import { BrainManager } from '../BrainHandle/BrainHandle';
const SECRET_KEY = 'change-moi'; // TODO : Move to env var or .env file

function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const token:string|undefined = req.headers['authorization'] || undefined;

    if(!token){
        return res.status(401).json({ error: 'You must provide a token !' });
    }

    jwt.verify(token, SECRET_KEY, (err, user)=>{
        if(err){
            return res.status(403).json({ error: 'This Token is not valid !' });
        }

        console.log(user); // TODO : remove this test print

        next();
    });
}

export function defineRoutes(app:Express){
    app.get('/hello', (req, res) => {
        authenticateToken(req, res, ()=>{
            res.json({ message: 'Hello World' });
        });  
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

    app.post('/ask', (req, res) => {
        authenticateToken(req, res, ()=>{
            const handle = new BrainManager("./../Brain/src/main.py")
            handle.start()
            ask(req, res, handle)
            handle.stop()
        });
    });

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(SWAGGER_CONFIG));
}