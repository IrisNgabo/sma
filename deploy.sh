#!/bin/bash

# Credit Jambo Admin Deployment Script
echo "🚀 Starting Credit Jambo Admin deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

print_status "Docker and Docker Compose are available"

# Create environment files if they don't exist
if [ ! -f backend/.env ]; then
    print_warning "Creating backend .env file from example..."
    cp backend/.env.example backend/.env
    print_warning "Please update backend/.env with your configuration"
fi

if [ ! -f frontend/.env ]; then
    print_warning "Creating frontend .env file from example..."
    cp frontend/.env.example frontend/.env
    print_warning "Please update frontend/.env with your configuration"
fi

# Build and start services
print_status "Building and starting services with Docker Compose..."

docker-compose down --remove-orphans
docker-compose build --no-cache
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to be ready..."
sleep 30

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    print_status "Services are running successfully!"
    echo ""
    echo "🌐 Access your application:"
    echo "   Frontend: http://localhost:3000"
    echo "   Backend API: http://localhost:4000"
    echo "   API Documentation: http://localhost:4000/api-docs"
    echo ""
    echo "🔑 Default Admin Credentials:"
    echo "   Email: admin@creditjambo.com"
    echo "   Password: admin123"
    echo ""
    print_status "Deployment completed successfully!"
else
    print_error "Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
