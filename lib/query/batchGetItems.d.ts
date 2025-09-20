import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AnyObject, TableConfig } from '../types';
/**
 * Get many items from the db matching the provided keys
 * @param keys array of key maps. eg: [{ pk: '1', sk: '2'}]
 * @returns list of items
 */
export declare function batchGetItems(dbClient: DocumentClient, table: TableConfig, keys: DocumentClient.Key[], fields?: Array<string>): Promise<Array<AnyObject>>;
