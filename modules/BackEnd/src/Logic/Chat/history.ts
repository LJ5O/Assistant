import { Response } from 'express';
import { AuthenticatedRequest } from '../../Types/API';
import {BrainManager} from '../../BrainHandle/BrainHandle'
import { History, HistoryRequest } from '../../Types/BrainHandle';

export function history(req:AuthenticatedRequest, res:Response, brain:BrainManager):void{
    if(req.user?.login && req.query?.conversation){

        const userId = req.user.login as string
        const conversation = req.query.conversation as string

        const request: HistoryRequest = {
            type: "HistoryRequest",
            // Add username part if not already done by client
            thread_id: conversation.includes('.') ? conversation : userId+'.'+conversation
        }

        if(request.thread_id.split('.')[0]!==userId){
            // Error, the user tried to access someone else conversations
            res.status(422).json({ error: 'Missing or invalid fields in body.' })
            return;
        }

        brain.ask(request)
        .then(answer => {
            res.status(200).json(answer as History)
        })
        .catch(_=>{
            res.status(504).json({ error: 'Timeout.' })
        })

    }else{
        res.status(422).json({ error: 'Missing or invalid fields in body.' })
    }
}