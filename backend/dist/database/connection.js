"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testConnection = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const env_1 = require("../config/env");
// Create the connection pool
const pool = promise_1.default.createPool({
    host: env_1.config.db.host,
    port: env_1.config.db.port,
    user: env_1.config.db.user,
    password: env_1.config.db.password,
    database: env_1.config.db.name,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
});
// Function to test the connection on startup
const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('Database Connected Successfully');
        connection.release();
    }
    catch (error) {
        console.error('Database connection failed:', error);
        process.exit(1);
    }
};
exports.testConnection = testConnection;
exports.default = pool;
