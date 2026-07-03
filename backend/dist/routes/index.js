"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRoutes_1 = __importDefault(require("./authRoutes"));
const userRoutes_1 = __importDefault(require("./userRoutes"));
const taskRoutes_1 = __importDefault(require("./taskRoutes"));
const dashboardRoutes_1 = __importDefault(require("./dashboardRoutes"));
const reportRoutes_1 = __importDefault(require("./reportRoutes"));
const uploadRoutes_1 = __importDefault(require("./uploadRoutes"));
const notificationRoutes_1 = __importDefault(require("./notificationRoutes"));
const router = (0, express_1.Router)();
const defaultRoutes = [
    {
        path: '/auth',
        route: authRoutes_1.default,
    },
    {
        path: '/employees',
        route: userRoutes_1.default,
    },
    {
        path: '/tasks',
        route: taskRoutes_1.default,
    },
    {
        path: '/dashboard',
        route: dashboardRoutes_1.default,
    },
    {
        path: '/reports',
        route: reportRoutes_1.default,
    },
    {
        path: '/uploads',
        route: uploadRoutes_1.default,
    },
    {
        path: '/notifications',
        route: notificationRoutes_1.default,
    }
];
defaultRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
