import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AnyObject, Filter, TableConfig } from '../types';
/**
 * Cursor based query which returns list of matching items and the last cursor position
 *
 * @param {Filter<T>} filter query filter
 * @param { QueryWithCursorOptions } options cursor, page size options
 * @returns {Array<T>, string} list of matching items, last cursor position
 */
export declare function queryWithCursor<T extends AnyObject>(dbClient: DocumentClient, table: TableConfig, filter: Filter<T>, indexName?: string): Promise<{
    items: Array<T>;
    cursor?: string;
    scannedCount: number;
}>;
