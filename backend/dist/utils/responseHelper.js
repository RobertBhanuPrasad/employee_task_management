"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSuccessResponse = void 0;
const ApiResponse_1 = __importDefault(require("./ApiResponse"));
const sendSuccessResponse = (res, statusCode, message, data) => {
    const response = new ApiResponse_1.default(statusCode, data, message);
    return res.status(statusCode).json(response);
};
exports.sendSuccessResponse = sendSuccessResponse;
