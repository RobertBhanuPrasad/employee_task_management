"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const env_1 = require("./config/env");
const connection_1 = require("./database/connection");
const logger_1 = require("./utils/logger");
const startServer = async () => {
    try {
        // Test Database Connection
        await (0, connection_1.testConnection)();
        // Start Express Server
        app_1.default.listen(env_1.config.port, () => {
            console.log('Server running successfully');
            logger_1.logger.info(`Server listening on port ${env_1.config.port} in ${env_1.config.nodeEnv} mode`);
        });
    }
    catch (error) {
        logger_1.logger.error('Failed to start server:', error);
        process.exit(1);
    }
};
startServer();
