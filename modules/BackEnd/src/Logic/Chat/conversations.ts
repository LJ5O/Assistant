import { Response } from 'express';
import { AuthenticatedRequest } from '../../Types/API';
import {BrainManager} from '../../BrainHandle/BrainHandle'
import { ConversationsRequest, AvailableConversations } from '../../Types/BrainHandle';

export function conversations(req:AuthenticatedRequest, res:Response, brain:BrainManager):void{
    if(req.user?.login){

        const userId = req.user.login as string

        const request: ConversationsRequest = {
            type: "ConversationsRequest",
            user_id: userId
        }

        brain.ask(request)
        .then(answer => {
            console.log(answer)
            res.status(200).json(answer as AvailableConversations)
        })
        .catch(e=>{
            console.error(e)
            res.status(504).json({ error: 'Timeout.' })
        })

    }else{
        res.status(422).json({ error: 'Missing or invalid fields in body.' })
    }
}