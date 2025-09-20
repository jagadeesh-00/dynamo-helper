"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testUtils_1 = require("../testUtils");
const deleteItem_1 = require("./deleteItem");
describe('deleteItem', () => {
    const deleteItem = deleteItem_1.deleteItem.bind(null, testUtils_1.testClient, testUtils_1.testTableConf);
    const spy = jest.spyOn(testUtils_1.testClient, 'delete');
    beforeEach(() => {
        spy.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        });
    });
    beforeEach(() => {
        spy.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        });
    });
    test('exports function', () => {
        expect(typeof deleteItem).toBe('function');
    });
    test('argument validation', async () => {
        await expect(deleteItem(undefined)).rejects.toThrowError('Expected key to be of type object and not empty');
        await expect(deleteItem(null)).rejects.toThrowError('Expected key to be of type object and not empty');
        await expect(deleteItem('null')).rejects.toThrowError('Expected key to be of type object and not empty');
        await expect(deleteItem(2, '')).rejects.toThrowError('Expected key to be of type object and not empty');
    });
    test('key validation', async () => {
        await expect(deleteItem({ id: 'string' })).rejects.toThrowError('Invalid key: expected key to contain at least partition key');
        await expect(deleteItem({ pk: 'string' })).resolves.not.toThrow();
        // Custom partition key name in table config
        await expect(deleteItem_1.deleteItem(testUtils_1.testClient, { ...testUtils_1.testTableConf, indexes: { default: { partitionKeyName: 'id' } } }, { id: 'string' })).resolves.not.toThrow();
    });
    test('promise rejection', async () => {
        spy.mockReturnValue({
            promise: jest.fn().mockRejectedValue([]),
        });
        await expect(deleteItem({ pk: 'xxxx', sk: 'yyyy' })).rejects.toStrictEqual([]);
    });
    test('uses delete correctly', async () => {
        await deleteItem({ pk: 'xxxx', sk: 'yyyy' });
        expect(spy).toHaveBeenCalledWith({
            TableName: testUtils_1.testTableConf.name,
            Key: {
                pk: 'xxxx',
                sk: 'yyyy',
            },
        });
    });
});
