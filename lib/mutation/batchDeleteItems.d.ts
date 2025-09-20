import { AWSError } from 'aws-sdk';
import { BatchWriteItemOutput, DocumentClient } from 'aws-sdk/clients/dynamodb';
import { PromiseResult } from 'aws-sdk/lib/request';
import { TableConfig } from '../types';
export declare function batchDeleteItems(dbClient: DocumentClient, table: TableConfig, keys: Array<DocumentClient.Key>): Promise<Array<PromiseResult<BatchWriteItemOutput, AWSError>>>;
