"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
describe('utils', () => {
    test('encrypt returns undefined for undefined input', () => {
        const value = utils_1.encrypt(undefined, 'secret');
        expect(value).toBeUndefined();
    });
    test('decrypt returns undefined for undefined input', () => {
        const value = utils_1.decrypt(undefined, 'secret');
        expect(value).toBeUndefined();
    });
    test('encrypt & decrypts the string', () => {
        const masked = utils_1.encrypt('Hello World!', 'secret');
        const unmasked = utils_1.decrypt(masked, 'secret');
        expect(unmasked).toBe('Hello World!');
    });
    test('encrypt & decrypts the object', () => {
        const masked = utils_1.encrypt({ message: 'Hello World!' }, 'secret');
        const unmasked = utils_1.decrypt(masked, 'secret');
        expect(unmasked).toStrictEqual({ message: 'Hello World!' });
    });
});
