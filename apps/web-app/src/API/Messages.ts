import axios from 'axios';
import { useRouter } from 'vue-router';

import { getStoredToken } from './utils'

export async function sendMessage(message:string):any{//TODO : return type
    /**
     * Function that tries to send a message written by User to the back-end and Python brain subprocess
     * Needs token to be stored / user to be logged-in
     */

    const token = getStoredToken()
    if(!token){
        console.error("Please, login again before using the app !")
        useRouter().push('/');
        return null
    }

    try{
        const answer = await axios.post('http://127.0.0.1:3000/ask',
            { // Body JSON content
                message
            },
            {// Config
                timeout: 10000,//10s
                headers: {authorization: token}// Auth header is mandatory
            })
        if(answer.data.type!=="UserAnswer") throw new Error("Type of object we received is not the one we are waiting for !");
        return answer.data
    }catch(err){
        console.error(err)
        return null;
    }
}