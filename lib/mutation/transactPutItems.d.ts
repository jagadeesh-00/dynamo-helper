import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AnyObject, TableConfig } from '../types';
/**
 * Put multiple items in the DB as a transaction
 * Operation fails if any one of the item operation fails
 * @param items List of items
 */
export declare function transactPutItems(dbClient: DocumentClient, table: TableConfig, items: Array<AnyObject>): Promise<PromiseResult<DocumentClient.TransactWriteItemsOutput, AWSError>>;
