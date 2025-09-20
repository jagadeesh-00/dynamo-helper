"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.putItem = void 0;
/**
 * Writes item in database.
 * If provided keys already exists then it is replaced
 * @param item object to put
 */
async function putItem(dbClient, table, item) {
    if (item === null || item === undefined) {
        throw new Error(`Expected on argument of type object received ${item}`);
    }
    else if (typeof item !== 'object') {
        throw new Error(`Expected on argument of type object received ${typeof item}`);
    }
    return dbClient
        .put({
        Item: item,
        TableName: table.name,
    })
        .promise();
}
exports.putItem = putItem;
