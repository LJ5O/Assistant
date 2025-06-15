import {describe, expect, test} from '@jest/globals';

import {multiply} from '../src/temp'

describe('add', () => {
  test('should add two numbers', () => {
    expect(multiply(2,5)).toBe(10);
  });
});