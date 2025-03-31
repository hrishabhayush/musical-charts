"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createTradeSubmission = exports.createTradeOption = void 0;
const zod_1 = __importDefault(require("zod"));
// input validation 
exports.createTradeOption = zod_1.default.object({});
exports.createTradeSubmission = zod_1.default.object({
    tradeId: zod_1.default.string()
});
