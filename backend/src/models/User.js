const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 100]
      }
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
        notEmpty: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [6, 255]
      }
    },
    deviceId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true
      }
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0.00,
      allowNull: false,
      validate: {
        min: 0
      }
    },
    lastLogin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false
    }
  }, {
    tableName: 'users',
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        unique: true,
        fields: ['deviceId']
      },
      {
        fields: ['isVerified']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  return User;
};
