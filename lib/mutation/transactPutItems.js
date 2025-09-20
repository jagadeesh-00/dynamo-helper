"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactPutItems = void 0;
/**
 * Put multiple items in the DB as a transaction
 * Operation fails if any one of the item operation fails
 * @param items List of items
 */
function transactPutItems(dbClient, table, items) {
    return dbClient
        .transactWrite({
        TransactItems: items.map(x => ({
            Put: {
                TableName: table.name,
                Item: x,
            },
        })),
    })
        .promise();
}
exports.transactPutItems = transactPutItems;
