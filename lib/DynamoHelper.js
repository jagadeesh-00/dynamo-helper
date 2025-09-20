"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DynamoHelper = void 0;
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const batchDeleteItems_1 = require("./mutation/batchDeleteItems");
const batchPutItems_1 = require("./mutation/batchPutItems");
const deleteItem_1 = require("./mutation/deleteItem");
const putItem_1 = require("./mutation/putItem");
const transactPutItems_1 = require("./mutation/transactPutItems");
const updateItem_1 = require("./mutation/updateItem");
const batchExists_1 = require("./query/batchExists");
const batchGetItems_1 = require("./query/batchGetItems");
const exists_1 = require("./query/exists");
const getItem_1 = require("./query/getItem");
const query_1 = require("./query/query");
const queryWithCursor_1 = require("./query/queryWithCursor");
class DynamoHelper {
    /**
     * Create a DynamoHelper object
     * @param {string} region - The name of the region where the table is present
     * @param {string} table - The table name and indexes available
     * @param {string} endpoint - The endpoint of the database
     */
    constructor(table, region, endpoint) {
        this.dbClient = new dynamodb_1.DocumentClient({
            region,
            endpoint,
        });
        this.table = table;
    }
    async query(filter, indexName) {
        return query_1.query(this.dbClient, this.table, filter, indexName);
    }
    async queryWithCursor(filter, indexName) {
        return queryWithCursor_1.queryWithCursor(this.dbClient, this.table, filter, indexName);
    }
    async getItem(key, fields) {
        return getItem_1.getItem(this.dbClient, this.table, key, fields);
    }
    async batchGetItems(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    keys, fields) {
        return batchGetItems_1.batchGetItems(this.dbClient, this.table, keys, fields);
    }
    async exists(key) {
        return exists_1.exists(this.dbClient, this.table, key);
    }
    async batchExists(keys) {
        return batchExists_1.batchExists(this.dbClient, this.table, keys);
    }
    async deleteItem(key) {
        return deleteItem_1.deleteItem(this.dbClient, this.table, key);
    }
    async batchDeleteItems(keys) {
        return batchDeleteItems_1.batchDeleteItems(this.dbClient, this.table, keys);
    }
    async putItem(item) {
        return putItem_1.putItem(this.dbClient, this.table, item);
    }
    async batchPutItems(items) {
        return batchPutItems_1.batchPutItems(this.dbClient, this.table, items);
    }
    async transactPutItems(items) {
        return transactPutItems_1.transactPutItems(this.dbClient, this.table, items);
    }
    async updateItem(key, item, conditions) {
        return updateItem_1.updateItem(this.dbClient, this.table, key, conditions, item);
    }
}
exports.DynamoHelper = DynamoHelper;
