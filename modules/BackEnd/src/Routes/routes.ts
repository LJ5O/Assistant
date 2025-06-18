import { Express, Request, Response, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import jwt from 'jsonwebtoken';

import {SWAGGER_CONFIG} from './swaggerConfig'

import { ask } from '../Logic/Chat/ask'
import { BrainManager } from '../BrainHandle/BrainHandle';
import { UserData, AuthenticatedRequest } from '../Types/API';

const SECRET_KEY = 'change-moi'; // TODO : Move to env var or .env file

function authenticateToken(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    const token:string|undefined = req.headers['authorization'] || undefined;

    if(!token){
        return res.status(401).json({ error: 'You must provide a token !' });
    }

    jwt.verify(token, SECRET_KEY, (err, user)=>{//user should be UserData typeS
        if(err){
            return res.status(403).json({ error: 'This Token is not valid !' });
        }

        console.log(user); // TODO : remove this test print
        req.user = user as UserData
        next();
    });
}

export function defineRoutes(app:Express, brain:BrainManager){
    app.get('/hello', (req, res) => {
        authenticateToken(req, res, ()=>{
            res.json({ message: 'Hello World' });
        });  
    });

    app.post('/login', (req:Request, res:Response) => {
        const { username, password } = req.body;

        // Simule une authentification
        if (username === 'admin' && password === 'admin') {
            const token = jwt.sign({ login:username } as UserData, SECRET_KEY, { expiresIn: '1h' });
            res.json({ token });
        } else {
            res.status(401).json({ error: 'Invalid credentials' });
        }
    });

    app.post('/ask', (req:AuthenticatedRequest, res:Response) => {
        authenticateToken(req, res, ()=>{
            ask(req, res, brain)
        });
    });

    app.post('/history', (req:AuthenticatedRequest, res:Response) => {
        authenticateToken(req, res, ()=>{
            ask(req, res, brain)
        });
    });

    app.use('/docs', swaggerUi.serve, swaggerUi.setup(SWAGGER_CONFIG));
}