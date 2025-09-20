import { AWSError } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AnyObject, TableConfig } from '../types';
export declare function batchPutItems(dbClient: DocumentClient, table: TableConfig, items: Array<AnyObject>): Promise<Array<PromiseResult<DocumentClient.BatchWriteItemOutput, AWSError>>>;
