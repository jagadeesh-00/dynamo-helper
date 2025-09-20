import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { TableConfig } from '../types';
/**
 * Delete item matching specified key
 * @param pk partition key value
 * @param sk sort key value
 */
export declare function deleteItem(dbClient: DocumentClient, table: TableConfig, key: DocumentClient.Key): Promise<PromiseResult<DocumentClient.DeleteItemOutput, AWSError>>;
