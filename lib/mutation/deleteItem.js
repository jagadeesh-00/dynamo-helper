"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteItem = void 0;
/**
 * Delete item matching specified key
 * @param pk partition key value
 * @param sk sort key value
 */
async function deleteItem(dbClient, table, key) {
    const index = table.indexes.default;
    if (!key || typeof key !== 'object' || Object.keys(key).length === 0) {
        throw new Error('Expected key to be of type object and not empty');
    }
    if (!key[index.partitionKeyName]) {
        throw new Error('Invalid key: expected key to contain at least partition key');
    }
    return dbClient
        .delete({
        TableName: table.name,
        Key: key,
    })
        .promise();
}
exports.deleteItem = deleteItem;
