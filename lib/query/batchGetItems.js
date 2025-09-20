"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.batchGetItems = void 0;
const chunk_1 = __importDefault(require("lodash/chunk"));
const keyBy_1 = __importDefault(require("lodash/keyBy"));
const flatten_1 = __importDefault(require("lodash/flatten"));
/**
 * Get many items from the db matching the provided keys
 * @param keys array of key maps. eg: [{ pk: '1', sk: '2'}]
 * @returns list of items
 */
async function batchGetItems(dbClient, table, keys, fields) {
    let result;
    let unProcessedKeys = [];
    // Chunk requests to bits of 100s as max items per batchGet operation is 100
    // https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_BatchGetItem.html
    if (keys.length > 100) {
        const results = await Promise.all(chunk_1.default(keys, 100).map(x => batchGetItems(dbClient, table, x)));
        return flatten_1.default(results);
    }
    const items = [];
    const { partitionKeyName, sortKeyName } = table.indexes.default;
    const fieldsToProject = fields ? [...fields] : undefined;
    // If projection fields is given, add tables primary keys there by default
    if (fieldsToProject) {
        if (!fieldsToProject.includes(partitionKeyName)) {
            fieldsToProject.push(partitionKeyName);
        }
        if (!fieldsToProject.includes(sortKeyName)) {
            fieldsToProject.push(sortKeyName);
        }
    }
    do {
        result = await dbClient
            .batchGet({
            RequestItems: {
                [table.name]: {
                    Keys: unProcessedKeys.length > 0 ? unProcessedKeys : keys,
                    ProjectionExpression: fieldsToProject
                        ? fieldsToProject.join(',')
                        : undefined,
                },
            },
        })
            .promise();
        if (result.UnprocessedKeys && result.UnprocessedKeys[table.name]) {
            unProcessedKeys = result.UnprocessedKeys[table.name].Keys;
        }
        items.push(...(result.Responses[table.name] || []));
    } while (unProcessedKeys.length > 0);
    // DynamoDB doesn't return results in any order
    // To support dataloader pattern, sort result in same order as keys
    const itemsHash = keyBy_1.default(items, x => `${x[partitionKeyName]}::${x[sortKeyName]}`);
    return keys.map(x => itemsHash[`${x[partitionKeyName]}::${x[sortKeyName]}`]);
}
exports.batchGetItems = batchGetItems;
