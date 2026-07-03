"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const routes_1 = __importDefault(require("./routes"));
const errorMiddleware_1 = require("./middlewares/errorMiddleware");
const notFoundMiddleware_1 = require("./middlewares/notFoundMiddleware");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
// Security Middlewares
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Parsing Middlewares
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Compression
app.use((0, compression_1.default)());
// Logging Middleware
if (env_1.config.nodeEnv === 'development') {
    app.use((0, morgan_1.default)('dev'));
}
else {
    app.use((0, morgan_1.default)('combined'));
}
// API Routes
app.use('/api/v1', routes_1.default);
// 404 Handler
app.use(notFoundMiddleware_1.notFoundHandler);
// Global Error Handler
app.use(errorMiddleware_1.globalErrorHandler);
exports.default = app;
