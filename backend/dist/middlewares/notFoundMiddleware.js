"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundHandler = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const notFoundHandler = (req, res, next) => {
    next(new ApiError_1.default(404, `Resource not found - ${req.originalUrl}`));
};
exports.notFoundHandler = notFoundHandler;
