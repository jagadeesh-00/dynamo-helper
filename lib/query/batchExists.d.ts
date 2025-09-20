import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { TableConfig } from '../types';
/**
 * Checks if the given keys of items exists in DB or not
 * @param keys list of keys to be checked
 * @returns list of keys that doesn't exist in DB, empty of all keys exists
 */
export declare function batchExists(dbClient: DocumentClient, table: TableConfig, keys: Array<DocumentClient.Key>): Promise<Array<DocumentClient.Key>>;
