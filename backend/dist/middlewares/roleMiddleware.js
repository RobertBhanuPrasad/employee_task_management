"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeRole = void 0;
const authorizeRole = (...roles) => {
    return (req, res, next) => {
        // Authorization logic will be implemented here
        // Check if req.user exists and has the required role
        // if (!req.user || !roles.includes(req.user.role)) {
        //   return next(new ApiError(403, 'You do not have permission to perform this action'));
        // }
        next();
    };
};
exports.authorizeRole = authorizeRole;
