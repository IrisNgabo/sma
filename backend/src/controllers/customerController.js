const { validationResult } = require('express-validator');
const { User, Transaction } = require('../models');
const { Op } = require('sequelize');

/**
 * @swagger
 * components:
 *   schemas:
 *     Customer:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         deviceId:
 *           type: string
 *         isVerified:
 *           type: boolean
 *         balance:
 *           type: number
 *         lastLogin:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *     Transaction:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         type:
 *           type: string
 *           enum: [deposit, withdrawal]
 *         amount:
 *           type: number
 *         balanceBefore:
 *           type: number
 *         balanceAfter:
 *           type: number
 *         description:
 *           type: string
 *         status:
 *           type: string
 *           enum: [pending, completed, failed, cancelled]
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /customers:
 *   get:
 *     summary: Get list of all customers
 *     tags: [Customer Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name or email
 *       - in: query
 *         name: isVerified
 *         schema:
 *           type: boolean
 *         description: Filter by verification status
 *     responses:
 *       200:
 *         description: List of customers retrieved successfully
 */
const getCustomers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search;
    const isVerified = req.query.isVerified;

    // Build where clause
    const whereClause = { isActive: true };
    
    if (isVerified !== undefined) {
      whereClause.isVerified = isVerified === 'true';
    }

    if (search) {
      whereClause[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } }
      ];
    }

    const { count, rows: customers } = await User.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'name', 'email', 'deviceId', 'isVerified', 'balance', 'lastLogin', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: 'Customers retrieved successfully',
      data: customers,
      pagination: {
        page,
        limit,
        total: count,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /customers/{userId}:
 *   get:
 *     summary: Get customer details
 *     tags: [Customer Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer details retrieved successfully
 *       404:
 *         description: Customer not found
 */
const getCustomer = async (req, res) => {
  try {
    const { userId } = req.params;

    const customer = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'deviceId', 'isVerified', 'balance', 'lastLogin', 'createdAt'],
      include: [{
        model: Transaction,
        as: 'transactions',
        attributes: ['id', 'type', 'amount', 'balanceBefore', 'balanceAfter', 'status', 'createdAt'],
        order: [['createdAt', 'DESC']],
        limit: 10
      }]
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer details retrieved successfully',
      data: customer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /customers/{userId}/transactions:
 *   get:
 *     summary: Get customer transactions
 *     tags: [Customer Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Customer ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 10
 *         description: Number of items per page
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [deposit, withdrawal]
 *         description: Filter by transaction type
 *     responses:
 *       200:
 *         description: Customer transactions retrieved successfully
 *       404:
 *         description: Customer not found
 */
const getCustomerTransactions = async (req, res) => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const type = req.query.type;

    // Check if customer exists
    const customer = await User.findByPk(userId);
    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    // Build where clause for transactions
    const whereClause = { userId };
    if (type) {
      whereClause.type = type;
    }

    const { count, rows: transactions } = await Transaction.findAndCountAll({
      where: whereClause,
      attributes: ['id', 'type', 'amount', 'balanceBefore', 'balanceAfter', 'description', 'status', 'reference', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: 'Customer transactions retrieved successfully',
      data: transactions,
      pagination: {
        page,
        limit,
        total: count,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Get customer transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /customers/{userId}/balance:
 *   get:
 *     summary: Get customer balance
 *     tags: [Customer Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer balance retrieved successfully
 *       404:
 *         description: Customer not found
 */
const getCustomerBalance = async (req, res) => {
  try {
    const { userId } = req.params;

    const customer = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'balance', 'isVerified']
    });

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
    }

    res.status(200).json({
      success: true,
      message: 'Customer balance retrieved successfully',
      data: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        balance: customer.balance,
        isVerified: customer.isVerified
      }
    });
  } catch (error) {
    console.error('Get customer balance error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /customers/stats:
 *   get:
 *     summary: Get customer statistics
 *     tags: [Customer Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Customer statistics retrieved successfully
 */
const getCustomerStats = async (req, res) => {
  try {
    const [
      totalCustomers,
      verifiedCustomers,
      unverifiedCustomers,
      activeCustomers,
      totalBalance
    ] = await Promise.all([
      User.count({ where: { isActive: true } }),
      User.count({ where: { isVerified: true, isActive: true } }),
      User.count({ where: { isVerified: false, isActive: true } }),
      User.count({ 
        where: { 
          isActive: true,
          lastLogin: {
            [Op.gte]: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
          }
        } 
      }),
      User.sum('balance', { where: { isActive: true } })
    ]);

    res.status(200).json({
      success: true,
      message: 'Customer statistics retrieved successfully',
      data: {
        totalCustomers,
        verifiedCustomers,
        unverifiedCustomers,
        activeCustomers,
        totalBalance: totalBalance || 0
      }
    });
  } catch (error) {
    console.error('Get customer stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getCustomers,
  getCustomer,
  getCustomerTransactions,
  getCustomerBalance,
  getCustomerStats
};
