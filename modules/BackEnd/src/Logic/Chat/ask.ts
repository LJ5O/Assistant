import { Request, Response } from 'express';
import {BrainManager} from '../../BrainHandle/BrainHandle'
import { UserRequest, UserAnswer } from '../../BrainHandle/Types';

export function ask(req:Request, res:Response, brain:BrainManager):void{
    if(req.body?.message){

        const message = req.body.message as string // TODO : Avoid injections from clients that could cause trouble

        const request: UserRequest = {
            type: "UserRequest",
            fields: {
                input: message,
                linked: []
            }
        }

        brain.ask(request)
        brain.getAnswerFromBrain(30000)
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