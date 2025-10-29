# Credit Jambo Admin Frontend

React-based admin dashboard for the Credit Jambo Management System.

## Features

- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Authentication**: Secure admin login with JWT tokens
- **Device Verification**: Manage and verify customer devices
- **Customer Management**: View and manage customer accounts
- **Analytics Dashboard**: Comprehensive analytics and reporting
- **Real-time Updates**: Live data updates and notifications
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **Framework**: React 18
- **Routing**: React Router DOM
- **Styling**: Tailwind CSS
- **Icons**: React Icons (Feather Icons)
- **Charts**: Recharts
- **Notifications**: React Toastify
- **HTTP Client**: Axios
- **State Management**: React Context API

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (see backend README)

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd credit-jambo-admin/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Update the `.env` file:
   ```env
   REACT_APP_API_URL=http://localhost:4001/api
   REACT_APP_ENV=development
   ```

4. **Start the development server**
   ```bash
   npm start
   ```

The application will open at http://localhost:3001

## Available Scripts

- `npm start` - Start development server
- `npm build` - Build for production
- `npm test` - Run tests
- `npm eject` - Eject from Create React App

## Project Structure

```
frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable components
│   │   ├── Layout.js        # Main layout component
│   │   └── ProtectedRoute.js # Route protection
│   ├── pages/               # Page components
│   │   ├── Login.js         # Login page
│   │   ├── Dashboard.js     # Dashboard page
│   │   ├── DeviceVerification.js # Device verification
│   │   ├── CustomerManagement.js # Customer management
│   │   └── Analytics.js      # Analytics page
│   ├── services/            # API services
│   │   └── api.js           # API client
│   ├── store/               # State management
│   │   └── AuthContext.js   # Authentication context
│   ├── utils/                # Utility functions
│   ├── App.js               # Main app component
│   ├── index.js             # Entry point
│   └── index.css            # Global styles
├── tailwind.config.js       # Tailwind configuration
└── package.json
```

## Features Overview

### Authentication
- Secure admin login
- JWT token management
- Automatic token refresh
- Protected routes

### Dashboard
- Key metrics overview
- Recent transactions
- Top customers
- Quick actions

### Device Verification
- List unverified devices
- Individual device verification
- Batch verification
- Device statistics

### Customer Management
- Customer listing with search/filter
- Customer details view
- Transaction history
- Balance information

### Analytics
- Transaction trends
- Customer distribution
- Performance metrics
- Interactive charts

## API Integration

The frontend communicates with the backend through a centralized API service:

```javascript
// Example API usage
import { customerAPI } from './services/api';

// Get customers
const customers = await customerAPI.getCustomers();

// Verify device
await deviceAPI.verifyDevice(userId);
```

## State Management

The application uses React Context API for state management:

- **AuthContext**: Manages authentication state
- **Global state**: Admin user info, loading states
- **Local state**: Component-specific state

## Styling

The application uses Tailwind CSS for styling:

- **Utility-first**: Rapid UI development
- **Responsive**: Mobile-first design
- **Custom components**: Reusable styled components
- **Dark mode ready**: Prepared for dark theme

## Security

- **JWT Tokens**: Secure authentication
- **Protected Routes**: Route-level security
- **Input Validation**: Client-side validation
- **XSS Protection**: React's built-in protection

## Performance

- **Code Splitting**: Lazy loading of components
- **Optimized Images**: Efficient image handling
- **Caching**: API response caching
- **Bundle Optimization**: Minimized bundle size

## Deployment

### Build for Production
```bash
npm run build
```

### Environment Variables for Production
```env
REACT_APP_API_URL=https://your-api-domain.com/api
REACT_APP_ENV=production
```

### Docker Deployment
```dockerfile
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

## Development Guidelines

### Code Style
- Use functional components with hooks
- Follow React best practices
- Use TypeScript for better type safety (optional)
- Write meaningful component names

### Component Structure
```javascript
// Component template
import React, { useState, useEffect } from 'react';

const ComponentName = () => {
  // State
  const [state, setState] = useState(initialValue);
  
  // Effects
  useEffect(() => {
    // Side effects
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Event logic
  };
  
  // Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
};

export default ComponentName;
```

### API Integration
```javascript
// API service pattern
import api from '../services/api';

const fetchData = async () => {
  try {
    const response = await api.get('/endpoint');
    return response.data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};
```

## Testing

### Running Tests
```bash
npm test
```

### Test Structure
- Unit tests for components
- Integration tests for API calls
- E2E tests for user flows

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
