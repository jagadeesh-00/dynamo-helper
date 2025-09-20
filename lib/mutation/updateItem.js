"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateItem = void 0;
const types_1 = require("../types");
const queryBuilder_1 = require("../query/queryBuilder");
const buildConditionExpressions = (conditionExpression) => {
    let expression = '';
    const attrValues = {};
    const attrNames = {};
    for (let i = 0; i < conditionExpression.length; i++) {
        const currentExpression = conditionExpression[i];
        if (currentExpression.kind === types_1.ConditionExpressionKind.AndOr) {
            if (i > 0) {
                expression += ` ${currentExpression.value} `;
            }
            continue;
        }
        if (currentExpression.kind === types_1.ConditionExpressionKind.Comparison) {
            const key = currentExpression.key;
            const comparator = currentExpression.comparator;
            const value = currentExpression.value;
            if (!comparator)
                continue;
            const operator = queryBuilder_1.keyOperatorLookup(comparator);
            const expressionName = `#key_${key}`;
            attrNames[expressionName] = key;
            if (operator === 'BETWEEN') {
                expression += `${expressionName} ${operator} :val${i}_1 AND :val${i}_2`;
                attrValues[`:val${i}_1`] = value[0];
                attrValues[`:val${i}_2`] = value[1];
            }
            else {
                expression += `${expressionName} ${operator} :val${i}`;
                attrValues[`:val${i}`] = value;
            }
        }
    }
    return { expression, attrValues, attrNames };
};
const buildUpdateExpressions = (item) => {
    var _a;
    const expressions = [];
    const expressionValues = {};
    const expressionNames = {};
    (_a = Object.keys(item)) === null || _a === void 0 ? void 0 : _a.forEach(key => {
        expressions.push(`#key_${key} = :val_${key}`);
        expressionNames[`#key_${key}`] = key;
        expressionValues[`:val_${key}`] = item[key];
    });
    return {
        expression: `SET ${expressions.join(', ')}`,
        attrValues: expressionValues,
        attrNames: expressionNames,
    };
};
/**
 * Update item in database conditionally.
 *
 * @param dbClient
 * @param table
 * @param key
 * @param conditions
 * @param item
 * @returns
 */
async function updateItem(dbClient, table, key, conditions, item) {
    if (!key || typeof key !== 'object' || Object.keys(key).length === 0) {
        throw new Error('Expected key to be of type object and not empty');
    }
    const conditionExpr = buildConditionExpressions(conditions);
    // exclude table keys from update expression
    const obj = Object.assign({}, item);
    delete obj[table.indexes.default.partitionKeyName];
    delete obj[table.indexes.default.sortKeyName];
    const updateExpr = buildUpdateExpressions(obj);
    const params = {
        TableName: table.name,
        Key: key,
        ConditionExpression: conditionExpr.expression,
        UpdateExpression: updateExpr.expression,
        ExpressionAttributeNames: 
        // merge condition and update expressions' names
        Object.assign({}, conditionExpr.attrNames, updateExpr.attrNames),
        ExpressionAttributeValues: 
        // merge condition and update expressions' values
        Object.assign({}, conditionExpr.attrValues, updateExpr.attrValues),
    };
    return dbClient.update(params).promise();
}
exports.updateItem = updateItem;
