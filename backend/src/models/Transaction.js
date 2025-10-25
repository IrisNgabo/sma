const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id'
      }
    },
    type: {
      type: DataTypes.ENUM('deposit', 'withdrawal'),
      allowNull: false,
      validate: {
        isIn: [['deposit', 'withdrawal']]
      }
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0.01
      }
    },
    balanceBefore: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    balanceAfter: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: 0
      }
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('pending', 'completed', 'failed', 'cancelled'),
      defaultValue: 'completed',
      allowNull: false,
      validate: {
        isIn: [['pending', 'completed', 'failed', 'cancelled']]
      }
    },
    reference: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true
    }
  }, {
    tableName: 'transactions',
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['type']
      },
      {
        fields: ['status']
      },
      {
        fields: ['createdAt']
      },
      {
        unique: true,
        fields: ['reference']
      }
    ]
  });

  return Transaction;
};
