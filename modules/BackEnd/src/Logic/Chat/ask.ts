import { Response } from 'express';
import { AuthenticatedRequest } from '../../Types/API';
import {BrainManager} from '../../BrainHandle/BrainHandle'
import { UserRequest, UserAnswer } from '../../Types/BrainHandle';

export function ask(req:AuthenticatedRequest, res:Response, brain:BrainManager):void{
    if(req.body?.message && req.user?.login){

        const message = req.body.message as string // TODO : Avoid injections from clients that could cause trouble
        const userId = req.user.login as string

        const request: UserRequest = {
            type: "UserRequest",
            thread_id: userId,
            fields: {
                input: message,
                linked: []
            }
        }

        brain.ask(request)
        brain.getAnswerFromBrain(30000)// Reduce this TODO
        .then(data=>{
            //TODO : Check that answer is REALLY for this client
            const output:UserAnswer = JSON.parse(data);
            res.status(200).json(output)
        })
        .catch(_=>{
            res.status(504).json({ error: 'Timeout.' })
        })

    }else{
        res.status(422).json({ error: 'Missing or invalid fields in body.' })
    }
}