"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testUtils_1 = require("../testUtils");
const query_1 = require("./query");
describe('query', () => {
    const query = query_1.query.bind(null, testUtils_1.testClient, testUtils_1.testTableConf);
    jest.spyOn(testUtils_1.testClient, 'query').mockReturnValue({
        promise: jest.fn().mockResolvedValue({ Items: [] }),
    });
    test('with only partition key', async () => {
        await query({
            where: {
                pk: 'xxxx',
            },
        });
        expect(testUtils_1.testClient.query).toHaveBeenCalledWith({
            TableName: testUtils_1.testTableConf.name,
            KeyConditionExpression: '#PK = :pk',
            ExpressionAttributeNames: {
                '#PK': 'pk',
            },
            ExpressionAttributeValues: {
                ':pk': 'xxxx',
            },
        });
    });
    test('input validation', async () => {
        await expect(query({
            where: {
                pk: {
                    beginsWith: 'product',
                },
            },
        })).rejects.toThrowError('Partition key condition can only be a string');
    });
    test('when there are no results, returns empty', async () => {
        const results = await query({
            where: {
                pk: 'xxxx',
            },
        });
        expect(results.length).toBe(0);
    });
    test('with index name specified', () => {
        query({
            where: {
                sk: 'xxxx',
            },
        }, 'reverse');
        expect(testUtils_1.testClient.query).toHaveBeenCalledWith({
            TableName: testUtils_1.testTableConf.name,
            IndexName: 'reverse',
            KeyConditionExpression: '#SK = :sk',
            ExpressionAttributeNames: {
                '#SK': 'sk',
            },
            ExpressionAttributeValues: {
                ':sk': 'xxxx',
            },
        });
    });
    test('result if pagination is not enabled has all items', async () => {
        testUtils_1.testClient.query = jest.fn().mockImplementation((params) => {
            const isFirstRequest = params.ExclusiveStartKey === undefined;
            return {
                promise: jest.fn().mockResolvedValue({
                    Items: [isFirstRequest ? { id: 'xxxx' } : { id: 'yyyy' }],
                    LastEvaluatedKey: isFirstRequest ? { pk: 'xxxx' } : undefined,
                }),
            };
        });
        await query({
            where: { pk: 'xxxx' },
        });
        expect(testUtils_1.testClient.query).toHaveBeenCalledTimes(2);
    });
});
