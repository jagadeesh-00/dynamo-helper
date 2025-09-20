"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const range_1 = __importDefault(require("lodash/range"));
const testUtils_1 = require("../testUtils");
const batchExists_1 = require("./batchExists");
describe('batchExists', () => {
    const batchExists = batchExists_1.batchExists.bind(null, testUtils_1.testClient, testUtils_1.testTableConf);
    const spy = jest.spyOn(testUtils_1.testClient, 'batchGet');
    beforeEach(() => {
        spy.mockClear();
        spy.mockImplementation((params) => {
            return {
                promise: jest.fn().mockResolvedValue({
                    Responses: {
                        [testUtils_1.testTableConf.name]: params.RequestItems[testUtils_1.testTableConf.name].Keys,
                    },
                }),
            };
        });
    });
    beforeEach(() => {
        spy.mockImplementation((params) => {
            return {
                promise: jest.fn().mockResolvedValue({
                    Responses: {
                        [testUtils_1.testTableConf.name]: params.RequestItems[testUtils_1.testTableConf.name].Keys,
                    },
                }),
            };
        });
    });
    test('returns empty if all keys exist', async () => {
        await expect(batchExists([
            { pk: '1', sk: '2' },
            { pk: '3', sk: '4' },
        ])).resolves.toHaveLength(0);
    });
    test('returns not found keys if not all items exist', async () => {
        spy.mockImplementation((params) => {
            const keys = params.RequestItems[testUtils_1.testTableConf.name].Keys;
            return {
                promise: jest.fn().mockResolvedValue({
                    Responses: {
                        [testUtils_1.testTableConf.name]: keys.slice(0, 1),
                    },
                }),
            };
        });
        await expect(batchExists([
            { pk: '1', sk: '2' },
            { pk: '3', sk: '4' },
        ])).resolves.toEqual([{ pk: '3', sk: '4' }]);
    });
    test('with 100 items', async () => {
        spy.mockImplementation((params) => {
            const keys = params.RequestItems[testUtils_1.testTableConf.name].Keys;
            return {
                promise: jest.fn().mockResolvedValue({
                    Responses: {
                        [testUtils_1.testTableConf.name]: keys.slice(0, Math.floor(keys.length / 2)),
                    },
                }),
            };
        });
        const keys = range_1.default(100).map((i) => ({
            pk: i + 'pk',
            sk: i + 'sk',
        }));
        await expect(batchExists(keys)).resolves.toEqual(keys.slice(50));
    });
});
