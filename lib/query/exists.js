"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.exists = void 0;
const getItem_1 = require("./getItem");
/**
 * Checks if an item with a given pk sk combo exists in DB or not
 * @param pk partition key value
 * @param sk sort key value
 * @returns {Boolean} exists or not
 */
async function exists(dbClient, table, key) {
    const item = await getItem_1.getItem(dbClient, table, key, ['id']);
    return item ? true : false;
}
exports.exists = exists;
