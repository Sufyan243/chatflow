#!/bin/bash

# ChatFlow Pro Setup Script
# This script sets up the entire ChatFlow Pro project

set -e

echo "🚀 Setting up ChatFlow Pro..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18 or higher."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_success "Node.js version: $(node -v)"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed."
        exit 1
    fi
    
    print_success "npm version: $(npm -v)"
}

# Check if Docker is installed (optional)
check_docker() {
    if command -v docker &> /dev/null; then
        print_success "Docker is available"
        DOCKER_AVAILABLE=true
    else
        print_warning "Docker is not installed. Some features may not work."
        DOCKER_AVAILABLE=false
    fi
}

# Check if PostgreSQL is installed (optional)
check_postgres() {
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL is available"
        POSTGRES_AVAILABLE=true
    else
        print_warning "PostgreSQL is not installed. You'll need to use Docker or install it separately."
        POSTGRES_AVAILABLE=false
    fi
}

# Install dependencies
install_dependencies() {
    print_status "Installing root dependencies..."
    npm install
    
    print_status "Installing frontend dependencies..."
    cd frontend && npm install && cd ..
    
    print_status "Installing backend dependencies..."
    cd backend && npm install && cd ..
    
    print_status "Installing WhatsApp service dependencies..."
    cd whatsapp-service && npm install && cd ..
    
    print_success "All dependencies installed successfully!"
}

# Create environment files
setup_environment() {
    print_status "Setting up environment files..."
    
    # Frontend .env
    if [ ! -f frontend/.env ]; then
        cat > frontend/.env << EOF
# Frontend Environment Variables
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_WHATSAPP_SERVICE_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0

# Feature Flags
REACT_APP_ENABLE_ANALYTICS=true
REACT_APP_ENABLE_CHATBOT_BUILDER=true
REACT_APP_ENABLE_CONTACT_MANAGEMENT=true
REACT_APP_ENABLE_TEMPLATES=true

# External Services
REACT_APP_GOOGLE_ANALYTICS_ID=
REACT_APP_SENTRY_DSN=
REACT_APP_MIXPANEL_TOKEN=
EOF
        print_success "Created frontend/.env"
    fi
    
    # Backend .env
    if [ ! -f backend/.env ]; then
        cat > backend/.env << EOF
# Backend Environment Variables
NODE_ENV=development
PORT=5000

# Database
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatflow_pro
DB_USER=postgres
DB_PASSWORD=password

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# Email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# WhatsApp
WHATSAPP_SERVICE_URL=http://localhost:3001

# Frontend
FRONTEND_URL=http://localhost:3000

# File Upload
UPLOAD_PATH=./uploads
MAX_FILE_SIZE=10485760

# Logging
LOG_LEVEL=info
EOF
        print_success "Created backend/.env"
    fi
    
    # WhatsApp service .env
    if [ ! -f whatsapp-service/.env ]; then
        cat > whatsapp-service/.env << EOF
# WhatsApp Service Environment Variables
NODE_ENV=development
PORT=3001

# Backend API
BACKEND_URL=http://localhost:5000

# Redis
REDIS_URL=redis://localhost:6379

# WhatsApp
WHATSAPP_SESSION_PATH=./sessions
WHATSAPP_DATA_PATH=./data

# Logging
LOG_LEVEL=info
EOF
        print_success "Created whatsapp-service/.env"
    fi
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    if [ "$POSTGRES_AVAILABLE" = true ]; then
        print_status "Creating database..."
        createdb chatflow_pro 2>/dev/null || print_warning "Database 'chatflow_pro' already exists or could not be created"
        
        print_status "Running database migrations..."
        cd backend
        npm run migrate
        cd ..
        
        print_success "Database setup completed!"
    else
        print_warning "PostgreSQL not available. Please set up the database manually or use Docker."
    fi
}

# Create necessary directories
create_directories() {
    print_status "Creating necessary directories..."
    
    mkdir -p backend/logs
    mkdir -p backend/uploads
    mkdir -p whatsapp-service/sessions
    mkdir -p whatsapp-service/data
    
    print_success "Directories created successfully!"
}

# Setup Docker (if available)
setup_docker() {
    if [ "$DOCKER_AVAILABLE" = true ]; then
        print_status "Setting up Docker..."
        
        # Create logs directory for Docker
        mkdir -p logs
        
        print_success "Docker setup completed!"
        print_status "You can now run: docker-compose -f docker/docker-compose.yml up -d"
    fi
}

# Main setup function
main() {
    echo "=========================================="
    echo "  ChatFlow Pro Setup Script"
    echo "=========================================="
    echo ""
    
    # Check prerequisites
    print_status "Checking prerequisites..."
    check_node
    check_npm
    check_docker
    check_postgres
    echo ""
    
    # Install dependencies
    print_status "Installing dependencies..."
    install_dependencies
    echo ""
    
    # Setup environment
    print_status "Setting up environment files..."
    setup_environment
    echo ""
    
    # Create directories
    print_status "Creating directories..."
    create_directories
    echo ""
    
    # Setup database
    print_status "Setting up database..."
    setup_database
    echo ""
    
    # Setup Docker
    print_status "Setting up Docker..."
    setup_docker
    echo ""
    
    echo "=========================================="
    print_success "ChatFlow Pro setup completed successfully!"
    echo "=========================================="
    echo ""
    echo "Next steps:"
    echo "1. Configure your environment variables in the .env files"
    echo "2. Start the development servers:"
    echo "   - Backend: cd backend && npm run dev"
    echo "   - Frontend: cd frontend && npm start"
    echo "   - WhatsApp Service: cd whatsapp-service && npm run dev"
    echo ""
    echo "Or use Docker:"
    echo "   docker-compose -f docker/docker-compose.yml up -d"
    echo ""
    echo "Documentation: https://docs.chatflow-pro.com"
    echo "Support: support@chatflow-pro.com"
    echo ""
}

# Run main function
main "$@" 