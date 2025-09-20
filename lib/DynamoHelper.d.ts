import { AWSError } from 'aws-sdk';
import { BatchWriteItemOutput, DeleteItemOutput, DocumentClient, PutItemOutput, TransactWriteItemsOutput, UpdateItemOutput } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AnyObject, ConditionExpressionInput, Filter, TableConfig } from './types';
export declare class DynamoHelper {
    table: TableConfig;
    dbClient: DocumentClient;
    /**
     * Create a DynamoHelper object
     * @param {string} region - The name of the region where the table is present
     * @param {string} table - The table name and indexes available
     * @param {string} endpoint - The endpoint of the database
     */
    constructor(table: TableConfig, region?: string, endpoint?: string);
    query<T extends AnyObject>(filter: Filter<T>, indexName?: string): Promise<Array<T>>;
    queryWithCursor<T extends AnyObject>(filter: Filter<T>, indexName?: string): Promise<{
        items: Array<T>;
        cursor?: string;
        scannedCount: number;
    }>;
    getItem<T extends AnyObject>(key: DocumentClient.Key, fields?: Array<keyof T>): Promise<T>;
    batchGetItems(keys: Array<{
        [name: string]: any;
    }>, fields?: Array<string>): Promise<Array<AnyObject>>;
    exists(key: DocumentClient.Key): Promise<boolean>;
    batchExists(keys: Array<DocumentClient.Key>): Promise<Array<DocumentClient.Key>>;
    deleteItem(key: DocumentClient.Key): Promise<PromiseResult<DeleteItemOutput, AWSError>>;
    batchDeleteItems(keys: Array<DocumentClient.Key>): Promise<Array<PromiseResult<BatchWriteItemOutput, AWSError>>>;
    putItem<T extends AnyObject>(item: T): Promise<PromiseResult<PutItemOutput, AWSError>>;
    batchPutItems(items: Array<AnyObject>): Promise<Array<PromiseResult<BatchWriteItemOutput, AWSError>>>;
    transactPutItems(items: Array<AnyObject>): Promise<PromiseResult<TransactWriteItemsOutput, AWSError>>;
    updateItem<T extends AnyObject>(key: DocumentClient.Key, item: T, conditions: ConditionExpressionInput[]): Promise<PromiseResult<UpdateItemOutput, AWSError>>;
}
