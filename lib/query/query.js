"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.query = void 0;
const queryBuilder_1 = require("./queryBuilder");
/**
 * Queries DynamoDB and returns list of matching items
 * @param {Filter<T>} filter query filter
 * @returns {Array<T>} list of matching items
 */
async function query(dbClient, table, filter, indexName) {
    const { partitionKeyName, sortKeyName } = table.indexes[indexName || 'default'];
    const params = queryBuilder_1.buildQueryTableParams(filter, partitionKeyName, sortKeyName);
    params.TableName = table.name;
    if (indexName) {
        params.IndexName = indexName;
    }
    let lastEvaluatedKey;
    let items = [];
    do {
        if (lastEvaluatedKey) {
            params.ExclusiveStartKey = lastEvaluatedKey;
        }
        const result = await dbClient.query(params).promise();
        items = items.concat(result.Items);
        lastEvaluatedKey = result.LastEvaluatedKey;
    } while (lastEvaluatedKey);
    return items;
}
exports.query = query;
