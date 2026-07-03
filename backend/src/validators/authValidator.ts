import { body } from 'express-validator';

export const registerValidator = [
  body('full_name')
    .trim()
    .notEmpty().withMessage('Full name is required')
    .isString().withMessage('Full name must be a string'),
  
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  
  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
    .matches(/[0-9]/).withMessage('Password must contain at least one number'),
  
  body('confirm_password')
    .notEmpty().withMessage('Confirm password is required')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match');
      }
      return true;
    }),
  
  body('role')
    .notEmpty().withMessage('Role is required')
    .isIn(['ADMIN', 'EMPLOYEE']).withMessage('Role must be ADMIN or EMPLOYEE'),
  
  body('department').optional().isString(),
  body('designation').optional().isString()
];

export const loginValidator = [
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address'),
  
  body('password')
    .notEmpty().withMessage('Password is required'),
  
  body('rememberMe')
    .optional()
    .isBoolean().withMessage('rememberMe must be a boolean')
];
