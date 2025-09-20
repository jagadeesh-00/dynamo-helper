"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.testClient = exports.testTableConf = void 0;
exports.testTableConf = {
    name: 'sample-table',
    indexes: {
        default: {
            partitionKeyName: 'pk',
            sortKeyName: 'sk',
        },
        reverse: {
            partitionKeyName: 'sk',
            sortKeyName: 'pk',
        },
    },
};
exports.testClient = {
    query: jest.fn().mockReturnThis(),
    scan: jest.fn().mockReturnThis(),
    get: jest.fn().mockReturnThis(),
    put: jest.fn().mockReturnThis(),
    write: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    batchGet: jest.fn().mockReturnThis(),
    batchWrite: jest.fn().mockReturnThis(),
    transactWrite: jest.fn().mockReturnThis(),
    promise: jest.fn(),
    update: jest.fn().mockReturnThis(),
};
