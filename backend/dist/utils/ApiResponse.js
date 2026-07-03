"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ApiResponse {
    success;
    message;
    data;
    constructor(statusCode, data, message = 'Success') {
        this.success = statusCode < 400;
        this.message = message;
        this.data = data;
    }
}
exports.default = ApiResponse;
