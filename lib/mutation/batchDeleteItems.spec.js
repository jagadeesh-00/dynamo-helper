"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fill_1 = __importDefault(require("lodash/fill"));
const testUtils_1 = require("../testUtils");
const batchDeleteItems_1 = require("./batchDeleteItems");
describe('batchDeleteItems', () => {
    const batchDeleteItems = batchDeleteItems_1.batchDeleteItems.bind(null, testUtils_1.testClient, testUtils_1.testTableConf);
    const spy = jest.spyOn(testUtils_1.testClient, 'batchWrite');
    beforeEach(() => {
        spy.mockClear();
        spy.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        });
    });
    test('exports function', () => {
        expect(typeof batchDeleteItems).toBe('function');
    });
    test('promise rejection', async () => {
        spy.mockReturnValue({
            promise: jest.fn().mockRejectedValue([]),
        });
        await expect(batchDeleteItems([{}, {}])).rejects.toStrictEqual([]);
    });
    test('chunks items to bits of 25 items', async () => {
        await batchDeleteItems([{}, {}]);
        expect(spy).toHaveBeenCalledTimes(1);
        await batchDeleteItems(fill_1.default(Array(50), {}));
        expect(spy).toHaveBeenCalledTimes(3);
        await batchDeleteItems(fill_1.default(Array(201), {}));
        expect(spy).toHaveBeenCalledTimes(12);
    });
    test('uses batchWrite correctly', async () => {
        await batchDeleteItems([
            { pk: 'x', sk: '1' },
            { pk: 'y', sk: '2' },
        ]);
        expect(spy).toHaveBeenCalledWith({
            RequestItems: {
                [testUtils_1.testTableConf.name]: [
                    {
                        DeleteRequest: {
                            Key: { pk: 'x', sk: '1' },
                        },
                    },
                    {
                        DeleteRequest: {
                            Key: { pk: 'y', sk: '2' },
                        },
                    },
                ],
            },
        });
    });
});
