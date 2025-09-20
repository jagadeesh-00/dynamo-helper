import {
  AnyObject,
  DynamoDBOperators,
  Filter,
  FilterOperators,
  Where,
  QueryInput,
  Direction,
} from '../types';

/**
 * Lookup for filter operator and DynamoDB supported operator
 * @param operator to lookup
 * @returns {DynamoDBOperators} dynamo db operator
 */
export function keyOperatorLookup(
  operator: FilterOperators,
): DynamoDBOperators {
  switch (operator) {
    case 'eq':
      return '=';
    case 'neq':
      return '<>';
    case 'lt':
      return '<';
    case 'lte':
      return '<=';
    case 'gt':
      return '>';
    case 'gte':
      return '>=';
    case 'inq':
      return 'IN';
    case 'between':
      return 'BETWEEN';
    case 'like':
      return 'CONTAINS';
    case 'beginsWith':
      return 'BEGINS_WITH';
    case 'exists':
      return 'EXISTS';
    default:
      return '=';
  }
}

/**
 * Input param validator. Returns error message if any validation error occurs
 * @param filter Input filter params
 * @param partitionKeyName partition key
 * @param sortKeyName sort key
 * @returns null if there are no error. String if there are errors
 */
function validateInput<T extends object = AnyObject>(
  filter: Filter<T>,
  partitionKeyName: string,
  sortKeyName: string,
): string | null {
  if (!filter || typeof filter !== 'object') {
    return `Expected one argument of type Filter<T> received ${typeof filter}`;
  } else if (
    typeof partitionKeyName !== 'string' &&
    typeof sortKeyName !== 'string'
  ) {
    return `Expected three arguments of type Filter<T>, string, string received ${typeof filter}, ${typeof partitionKeyName}, ${typeof sortKeyName}`;
  } else if (typeof partitionKeyName !== 'string') {
    return `Expected two arguments of type Filter<T>, string, received ${typeof filter}, ${typeof partitionKeyName}`;
  } else if (typeof sortKeyName !== 'string') {
    return `Expected three arguments of type Filter<T>, string, string received ${typeof filter}, ${typeof partitionKeyName}, ${typeof sortKeyName}`;
  } else if (!partitionKeyName || !sortKeyName) {
    return 'Expected $partitionKeyName(string), $sortKeyName(string) to not be empty';
  }

  // Validate filter
  if (!filter.where || typeof filter.where !== 'object') {
    return 'Partition key condition is required for query operation';
  }

  if (filter.where && filter.where[partitionKeyName] === undefined) {
    return 'Partition key condition is required for query operation';
  } else if (
    filter.where &&
    typeof filter.where[partitionKeyName] !== 'string'
  ) {
    return 'Partition key condition can only be a string';
  }

  if (
    filter.limit !== undefined &&
    (typeof filter.limit !== 'number' || filter.limit <= 0)
  ) {
    return 'Limit should be a number greater than 0';
  }

  return null;
}

function buildConditionExpressions<T extends object = AnyObject>(
  where: Where<T>,
  partitionKeyName: string,
  sortKeyName: string,
): Partial<QueryInput> {
  const expressionAttributeNames: Record<string, string> = {};
  const expressionAttributeValues: Record<string, any> = {};
  const keyConditionExpression: string[] = [];
  const filterExpression: string[] = [];
  let valueCounter = 0;

  const getUniqueValueKey = (): string => {
    valueCounter++;
    return `val${valueCounter}`;
  };

  const processNestedKey = (key: string): { keyName: string; attributeNames: Record<string, string> } => {
    const keyParts = key.split('.');
    const attributeNames: Record<string, string> = {};

    const keyName = keyParts
      .map(part => {
        const upperPart = part.toUpperCase();
        const alias = `#${upperPart}`;
        attributeNames[alias] = part;
        return alias;
      })
      .join('.');

    return { keyName, attributeNames };
  };

  const buildCondition = (
    key: string,
    condition: any,
  ): string | null => {
    const { keyName, attributeNames } = processNestedKey(key);
    Object.assign(expressionAttributeNames, attributeNames);

    if (condition === null || condition === undefined) {
      const valueKey = `:${getUniqueValueKey()}`;
      expressionAttributeValues[valueKey] = condition;
      return `${keyName} = ${valueKey}`;
    }

    if (typeof condition === 'object' && condition.constructor.name === 'Object') {
      const operators = Object.keys(condition);
      const conditionParts: string[] = [];

      for (const operator of operators) {
        const value = condition[operator];
        const dynamoOperator = keyOperatorLookup(operator as FilterOperators);

        if (dynamoOperator === 'EXISTS') {
          conditionParts.push(
            value ? `attribute_exists(${keyName})` : `attribute_not_exists(${keyName})`
          );
        } else if (dynamoOperator === 'BETWEEN') {
          const startKey = `:${getUniqueValueKey()}`;
          const endKey = `:${getUniqueValueKey()}`;
          expressionAttributeValues[startKey] = value[0];
          expressionAttributeValues[endKey] = value[1];
          conditionParts.push(`${keyName} ${dynamoOperator} ${startKey} AND ${endKey}`);
        } else if (dynamoOperator === 'IN') {
          const valueKeys = value.map(() => `:${getUniqueValueKey()}`);
          valueKeys.forEach((valueKey: string, index: number) => {
            expressionAttributeValues[valueKey] = value[index];
          });
          conditionParts.push(`${keyName} ${dynamoOperator} (${valueKeys.join(', ')})`);
        } else if (dynamoOperator === 'CONTAINS' || dynamoOperator === 'BEGINS_WITH') {
          const valueKey = `:${getUniqueValueKey()}`;
          expressionAttributeValues[valueKey] = value;
          conditionParts.push(`${dynamoOperator.toLowerCase()}(${keyName}, ${valueKey})`);
        } else {
          const valueKey = `:${getUniqueValueKey()}`;
          expressionAttributeValues[valueKey] = value;
          conditionParts.push(`${keyName} ${dynamoOperator} ${valueKey}`);
        }
      }

      return conditionParts.length > 1 ? `(${conditionParts.join(' AND ')})` : conditionParts[0];
    } else if (Array.isArray(condition)) {
      if (condition.length === 2 && typeof condition[0] !== 'object') {
        const startKey = `:${getUniqueValueKey()}`;
        const endKey = `:${getUniqueValueKey()}`;
        expressionAttributeValues[startKey] = condition[0];
        expressionAttributeValues[endKey] = condition[1];
        return `${keyName} BETWEEN ${startKey} AND ${endKey}`;
      } else {
        const valueKeys = condition.map(() => `:${getUniqueValueKey()}`);
        valueKeys.forEach((valueKey: string, index: number) => {
          expressionAttributeValues[valueKey] = condition[index];
        });
        return `${keyName} IN (${valueKeys.join(', ')})`;
      }
    } else {
      const valueKey = `:${getUniqueValueKey()}`;
      expressionAttributeValues[valueKey] = condition;
      return `${keyName} = ${valueKey}`;
    }
  };

  const buildWhereClause = (whereClause: Where<T>): string => {
    if ('and' in whereClause) {
      const andConditions = whereClause.and.map(subClause => buildWhereClause(subClause));
      return `(${andConditions.join(' AND ')})`;
    }

    if ('or' in whereClause) {
      const orConditions = whereClause.or.map(subClause => buildWhereClause(subClause));
      return `(${orConditions.join(' OR ')})`;
    }

    const conditions: string[] = [];

    Object.keys(whereClause).forEach(key => {
      const condition = whereClause[key];

      if (key === partitionKeyName) {
        const conditionStr = buildCondition(key, condition);
        if (conditionStr) {
          keyConditionExpression.push(conditionStr);
        }
      } else if (key === sortKeyName) {
        const conditionStr = buildCondition(key, condition);
        if (conditionStr) {
          keyConditionExpression.push(conditionStr);
        }
      } else {
        const conditionStr = buildCondition(key, condition);
        if (conditionStr) {
          conditions.push(conditionStr);
        }
      }
    });

    return conditions.length > 1 ? `(${conditions.join(' AND ')})` : conditions[0] || '';
  };

  const filterCondition = buildWhereClause(where);
  if (filterCondition) {
    filterExpression.push(filterCondition);
  }

  const tableParams = {
    KeyConditionExpression: keyConditionExpression.join(' AND '),
    FilterExpression: filterExpression.join(' AND '),
    ExpressionAttributeNames: expressionAttributeNames,
    ExpressionAttributeValues: expressionAttributeValues,
  } as Partial<QueryInput>;

  if (!tableParams.FilterExpression) {
    delete tableParams.FilterExpression;
  }

  if (!tableParams.KeyConditionExpression) {
    delete tableParams.KeyConditionExpression;
  }

  return tableParams;
}

/**
 * Creates DynamoDB Table Query Input params from filter expression given
 * Note: Output does not include TableName or IndexName
 * If pk and sk condition are given as string then they are matched using KeyConditionExpression
 * Otherwise via FilterCondition (which should be used with SCAN operation)
 * @param {Filter<T>} filter for querying data
 * @param {string} partitionKeyName name of partition key to be matched (default: pk)
 * @param {string} sortKeyName name of sort key to be matched (default: sk)
 * @returns { QueryInput } table query params
 */
export function buildQueryTableParams<T extends object = AnyObject>(
  filter: Filter<T>,
  partitionKeyName = 'pk',
  sortKeyName = 'sk',
): QueryInput {
  // Strictly validate argument type
  const errors = validateInput(filter, partitionKeyName, sortKeyName);

  if (errors) {
    throw new Error(errors);
  }

  // Construct query for Amazon DynamoDB
  // Extract keys and filter conditions
  const tableParams = filter.where
    ? (buildConditionExpressions(
        filter.where,
        partitionKeyName,
        sortKeyName,
      ) as QueryInput)
    : ({} as QueryInput);

  // Add projection attribute expressions
  // if at least one field is provided filter is applied
  if (filter.fields && filter.fields.length > 0) {
    const fields = [...filter.fields, partitionKeyName, sortKeyName];
    tableParams.ProjectionExpression = fields.join(',');
  }

  // Apply limit parameter. If set result will only contain X number of items
  if (filter.limit) {
    tableParams.Limit = filter.limit;
  }

  // Specifies the order for index traversal
  // If true (default),the traversal is performed in ascending order
  // if false, the traversal is performed in descending order.
  if (filter.orderBy) {
    tableParams.ScanIndexForward = filter.orderBy === Direction.ASC;
  }

  return tableParams;
}
