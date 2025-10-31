const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const { Sequelize } = require('sequelize');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3001',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Swagger configuration
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Credit Jambo Admin API',
      version: '1.0.0',
      description: 'Admin API for Credit Jambo Savings Management System',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/controllers/*.js'], // paths to files containing OpenAPI definitions
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Import models (includes sequelize instance)
const db = require('./src/models');
const { sequelize, User, Transaction, Admin } = db;

// Test database connection and sync models
sequelize.authenticate()
  .then(async () => {
    console.log('✅ Connected to PostgreSQL');
    
    // Sync database models without dropping data
    await sequelize.sync();
    console.log(' Database models synchronized (no destructive changes)');
    
    // Seed initial admin user
    const seedAdmin = require('./src/utils/seedAdmin');
    await seedAdmin();
  })
  .catch(err => console.error('❌ PostgreSQL connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'Credit Jambo Admin API',
    version: '1.0.0',
    docs: '/api-docs'
  });
});

// Import and use route handlers
const routes = require('./src/routes');
app.use('/api', routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Admin server running on port ${PORT}`);
  console.log(`📚 API Documentation: http://localhost:${PORT}/api-docs`);
});

module.exports = app;
