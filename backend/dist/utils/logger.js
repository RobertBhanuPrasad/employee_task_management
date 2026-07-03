"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
// Simple logger utility as a wrapper around console
// Can be extended later with winston or other advanced logging libraries
exports.logger = {
    info: (message, ...meta) => {
        console.log(`[INFO] ${message}`, ...meta);
    },
    error: (message, ...meta) => {
        console.error(`[ERROR] ${message}`, ...meta);
    },
    warn: (message, ...meta) => {
        console.warn(`[WARN] ${message}`, ...meta);
    },
    debug: (message, ...meta) => {
        console.debug(`[DEBUG] ${message}`, ...meta);
    }
};
