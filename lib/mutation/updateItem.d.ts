import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AnyObject, ConditionExpressionInput, TableConfig } from '../types';
import { PromiseResult } from 'aws-sdk/lib/request';
import { AWSError } from 'aws-sdk';
/**
 * Update item in database conditionally.
 *
 * @param dbClient
 * @param table
 * @param key
 * @param conditions
 * @param item
 * @returns
 */
export declare function updateItem<T extends AnyObject>(dbClient: DocumentClient, table: TableConfig, key: DocumentClient.Key, conditions: ConditionExpressionInput[], item: T): Promise<PromiseResult<DocumentClient.UpdateItemOutput, AWSError>>;
