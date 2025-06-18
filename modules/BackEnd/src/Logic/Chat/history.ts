import { Response } from 'express';
import { AuthenticatedRequest } from '../../Types/API';
import {BrainManager} from '../../BrainHandle/BrainHandle'
import { History, HistoryRequest } from '../../Types/BrainHandle';

export function history(req:AuthenticatedRequest, res:Response, brain:BrainManager):void{
    if(req.user?.login){

        const userId = req.user.login as string

        const request: HistoryRequest = {
            type: "HistoryRequest",
            thread_id: userId
        }

        brain.askHistory(request)
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