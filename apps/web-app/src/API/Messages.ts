import axios from 'axios';

import { getStoredToken } from './Utils'
import type { UserAnswer, History, AvailableConversations } from './Types/Types'

export async function sendMessage(message:string, conversation:string):Promise<UserAnswer>{
    /**
     * Function that tries to send a message written by User to the back-end and Python brain subprocess
     * Needs token to be stored / user to be logged-in
     */

    const token = getStoredToken()
    if(!token){
        console.error("Please, login again before using the app !")
        throw new Error("No valid token")
    }

    try{
        const answer = await axios.post('http://127.0.0.1:3000/ask',
            { // Body JSON content
                message,
                conversation
            },
            {// Config
                timeout: 10000,//10s
                headers: {authorization: token}// Auth header is mandatory
            })
            
        const data:UserAnswer = answer.data
        if(data.type!=="UserAnswer") throw new Error("Type of object we received is not the one we are waiting for !");
        return answer.data
    }catch(err){
        throw err
    }
}

export async function getHistory(thread:string) {
    /**
     * Get the list of all sent messages
     */
    const token = getStoredToken()
    if(!token){
        console.error("Please, login again before using the app !")
        throw new Error("No valid token")
    }

    try{
        const answer = await axios.get('http://127.0.0.1:3000/history',
            {// Config
                timeout: 10000,//10s
                headers: {authorization: token},// Auth header is mandatory
                params: {
                    conversation: thread
                }
            })
            
        const data:History = answer.data
        if(data.type!=="History") throw new Error("Type of object we received is not the one we are waiting for !");
        return answer.data
    }catch(err){
        throw err
    }
}

export async function getAvailableConversations():Promise<AvailableConversations> {
    /**
     * Get a list of every conversations availables for your account
     */
    const token = getStoredToken() // TODO : merge that with others functions
    if(!token){
        console.error("Please, login again before using the app !")
        throw new Error("No valid token")
    }

    try{
        const answer = await axios.get('http://127.0.0.1:3000/conversations',
            {// Config
                timeout: 10000,//10s
                headers: {authorization: token}// Auth header is mandatory
            })
            
        const data:AvailableConversations = answer.data
        if(data.type!=="AvailableConversations") throw new Error("Type of object we received is not the one we are waiting for !");//TODO also merge that
        return answer.data
    }catch(err){
        throw err
    }
}