"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = __importDefault(require("../controllers/userController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const userValidator_1 = require("../validators/userValidator");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const router = (0, express_1.Router)();
// Apply authentication to all employee routes
router.use(authMiddleware_1.authenticate);
// Apply ADMIN authorization to all employee routes as per requirement "Admin Only"
router.use((0, roleMiddleware_1.authorizeRole)('ADMIN'));
router.get('/', userController_1.default.getAllEmployees);
router.get('/:id', userController_1.default.getEmployeeById);
router.post('/', userValidator_1.createEmployeeValidator, validationMiddleware_1.validateRequest, userController_1.default.createEmployee);
router.put('/:id', userValidator_1.updateEmployeeValidator, validationMiddleware_1.validateRequest, userController_1.default.updateEmployee);
router.delete('/:id', userController_1.default.deleteEmployee);
exports.default = router;
