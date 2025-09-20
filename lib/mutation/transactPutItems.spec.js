"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testUtils_1 = require("../testUtils");
const transactPutItems_1 = require("./transactPutItems");
describe('transactPutItems', () => {
    const transactPutItems = transactPutItems_1.transactPutItems.bind(null, testUtils_1.testClient, testUtils_1.testTableConf);
    const spy = jest.spyOn(testUtils_1.testClient, 'transactWrite');
    beforeEach(() => {
        spy.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        });
    });
    test('exports function', () => {
        expect(typeof transactPutItems).toBe('function');
    });
    test('promise rejection', async () => {
        spy.mockReturnValue({
            promise: jest.fn().mockRejectedValue([]),
        });
        await expect(transactPutItems([{ pk: 'xxxx', sk: 'yyyy', id: 'xxxx' }])).rejects.toStrictEqual([]);
    });
    test('uses transactWrite', async () => {
        await transactPutItems([
            { pk: '1', sk: 'a', id: '1' },
            { pk: '2', sk: 'b', id: '2' },
        ]);
        expect(spy).toHaveBeenCalledWith({
            TransactItems: [
                {
                    Put: {
                        Item: { pk: '1', sk: 'a', id: '1' },
                        TableName: testUtils_1.testTableConf.name,
                    },
                },
                {
                    Put: {
                        Item: { pk: '2', sk: 'b', id: '2' },
                        TableName: testUtils_1.testTableConf.name,
                    },
                },
            ],
        });
    });
});
