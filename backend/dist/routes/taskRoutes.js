"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const taskController_1 = __importDefault(require("../controllers/taskController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const validationMiddleware_1 = require("../middlewares/validationMiddleware");
const taskValidator_1 = require("../validators/taskValidator");
const router = (0, express_1.Router)();
// Apply authentication to all task routes
router.use(authMiddleware_1.authenticate);
// View tasks (accessible to both ADMIN and EMPLOYEE)
router.get('/', taskController_1.default.getAllTasks);
router.get('/:id', taskController_1.default.getTaskById);
// Create, Update, Delete (accessible only to ADMIN)
router.post('/', (0, roleMiddleware_1.authorizeRole)('ADMIN'), taskValidator_1.createTaskValidator, validationMiddleware_1.validateRequest, taskController_1.default.createTask);
router.put('/:id', (0, roleMiddleware_1.authorizeRole)('ADMIN'), taskValidator_1.updateTaskValidator, validationMiddleware_1.validateRequest, taskController_1.default.updateTask);
router.delete('/:id', (0, roleMiddleware_1.authorizeRole)('ADMIN'), taskController_1.default.deleteTask);
exports.default = router;
