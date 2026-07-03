"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const logger_1 = require("../utils/logger");
const env_1 = require("../config/env");
const globalErrorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Internal Server Error';
    let errors = [];
    if (err instanceof ApiError_1.default) {
        statusCode = err.statusCode;
        message = err.message;
        errors = err.errors;
    }
    else {
        // Handling generic or unhandled errors
        message = err.message || message;
    }
    // Log the error
    logger_1.logger.error(`${statusCode} - ${message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
    if (env_1.config.nodeEnv === 'development') {
        logger_1.logger.error(err.stack || '');
    }
    res.status(statusCode).json({
        success: false,
        message,
        errors,
    });
};
exports.globalErrorHandler = globalErrorHandler;
