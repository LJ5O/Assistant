import { Request } from 'express';

export interface UserData{
    login: string
}

export interface AuthenticatedRequest extends Request {
    user?: UserData;
}