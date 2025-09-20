"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchDeleteItems = void 0;
const chunk_1 = __importDefault(require("lodash/chunk"));
function batchDeleteItems(dbClient, table, keys) {
    // batchWriteItem accepts maximum of 25 items, 16 MB total and 400KB per each item
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchWriteItem.html
    // Make chunks of 25 items
    const batches = chunk_1.default(keys, 25);
    return Promise.all(batches.map(x => dbClient
        .batchWrite({
        RequestItems: {
            [table.name]: x.map(key => ({
                DeleteRequest: {
                    Key: key,
                },
            })),
        },
    })
        .promise()));
}
exports.batchDeleteItems = batchDeleteItems;
