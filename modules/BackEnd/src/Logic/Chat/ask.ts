import { Response } from 'express';
import { AuthenticatedRequest } from '../../Types/API';
import {BrainManager} from '../../BrainHandle/BrainHandle'
import { UserRequest, UserAnswer } from '../../Types/BrainHandle';

export function ask(req:AuthenticatedRequest, res:Response, brain:BrainManager):void{
    if(req.body?.message && req.body?.conversation && req.user?.login){

        const message = req.body.message as string // TODO : Avoid injections from clients that could cause trouble
        const userId = req.user.login as string
        const conversation = req.body.conversation as string

        const request: UserRequest = {
            type: "UserRequest",
            thread_id: userId+'.'+conversation,
            fields: {
                input: message,
                linked: []
            }
        }

        brain.ask(request)
        .then(answer => {
            res.status(200).json(answer as UserAnswer)
        })
        .catch(_=>{
            res.status(504).json({ error: 'Timeout.' }) // Known bug : Call with a LONG message that will timeout, and you have a lost subprocess message that nobody is awaiting
        })

    }else{
        res.status(422).json({ error: 'Missing or invalid fields in body.' })
    }
}