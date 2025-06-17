import {afterAll, beforeAll, describe, expect, test} from '@jest/globals';

import {BrainManager} from '../../src/BrainHandle/BrainHandle'
import {UserRequest, UserAnswer} from '../../src/Types/BrainHandle'

describe('Python subprocess can be used', () => {
    let brain: BrainManager;

    // ----- Preparation for tests -----
    beforeAll(async () => {
        brain = new BrainManager("../Brain/src/main.py");
        brain.start("test");

        // Wait, so the subprocess can start
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    // ----- Stopping the subprocess -----
    afterAll(async () => {
        brain.stop();

        // Wait again, so the subprocess can stop properly
        await new Promise(resolve => setTimeout(resolve, 1000));
    });

    // ----- Tests on the subprocess -----
    test('Subprocess is up and ready', () => {
        expect(brain.getSubprocess()).not.toBeNull()
    });

    test('We can send a request to the subprocess', () => {
        const input:UserRequest = {
            type: "UserRequest",
            thread_id: "default",
            fields: {
                input: "Hello World!",
                linked: []
            }
        }
        brain.ask(input)
        while(!brain.isReady()){
            //Waiting for brain to be 100% ready ( "ready" received from subprocess )
        }
        brain.getAnswerFromBrain(2000)
        .then((answer)=>{
            const output:UserAnswer = JSON.parse(answer)
            expect(output.fields.output).toBe('OK')
        })
    });

    test('Waiting without any message available rejects', () => {
        const error = new Error("Timeout for answer awaiting")
        expect(brain.getAnswerFromBrain(500)).rejects.toEqual(error)
    });
});