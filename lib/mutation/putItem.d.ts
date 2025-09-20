import { AnyObject, TableConfig } from '../types';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk';
/**
 * Writes item in database.
 * If provided keys already exists then it is replaced
 * @param item object to put
 */
export declare function putItem<T extends AnyObject>(dbClient: DocumentClient, table: TableConfig, item: T): Promise<PromiseResult<DocumentClient.PutItemOutput, AWSError>>;
