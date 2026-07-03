"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = __importDefault(require("../controllers/authController"));
const authValidator_1 = require("../validators/authValidator");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post('/register', authValidator_1.registerValidator, validationMiddleware_1.validateRequest, authController_1.default.register);
router.post('/login', authValidator_1.loginValidator, validationMiddleware_1.validateRequest, authController_1.default.login);
router.post('/logout', authMiddleware_1.authenticate, authController_1.default.logout);
exports.default = router;
