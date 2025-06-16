import {describe, expect, test} from '@jest/globals';

import {BrainManager} from '../../src/BrainHandle/BrainHandle'

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
});