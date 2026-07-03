import { body } from 'express-validator';

export const createTaskValidator = [
  body('title')
    .trim()
    .notEmpty().withMessage('Task title is required')
    .isString().withMessage('Task title must be a string'),

  body('description')
    .optional()
    .isString().withMessage('Description must be a string'),

  body('priority')
    .notEmpty().withMessage('Priority is required')
    .isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),

  body('status')
    .notEmpty().withMessage('Status is required')
    .isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']).withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED'),

  body('start_date')
    .notEmpty().withMessage('Start date is required')
    .isISO8601().withMessage('Start date must be a valid ISO8601 date'),

  body('due_date')
    .notEmpty().withMessage('Due date is required')
    .isISO8601().withMessage('Due date must be a valid ISO8601 date'),

  body('assigned_employee_id')
    .notEmpty().withMessage('Assigned employee ID is required')
    .isInt({ min: 1 }).withMessage('Assigned employee ID must be a positive integer')
];

export const updateTaskValidator = [
  body('title').optional().isString().trim().notEmpty().withMessage('Task title cannot be empty'),
  body('description').optional().isString(),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage('Priority must be LOW, MEDIUM, or HIGH'),
  body('status').optional().isIn(['PENDING', 'IN_PROGRESS', 'COMPLETED']).withMessage('Status must be PENDING, IN_PROGRESS, or COMPLETED'),
  body('start_date').optional().isISO8601().withMessage('Start date must be a valid ISO8601 date'),
  body('due_date').optional().isISO8601().withMessage('Due date must be a valid ISO8601 date'),
  body('assigned_employee_id').optional().isInt({ min: 1 }).withMessage('Assigned employee ID must be a positive integer')
];
