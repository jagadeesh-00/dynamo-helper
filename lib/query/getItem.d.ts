import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AnyObject, TableConfig } from '../types';
/**
 * Get item by partition key and sort key
 * Both parameters are required
 * @param pk partition key
 * @param sk sort key
 * @returns {T} resolved item
 */
export declare function getItem<T extends AnyObject>(dbClient: DocumentClient, table: TableConfig, key: DocumentClient.Key, fields?: Array<keyof T>): Promise<T>;
