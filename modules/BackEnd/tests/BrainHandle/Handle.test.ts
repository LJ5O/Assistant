import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';

import {BrainManager} from '../../src/BrainHandle/BrainHandle'
import {UserRequest, UserAnswer, History, HistoryRequest, ConversationsRequest, AvailableConversations} from '../../src/Types/BrainHandle'

describe('Python subprocess can be used', () => {
    let brain: BrainManager;

    // ----- Preparation for tests -----
    beforeAll(async () => {
        brain = new BrainManager("../Brain/src/main.py");
        await brain.start("test");
    });

    // ----- Stopping the subprocess -----
    afterAll(async () => {
        brain.stop();

        // Wait again, so the subprocess can stop properly
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    // ----- Tests on the subprocess -----
    test('Subprocess is up and ready', async () => {
        await expect(brain.getSubprocess()).not.toBeNull()
    });

    test('Waiting without any message available rejects', async () => {
        const error = new Error("Timeout waiting for message with UUID: uuid")
        await expect(brain.getAnswerFromBrain("uuid", 100)).rejects.toEqual(error)
    });

    test('We can send a request to the subprocess', async () => {
        const input:UserRequest = {
            type: "UserRequest",
            thread_id: "default",
            fields: {
                input: "Hello World!",
                linked: []
            }
        }
        const output:UserAnswer = await brain.ask(input) as UserAnswer
        expect(output.fields.output).toBe('OK')
    });

    test('Message history can be retrieved', async () => {
        const input:UserRequest = {
            type: "UserRequest",
            thread_id: "default",
            fields: {
                input: "Hello History !",
                linked: []
            }
        }
        await brain.ask(input) // Message is sent to subprocess

        const historyRequest:HistoryRequest = {
            type: "HistoryRequest",
            thread_id: "default"
        }
        const hist:History = await brain.ask(historyRequest) as History // And now, we try to get it from the history request
        let userMessages:string[] = []

        for(let i=0; i<hist.messages.length; i++){
            if(hist.messages[i].type == "HumanMessage"){
                userMessages.push(hist.messages[i].content)
            }
        }

        expect(userMessages).toContain("Hello History !")
    }, 10000);

    test('We can retrieve previous conversations', async () => {
        const input:UserRequest = {
            type: "UserRequest",
            thread_id: "user123.convToRetrieve456",
            fields: {
                input: "Hello World!",
                linked: []
            }
        }
        const output:UserAnswer = await brain.ask(input) as UserAnswer
        expect(output.fields.output).toBe('OK')

        const request:ConversationsRequest = {
            type: "ConversationsRequest",
            user_id: "user123"
        }
        const answer:AvailableConversations = await brain.ask(request) as AvailableConversations
        expect(answer.user_id).toBe('user123')
        expect(answer.threads).toEqual(["user123.convToRetrieve456"])
    });
});