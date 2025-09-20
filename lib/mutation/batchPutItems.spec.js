"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fill_1 = __importDefault(require("lodash/fill"));
const testUtils_1 = require("../testUtils");
const batchPutItems_1 = require("./batchPutItems");
describe('batchPutItems', () => {
    const batchPutItems = batchPutItems_1.batchPutItems.bind(null, testUtils_1.testClient, testUtils_1.testTableConf);
    const spy = jest.spyOn(testUtils_1.testClient, 'batchWrite');
    beforeEach(() => {
        spy.mockClear();
        spy.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        });
    });
    test('exports function', () => {
        expect(typeof batchPutItems).toBe('function');
    });
    test('promise rejection', async () => {
        spy.mockReturnValue({
            promise: jest.fn().mockRejectedValue([]),
        });
        await expect(batchPutItems([{}, {}])).rejects.toStrictEqual([]);
    });
    test('chunks items to bits of 25 items', async () => {
        await batchPutItems([{}, {}]);
        expect(spy).toHaveBeenCalledTimes(1);
        await batchPutItems(fill_1.default(Array(50), {}));
        expect(spy).toHaveBeenCalledTimes(3);
        await batchPutItems(fill_1.default(Array(201), {}));
        expect(spy).toHaveBeenCalledTimes(12);
    });
    test('uses batchWrite correctly', async () => {
        await batchPutItems([
            { pk: 'x', sk: '1' },
            { pk: 'y', sk: '2' },
        ]);
        expect(spy).toHaveBeenCalledWith({
            RequestItems: {
                [testUtils_1.testTableConf.name]: [
                    {
                        PutRequest: {
                            Item: { pk: 'x', sk: '1' },
                        },
                    },
                    {
                        PutRequest: {
                            Item: { pk: 'y', sk: '2' },
                        },
                    },
                ],
            },
        });
    });
});
