"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const ApiError_1 = __importDefault(require("../utils/ApiError"));
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const jwt_1 = require("../utils/jwt");
exports.authenticate = (0, asyncHandler_1.default)(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new ApiError_1.default(401, 'Not authorized to access this route. Missing Token.'));
    }
    try {
        const decoded = (0, jwt_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        return next(new ApiError_1.default(401, 'Not authorized to access this route. Invalid or Expired Token.'));
    }
});
