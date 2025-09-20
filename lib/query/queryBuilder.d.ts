import { AnyObject, DynamoDBOperators, Filter, FilterOperators, QueryInput } from '../types';
/**
 * Lookup for filter operator and DynamoDB supported operator
 * @param operator to lookup
 * @returns {DynamoDBOperators} dynamo db operator
 */
export declare function keyOperatorLookup(operator: FilterOperators): DynamoDBOperators;
/**
 * Creates DynamoDB Table Query Input params from filter expression given
 * Note: Output does not include TableName or IndexName
 * If pk and sk condition are given as string then they are matched using KeyConditionExpression
 * Otherwise via FilterCondition (which should be used with SCAN operation)
 * @param {Filter<T>} filter for querying data
 * @param {string} partitionKeyName name of partition key to be matched (default: pk)
 * @param {string} sortKeyName name of sort key to be matched (default: sk)
 * @returns { QueryInput } table query params
 */
export declare function buildQueryTableParams<T extends object = AnyObject>(filter: Filter<T>, partitionKeyName?: string, sortKeyName?: string): QueryInput;
