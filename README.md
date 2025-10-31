#  Admin Management System

A comprehensive admin management system for the savings management platform, built with modern web technologies.

##  Overview

This is the **Admin/Management Application** for the  savings system. It provides administrators with powerful tools to manage customers, verify devices, monitor transactions, and analyze platform performance.

##  Architecture

```
credit-jambo-admin/
├── backend/          # Node.js + Express.js API
├── frontend/         # React.js Admin Dashboard
├── .env.example      # Environment configuration
└── README.md         # This file
```

##  Features

###  Admin Authentication
- Secure JWT-based authentication
- Role-based access control
- Session management

###  Device Verification
- Review unverified customer devices
- Individual and batch device verification
- Device statistics and monitoring

###  Customer Management
- Complete customer database
- Search and filter capabilities
- Customer transaction history
- Balance monitoring

###  Analytics Dashboard
- Real-time platform metrics
- Transaction trends and insights
- Customer distribution analysis
- Performance monitoring

###  Security Features
- Helmet security headers
- Rate limiting protection
- Input validation and sanitization
- CORS configuration
- SQL injection prevention

##  Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **Security**: Helmet, bcrypt, express-rate-limit
- **Documentation**: Swagger/OpenAPI

### Frontend
- **Framework**: React 18
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: React Icons
- **Notifications**: React Toastify
- **HTTP Client**: Axios

##  Quick Start

### Prerequisites
- Node.js (v14 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### 1. Clone the Repository
```bash
git clone <repository-url>
cd credit-jambo-admin
```

### 2. Set Up Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure your .env file with database credentials
npm run dev
```

### 3. Set Up Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Configure your .env file with API URL
npm start
```

### 4. Access the Application
- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:4001
- **API Documentation**: http://localhost:4001/api-docs

### 5. Default Admin Credentials
- **Email**: admin@creditjambo.com
- **Password**: admin123

##  API Endpoints

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

##  Database Schema

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

### Transactions Table
- `id` (UUID, Primary Key)
- `userId` (UUID, Foreign Key)
- `type` (Enum: deposit, withdrawal)
- `amount` (Decimal)
- `balanceBefore` (Decimal)
- `balanceAfter` (Decimal)
- `status` (Enum: pending, completed, failed, cancelled)
- `reference` (String, Unique)

### Admins Table
- `id` (UUID, Primary Key)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `role` (Enum: super_admin, admin, moderator)
- `permissions` (JSON)
- `isActive` (Boolean)

## Configuration

### Backend Environment Variables
```env
# Server Configuration
PORT=4001
NODE_ENV=development

# Database
DATABASE_URL=postgresql://username:password@localhost:5432/credit_jambo_admin

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRES_IN=24h

# Admin Configuration
ADMIN_EMAIL=admin@creditjambo.com
ADMIN_PASSWORD=admin123

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### Frontend Environment Variables
```env
REACT_APP_API_URL=http://localhost:4001/api
REACT_APP_ENV=development
```

##  Testing

### Backend Tests
```bash
cd backend
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

##  Deployment

### Docker Deployment
```bash
# Build and run with Docker Compose
docker-compose up -d
```

### Manual Deployment
```bash
# Backend
cd backend
npm run build
npm start

# Frontend
cd frontend
npm run build
# Serve the build folder with a web server
```


**Built with ❤️ by Iris NGABO**
