"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchExists = void 0;
const batchGetItems_1 = require("./batchGetItems");
/**
 * Checks if the given keys of items exists in DB or not
 * @param keys list of keys to be checked
 * @returns list of keys that doesn't exist in DB, empty of all keys exists
 */
async function batchExists(dbClient, table, keys) {
    const index = table.indexes.default;
    const result = (await batchGetItems_1.batchGetItems(dbClient, table, keys, [
        index.partitionKeyName,
        index.sortKeyName,
    ])).filter(x => !!x);
    if (result.length !== keys.length) {
        const foundItemsKeyMap = result.map(x => Object.values(x).join(':+:'));
        const notFoundItems = keys.filter(x => !foundItemsKeyMap.includes(Object.values(x).join(':+:')));
        return notFoundItems;
    }
    return [];
}
exports.batchExists = batchExists;
