"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionExpressionKind = exports.Direction = void 0;
/**
 * Order by direction
 */
var Direction;
(function (Direction) {
    Direction["ASC"] = "ASC";
    Direction["DESC"] = "DESC";
})(Direction = exports.Direction || (exports.Direction = {}));
var ConditionExpressionKind;
(function (ConditionExpressionKind) {
    ConditionExpressionKind["Comparison"] = "comparison";
    ConditionExpressionKind["AndOr"] = "AND_OR";
})(ConditionExpressionKind = exports.ConditionExpressionKind || (exports.ConditionExpressionKind = {}));
