# ChatFlow Pro Setup Guide

This guide will help you set up ChatFlow Pro on your local machine or production server.

## Prerequisites

Before you begin, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm** (version 9 or higher)
- **PostgreSQL** (version 13 or higher) - Optional, can use Docker
- **Redis** (version 6 or higher) - Optional, can use Docker
- **Docker** (optional, for containerized deployment)

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/chatflow-pro.git
cd chatflow-pro
```

### 2. Run the Setup Script

```bash
chmod +x scripts/setup.sh
./scripts/setup.sh
```

This script will:
- Check prerequisites
- Install all dependencies
- Create environment files
- Set up the database
- Create necessary directories

### 3. Configure Environment Variables

Edit the `.env` files in each service directory:

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_WHATSAPP_SERVICE_URL=http://localhost:3001
```

#### Backend (.env)
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=chatflow_pro
DB_USER=postgres
DB_PASSWORD=password
JWT_SECRET=your-super-secret-jwt-key
```

#### WhatsApp Service (.env)
```env
NODE_ENV=development
PORT=3001
BACKEND_URL=http://localhost:5000
```

### 4. Start the Services

#### Development Mode

Start all services in separate terminals:

```bash
# Backend
cd backend && npm run dev

# Frontend
cd frontend && npm start

# WhatsApp Service
cd whatsapp-service && npm run dev
```

#### Using Docker

```bash
# Build and start all services
docker-compose -f docker/docker-compose.yml up -d

# View logs
docker-compose -f docker/docker-compose.yml logs -f
```

## Manual Setup

If you prefer to set up manually or the setup script doesn't work:

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Frontend dependencies
cd frontend && npm install && cd ..

# Backend dependencies
cd backend && npm install && cd ..

# WhatsApp service dependencies
cd whatsapp-service && npm install && cd ..
```

### 2. Database Setup

#### Using PostgreSQL

```bash
# Create database
createdb chatflow_pro

# Run migrations
cd backend && npm run migrate && cd ..
```

#### Using Docker

```bash
# Start PostgreSQL and Redis
docker run -d --name postgres -e POSTGRES_DB=chatflow_pro -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15-alpine

docker run -d --name redis -p 6379:6379 redis:7-alpine
```

### 3. Environment Configuration

Create the following environment files:

#### Frontend (.env)
```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
REACT_APP_WHATSAPP_SERVICE_URL=http://localhost:3001
REACT_APP_ENVIRONMENT=development
REACT_APP_VERSION=1.0.0
```

#### Backend (.env)
```env
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

# Frontend
FRONTEND_URL=http://localhost:3000
```

#### WhatsApp Service (.env)
```env
NODE_ENV=development
PORT=3001
BACKEND_URL=http://localhost:5000
REDIS_URL=redis://localhost:6379
```

## Production Setup

### 1. Environment Variables

Update all `.env` files with production values:

- Use strong JWT secrets
- Configure production database credentials
- Set up email service credentials
- Configure SSL certificates

### 2. Database Setup

```bash
# Create production database
createdb chatflow_pro_prod

# Run migrations
cd backend && npm run migrate && cd ..
```

### 3. Build and Deploy

#### Using Docker

```bash
# Build production images
docker-compose -f docker/docker-compose.yml build

# Start services
docker-compose -f docker/docker-compose.yml up -d
```

#### Manual Deployment

```bash
# Build frontend
cd frontend && npm run build && cd ..

# Start backend
cd backend && npm start

# Start WhatsApp service
cd whatsapp-service && npm start
```

## Troubleshooting

### Common Issues

#### 1. Database Connection Error

**Error**: `ECONNREFUSED` when connecting to PostgreSQL

**Solution**:
- Check if PostgreSQL is running: `sudo systemctl status postgresql`
- Verify connection details in `.env` file
- Ensure database exists: `createdb chatflow_pro`

#### 2. Port Already in Use

**Error**: `EADDRINUSE` when starting services

**Solution**:
- Check what's using the port: `lsof -i :5000`
- Kill the process or change the port in `.env`

#### 3. Node Modules Issues

**Error**: Module not found errors

**Solution**:
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. WhatsApp Service Issues

**Error**: Puppeteer/Chrome issues

**Solution**:
```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install -y gconf-service libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6 ca-certificates fonts-liberation libappindicator1 libnss3 lsb-release xdg-utils wget
```

### Getting Help

If you encounter issues:

1. Check the logs in each service directory
2. Verify all environment variables are set correctly
3. Ensure all prerequisites are installed
4. Check the [GitHub Issues](https://github.com/your-org/chatflow-pro/issues)
5. Contact support: support@chatflow-pro.com

## Next Steps

After successful setup:

1. **Create your first account**: Visit `http://localhost:3000/register`
2. **Set up WhatsApp**: Follow the WhatsApp integration guide
3. **Create your first chatbot**: Use the chatbot builder
4. **Add contacts**: Import or manually add contacts
5. **Test messaging**: Send test messages through your chatbot

## Additional Resources

- [API Documentation](API.md)
- [Deployment Guide](DEPLOYMENT.md)
- [Contributing Guidelines](CONTRIBUTING.md)
- [FAQ](https://docs.chatflow-pro.com/faq)
- [Video Tutorials](https://docs.chatflow-pro.com/tutorials) 