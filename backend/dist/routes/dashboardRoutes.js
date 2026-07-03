"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const dashboardController_1 = __importDefault(require("../controllers/dashboardController"));
const authMiddleware_1 = require("../middlewares/authMiddleware");
const roleMiddleware_1 = require("../middlewares/roleMiddleware");
const router = (0, express_1.Router)();
// Ensure all dashboard routes are authenticated
router.use(authMiddleware_1.authenticate);
// Admin dashboard route - strictly for ADMIN
router.get('/admin', (0, roleMiddleware_1.authorizeRole)('ADMIN'), dashboardController_1.default.getAdminDashboard);
// Employee dashboard route - strictly for EMPLOYEE
router.get('/employee', (0, roleMiddleware_1.authorizeRole)('EMPLOYEE'), dashboardController_1.default.getEmployeeDashboard);
exports.default = router;
