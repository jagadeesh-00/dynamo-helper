import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AnyObject, Filter, TableConfig } from '../types';
/**
 * Queries DynamoDB and returns list of matching items
 * @param {Filter<T>} filter query filter
 * @returns {Array<T>} list of matching items
 */
export declare function query<T extends AnyObject>(dbClient: DocumentClient, table: TableConfig, filter: Filter<T>, indexName?: string): Promise<Array<T>>;
