# Credit Jambo Admin Backend

Backend API for the Credit Jambo Admin Management System built with Node.js, Express.js, and PostgreSQL.

## Features

- **Admin Authentication**: Secure JWT-based authentication for administrators
- **Device Verification**: Manage and verify customer device IDs
- **Customer Management**: View and manage customer accounts, balances, and transactions
- **Analytics Dashboard**: Comprehensive analytics and reporting
- **Security**: Helmet, rate limiting, input validation, and CORS protection
- **API Documentation**: Swagger/OpenAPI documentation
- **Database**: PostgreSQL with Sequelize ORM

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT (JSON Web Tokens)
- **Security**: Helmet, express-rate-limit, bcrypt
- **Documentation**: Swagger UI
- **Validation**: express-validator

## Prerequisites

- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd credit-jambo-admin/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development

   # PostgreSQL Database Configuration
   DATABASE_URL=postgresql://username:password@localhost:5432/credit_jambo_admin
   DB_NAME=credit_jambo_admin
   DB_USER=postgres
   DB_PASSWORD=password
   DB_HOST=localhost
   DB_PORT=5432

   # JWT Configuration
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_EXPIRES_IN=24h

   # Admin Configuration
   ADMIN_EMAIL=admin@creditjambo.com
   ADMIN_PASSWORD=admin123

   # Frontend URL
   FRONTEND_URL=http://localhost:3000
   ```

4. **Set up PostgreSQL database**
   ```bash
   # Create database
   createdb credit_jambo_admin
   
   # Or using psql
   psql -U postgres
   CREATE DATABASE credit_jambo_admin;
   ```

5. **Run the application**
   ```bash
   # Development mode
   npm run dev
   
   # Production mode
   npm start
   ```

## API Documentation

Once the server is running, visit:
- **API Documentation**: http://localhost:4000/api-docs
- **Health Check**: http://localhost:4000/

## API Endpoints

### Authentication
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/profile` - Get admin profile

### Device Management
- `GET /api/devices/unverified` - Get unverified devices
- `PATCH /api/devices/verify/:userId` - Verify a device
- `PATCH /api/devices/verify-batch` - Verify multiple devices
- `GET /api/devices/stats` - Get device statistics

### Customer Management
- `GET /api/customers` - Get all customers
- `GET /api/customers/:userId` - Get customer details
- `GET /api/customers/:userId/transactions` - Get customer transactions
- `GET /api/customers/:userId/balance` - Get customer balance
- `GET /api/customers/stats` - Get customer statistics

### Analytics
- `GET /api/analytics/dashboard` - Get dashboard analytics
- `GET /api/analytics/transactions` - Get transaction analytics
- `GET /api/analytics/customers` - Get customer analytics

## Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `deviceId` (String, Unique)
- `isVerified` (Boolean)
- `balance` (Decimal)
- `lastLogin` (DateTime)
- `isActive` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Transactions Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `type` (Enum: deposit, withdrawal)
- `amount` (Decimal)
- `balanceBefore` (Decimal)
- `balanceAfter` (Decimal)
- `description` (Text)
- `status` (Enum: pending, completed, failed, cancelled)
- `reference` (String, Unique)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

### Admins Table
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: super_admin, admin, moderator)
- `permissions` (JSON)
- `lastLogin` (DateTime)
- `isActive` (Boolean)
- `createdAt` (DateTime)
- `updatedAt` (DateTime)

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password security
- **Rate Limiting**: Prevents abuse with express-rate-limit
- **CORS Protection**: Configurable cross-origin resource sharing
- **Input Validation**: express-validator for request validation
- **Security Headers**: Helmet for security headers
- **SQL Injection Protection**: Sequelize ORM prevents SQL injection

## Development

### Running Tests
```bash
npm test
```

### Database Migrations
```bash
# Create migration
npx sequelize-cli migration:generate --name migration-name

# Run migrations
npm run db:migrate

# Seed database
npm run db:seed

# Reset database
npm run db:reset
```

### Code Structure
```
backend/
├── src/
│   ├── controllers/     # Route controllers
│   ├── services/        # Business logic
│   ├── models/          # Database models
│   ├── middlewares/     # Custom middlewares
│   ├── routes/          # Route definitions
│   ├── utils/           # Utility functions
│   └── dtos/            # Data transfer objects
├── tests/               # Test files
├── server.js            # Main server file
└── package.json
```

## Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=4000
DATABASE_URL=postgresql://user:password@host:port/database
JWT_SECRET=your-production-secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:16-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 4000
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
