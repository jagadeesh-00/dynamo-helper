"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testUtils_1 = require("../testUtils");
const putItem_1 = require("./putItem");
describe('putItem', () => {
    const putItem = putItem_1.putItem.bind(null, testUtils_1.testClient, testUtils_1.testTableConf);
    const spy = jest.spyOn(testUtils_1.testClient, 'put');
    beforeEach(() => {
        spy.mockReturnValue({
            promise: jest.fn().mockResolvedValue({}),
        });
    });
    test('validates input', async () => {
        await expect(putItem(undefined)).rejects.toThrowError('Expected on argument of type object received undefined');
        await expect(putItem('')).rejects.toThrowError('Expected on argument of type object received string');
        await expect(putItem(2)).rejects.toThrowError('Expected on argument of type object received number');
        await expect(putItem(null)).rejects.toThrowError('Expected on argument of type object received null');
        await expect(putItem(NaN)).rejects.toThrowError('Expected on argument of type object received number');
    });
    test('uses put to write item to db', async () => {
        await putItem({ pk: 'xxxx', sk: 'yyyy', id: 'xxxx' });
        expect(spy).toHaveBeenCalledWith({
            Item: { pk: 'xxxx', sk: 'yyyy', id: 'xxxx' },
            TableName: testUtils_1.testTableConf.name,
        });
    });
    test('promise rejection', async () => {
        spy.mockReturnValue({
            promise: jest.fn().mockRejectedValue({}),
        });
        await expect(putItem({ pk: 'xxxx', sk: 'yyyy', id: 'xxxx' })).rejects.toStrictEqual({});
    });
});
