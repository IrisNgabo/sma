const { DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  const Admin = sequelize.define('Admin', {
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
    role: {
      type: DataTypes.ENUM('super_admin', 'admin', 'moderator'),
      defaultValue: 'admin',
      allowNull: false,
      validate: {
        isIn: [['super_admin', 'admin', 'moderator']]
      }
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        canVerifyDevices: true,
        canViewUsers: true,
        canViewTransactions: true,
        canManageAdmins: false
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
    tableName: 'admins',
    timestamps: true,
    paranoid: true, // Soft delete
    indexes: [
      {
        unique: true,
        fields: ['email']
      },
      {
        fields: ['role']
      },
      {
        fields: ['isActive']
      }
    ]
  });

  return Admin;
};
