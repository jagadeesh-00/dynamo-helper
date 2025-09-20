"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fill_1 = __importDefault(require("lodash/fill"));
const testUtils_1 = require("../testUtils");
const batchGetItems_1 = require("./batchGetItems");
describe('batchGetItems', () => {
    const batchGetItems = batchGetItems_1.batchGetItems.bind(null, testUtils_1.testClient, testUtils_1.testTableConf);
    const spy = jest.spyOn(testUtils_1.testClient, 'batchGet');
    beforeEach(() => {
        spy.mockClear();
        spy.mockReturnValue({
            promise: jest.fn().mockResolvedValue({
                Responses: {
                    [testUtils_1.testTableConf.name]: [],
                },
            }),
        });
    });
    test('returns list of matching items', async () => {
        await expect(batchGetItems([])).resolves.toHaveLength(0);
        spy.mockImplementation(() => {
            return {
                promise: jest.fn().mockResolvedValue({
                    Responses: {
                        [testUtils_1.testTableConf.name]: [{ id: 'xxxx' }],
                    },
                }),
            };
        });
        await expect(batchGetItems([{ pk: 'xxxx', sk: 'yyyy' }])).resolves.toHaveLength(1);
    });
    test('return value if no result found', async () => {
        await expect(batchGetItems([])).resolves.toHaveLength(0);
        await expect(batchGetItems([{ pk: 'xxxx', sk: 'yyyy' }])).resolves.toStrictEqual([undefined]);
    });
    test('chunks requests into 100s', async () => {
        spy.mockImplementation((params) => {
            return {
                promise: jest.fn().mockResolvedValue({
                    Responses: {
                        [testUtils_1.testTableConf.name]: params.RequestItems[testUtils_1.testTableConf.name].Keys,
                    },
                }),
            };
        });
        await expect(batchGetItems([{}, {}]));
        expect(spy).toHaveBeenCalledTimes(1);
        await expect(batchGetItems(fill_1.default(Array(100), {})));
        expect(spy).toHaveBeenCalledTimes(2);
        const results = await batchGetItems(fill_1.default(Array(301), {}));
        expect(spy).toHaveBeenCalledTimes(6);
        expect(results).toHaveLength(301);
    });
    test('returns all matches if pagination is not enabled', async () => {
        spy.mockImplementation((params) => {
            const isFirstRequest = params.RequestItems[testUtils_1.testTableConf.name].Keys[0].pk === 'xxxx';
            return {
                promise: jest.fn().mockResolvedValue({
                    Responses: {
                        [testUtils_1.testTableConf.name]: [
                            isFirstRequest ? { id: 'xxxx' } : { id: 'yyyy' },
                        ],
                    },
                    UnprocessedKeys: {
                        [testUtils_1.testTableConf.name]: {
                            Keys: isFirstRequest ? [{ pk: 'aaaa', sk: 'bbbb' }] : [],
                        },
                    },
                }),
            };
        });
        await batchGetItems([
            { pk: 'xxxx', sk: 'yyyy' },
            { pk: 'aaaa', sk: 'bbbb' },
        ]);
        expect(spy).toHaveBeenCalledTimes(2);
    });
    test('fields to project', async () => {
        await batchGetItems([{ pk: 'xxxx', sk: 'yyyy' }], ['id']);
        expect(spy).toHaveBeenCalledWith({
            RequestItems: {
                [testUtils_1.testTableConf.name]: {
                    Keys: [{ pk: 'xxxx', sk: 'yyyy' }],
                    ProjectionExpression: 'id,pk,sk',
                },
            },
        });
    });
    test('fields to project including primary keys', async () => {
        await batchGetItems([{ pk: 'xxxx', sk: 'yyyy' }], ['id', 'pk', 'sk']);
        expect(spy).toHaveBeenCalledWith({
            RequestItems: {
                [testUtils_1.testTableConf.name]: {
                    Keys: [{ pk: 'xxxx', sk: 'yyyy' }],
                    ProjectionExpression: 'id,pk,sk',
                },
            },
        });
    });
    test('fields to project with different key names', async () => {
        await batchGetItems_1.batchGetItems(testUtils_1.testClient, {
            ...testUtils_1.testTableConf,
            indexes: {
                default: {
                    partitionKeyName: 'key1',
                    sortKeyName: 'key2',
                },
            },
        }, [{ pk: 'xxxx', sk: 'yyyy' }], ['id']);
        expect(spy).toHaveBeenCalledWith({
            RequestItems: {
                [testUtils_1.testTableConf.name]: {
                    Keys: [{ pk: 'xxxx', sk: 'yyyy' }],
                    ProjectionExpression: 'id,key1,key2',
                },
            },
        });
    });
    test('result is in the same order as keys', async () => {
        spy.mockReturnValue({
            promise: jest.fn().mockResolvedValueOnce({
                Responses: {
                    [testUtils_1.testTableConf.name]: [
                        { pk: '5', sk: '6', id: 'c' },
                        { pk: '1', sk: '2', id: 'a' },
                        { pk: '3', sk: '4', id: 'b' },
                    ],
                },
            }),
        });
        const result = await batchGetItems([
            { pk: '1', sk: '2' },
            { pk: '3', sk: '4' },
            { pk: '5', sk: '6' },
        ], ['id']);
        expect(result).toStrictEqual([
            { pk: '1', sk: '2', id: 'a' },
            { pk: '3', sk: '4', id: 'b' },
            { pk: '5', sk: '6', id: 'c' },
        ]);
    });
});
