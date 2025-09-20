"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testUtils_1 = require("../testUtils");
const exists_1 = require("./exists");
describe('exists', () => {
    const exists = exists_1.exists.bind(null, testUtils_1.testClient, testUtils_1.testTableConf);
    const spy = jest.spyOn(testUtils_1.testClient, 'get');
    beforeEach(() => {
        spy.mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Item: null }),
        });
    });
    test('validates arguments', async () => {
        await expect(exists(undefined)).rejects.toThrowError('Expected key to be of type object and not empty');
        await expect(exists(null)).rejects.toThrowError('Expected key to be of type object and not empty');
        await expect(exists('null')).rejects.toThrowError('Expected key to be of type object and not empty');
        await expect(exists(2, '')).rejects.toThrowError('Expected key to be of type object and not empty');
    });
    test('returns boolean value', async () => {
        // No results found, hence empty list.
        // getItem will return null in this case
        await expect(exists({ pk: 'xxxx', sk: 'yyyy' })).resolves.toBe(false);
        spy.mockReturnValue({
            promise: jest.fn().mockResolvedValue({ Item: { id: 'xxxx' } }),
        });
        await expect(exists({ pk: 'xxxx', sk: 'yyyy' })).resolves.toBe(true);
    });
});
