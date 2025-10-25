const { validationResult } = require('express-validator');
const { User } = require('../models');

/**
 * @swagger
 * components:
 *   schemas:
 *     DeviceVerification:
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
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /devices/unverified:
 *   get:
 *     summary: Get list of unverified devices
 *     tags: [Device Management]
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
 *     responses:
 *       200:
 *         description: List of unverified devices
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/DeviceVerification'
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     page:
 *                       type: integer
 *                     limit:
 *                       type: integer
 *                     total:
 *                       type: integer
 *                     pages:
 *                       type: integer
 */
const getUnverifiedDevices = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows: devices } = await User.findAndCountAll({
      where: { 
        isVerified: false,
        isActive: true
      },
      attributes: ['id', 'name', 'email', 'deviceId', 'isVerified', 'balance', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      success: true,
      message: 'Unverified devices retrieved successfully',
      data: devices,
      pagination: {
        page,
        limit,
        total: count,
        pages: totalPages
      }
    });
  } catch (error) {
    console.error('Get unverified devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /devices/verify/{userId}:
 *   patch:
 *     summary: Verify a device
 *     tags: [Device Management]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID to verify
 *     responses:
 *       200:
 *         description: Device verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   $ref: '#/components/schemas/DeviceVerification'
 *       404:
 *         description: User not found
 *       400:
 *         description: Device already verified
 */
const verifyDevice = async (req, res) => {
  try {
    const { userId } = req.params;

    // Find user by ID
    const user = await User.findByPk(userId, {
      attributes: ['id', 'name', 'email', 'deviceId', 'isVerified', 'balance', 'createdAt']
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        success: false,
        message: 'Device is already verified'
      });
    }

    // Update user verification status
    await user.update({ isVerified: true });

    res.status(200).json({
      success: true,
      message: 'Device verified successfully',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        deviceId: user.deviceId,
        isVerified: true,
        balance: user.balance,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Verify device error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /devices/verify-batch:
 *   patch:
 *     summary: Verify multiple devices
 *     tags: [Device Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uuid
 *                 example: ["uuid1", "uuid2", "uuid3"]
 *     responses:
 *       200:
 *         description: Devices verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     verified:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *                     errors:
 *                       type: array
 *                       items:
 *                         type: string
 */
const verifyDevicesBatch = async (req, res) => {
  try {
    const { userIds } = req.body;

    if (!Array.isArray(userIds) || userIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'User IDs array is required'
      });
    }

    let verified = 0;
    let failed = 0;
    const errors = [];

    for (const userId of userIds) {
      try {
        const user = await User.findByPk(userId);
        
        if (!user) {
          errors.push(`User ${userId} not found`);
          failed++;
          continue;
        }

        if (user.isVerified) {
          errors.push(`User ${userId} already verified`);
          failed++;
          continue;
        }

        await user.update({ isVerified: true });
        verified++;
      } catch (error) {
        errors.push(`Error verifying user ${userId}: ${error.message}`);
        failed++;
      }
    }

    res.status(200).json({
      success: true,
      message: 'Batch verification completed',
      data: {
        verified,
        failed,
        errors: errors.length > 0 ? errors : undefined
      }
    });
  } catch (error) {
    console.error('Batch verify devices error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

/**
 * @swagger
 * /devices/stats:
 *   get:
 *     summary: Get device verification statistics
 *     tags: [Device Management]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Device statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     verified:
 *                       type: integer
 *                     unverified:
 *                       type: integer
 *                     pendingToday:
 *                       type: integer
 */
const getDeviceStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [total, verified, unverified, pendingToday] = await Promise.all([
      User.count({ where: { isActive: true } }),
      User.count({ where: { isVerified: true, isActive: true } }),
      User.count({ where: { isVerified: false, isActive: true } }),
      User.count({ 
        where: { 
          isVerified: false, 
          isActive: true,
          createdAt: {
            [require('sequelize').Op.gte]: today
          }
        } 
      })
    ]);

    res.status(200).json({
      success: true,
      message: 'Device statistics retrieved successfully',
      data: {
        total,
        verified,
        unverified,
        pendingToday
      }
    });
  } catch (error) {
    console.error('Get device stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = {
  getUnverifiedDevices,
  verifyDevice,
  verifyDevicesBatch,
  getDeviceStats
};
