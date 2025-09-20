/**
 *
 * @param value
 * @param secret
 * @returns
 */
export declare const encrypt: <T>(value: T, secret: string) => string;
/**
 *
 * @param value
 * @param secret
 * @returns
 */
export declare const decrypt: <T>(value: string, secret: string) => T;
