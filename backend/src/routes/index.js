const express = require('express');
const { body } = require('express-validator');
const { authenticateAdmin, requirePermission } = require('../middlewares/auth');

// Import controllers
const authController = require('../controllers/authController');
const deviceController = require('../controllers/deviceController');
const customerController = require('../controllers/customerController');
const analyticsController = require('../controllers/analyticsController');

const router = express.Router();

// Validation middleware
const loginValidation = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email address'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
];

// Authentication routes
router.post('/admin/login', loginValidation, authController.login);
router.post('/admin/logout', authenticateAdmin, authController.logout);
router.get('/admin/profile', authenticateAdmin, authController.getProfile);

// Device management routes
router.get('/devices/unverified', 
  authenticateAdmin, 
  requirePermission('canVerifyDevices'), 
  deviceController.getUnverifiedDevices
);

router.patch('/devices/verify/:userId', 
  authenticateAdmin, 
  requirePermission('canVerifyDevices'), 
  deviceController.verifyDevice
);

router.patch('/devices/verify-batch', 
  authenticateAdmin, 
  requirePermission('canVerifyDevices'), 
  deviceController.verifyDevicesBatch
);

router.get('/devices/stats', 
  authenticateAdmin, 
  requirePermission('canVerifyDevices'), 
  deviceController.getDeviceStats
);

// Customer management routes
router.get('/customers/stats', 
  authenticateAdmin, 
  requirePermission('canViewUsers'), 
  customerController.getCustomerStats
);

router.get('/customers', 
  authenticateAdmin, 
  requirePermission('canViewUsers'), 
  customerController.getCustomers
);

router.get('/customers/:userId', 
  authenticateAdmin, 
  requirePermission('canViewUsers'), 
  customerController.getCustomer
);

router.get('/customers/:userId/transactions', 
  authenticateAdmin, 
  requirePermission('canViewTransactions'), 
  customerController.getCustomerTransactions
);

router.get('/customers/:userId/balance', 
  authenticateAdmin, 
  requirePermission('canViewUsers'), 
  customerController.getCustomerBalance
);

// Analytics routes
router.get('/analytics/dashboard', 
  authenticateAdmin, 
  analyticsController.getDashboardAnalytics
);

router.get('/analytics/transactions', 
  authenticateAdmin, 
  analyticsController.getTransactionAnalytics
);

router.get('/analytics/customers', 
  authenticateAdmin, 
  analyticsController.getCustomerAnalytics
);

module.exports = router;
