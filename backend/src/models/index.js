const { Sequelize } = require('sequelize');
require('dotenv').config();

// Database connection
const sequelize = new Sequelize(process.env.DATABASE_URL || {
  database: process.env.DB_NAME || 'credit_jambo_admin',
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
});

// Import models
const User = require('./User')(sequelize, Sequelize.DataTypes);
const Transaction = require('./Transaction')(sequelize, Sequelize.DataTypes);
const Admin = require('./Admin')(sequelize, Sequelize.DataTypes);

// Define associations
User.hasMany(Transaction, { foreignKey: 'userId', as: 'transactions' });
Transaction.belongsTo(User, { foreignKey: 'userId', as: 'user' });

const db = {
  sequelize,
  Sequelize,
  User,
  Transaction,
  Admin
};

module.exports = db;
