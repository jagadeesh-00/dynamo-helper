"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.decrypt = exports.encrypt = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
/**
 *
 * @param value
 * @param secret
 * @returns
 */
exports.encrypt = (value, secret) => {
    if (value || typeof value !== 'undefined') {
        return crypto_js_1.default.AES.encrypt(JSON.stringify({ value }), secret).toString();
    }
    return undefined;
};
/**
 *
 * @param value
 * @param secret
 * @returns
 */
exports.decrypt = (value, secret) => {
    if (!value) {
        return undefined;
    }
    const wordArray = crypto_js_1.default.AES.decrypt(value, secret);
    const json = JSON.parse(wordArray.toString(crypto_js_1.default.enc.Utf8));
    return json.value;
};
