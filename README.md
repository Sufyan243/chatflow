# ChatFlow Pro

A comprehensive WhatsApp chatbot management platform with React frontend, Node.js backend, and WhatsApp integration service.

## 🚀 Features

- **WhatsApp Integration**: Seamless WhatsApp Web API integration
- **Chatbot Builder**: Visual flow editor for creating conversational bots
- **Contact Management**: Complete contact and conversation management
- **Analytics Dashboard**: Real-time analytics and insights
- **Multi-tenant**: Support for multiple users and organizations
- **Template System**: Pre-built chatbot templates
- **Real-time Messaging**: WebSocket-based real-time communication

## 📁 Project Structure

```
chatflow-pro/
├── 📁 frontend/                    # React.js Frontend
├── 📁 backend/                     # Node.js Backend
├── 📁 whatsapp-service/            # WhatsApp Integration Service
├── 📁 database/                    # Database Related
├── 📁 docs/                       # Documentation
├── 📁 scripts/                    # Utility Scripts
├── 📁 tests/                      # Testing Files
└── 📁 docker/                     # Docker Configuration
```

## 🛠️ Tech Stack

### Frontend
- React.js 18
- Tailwind CSS
- React Router
- Axios
- Socket.io Client

### Backend
- Node.js
- Express.js
- PostgreSQL
- Redis
- Socket.io
- JWT Authentication

### WhatsApp Service
- WhatsApp Web API
- Puppeteer
- WebSocket

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-org/chatflow-pro.git
   cd chatflow-pro
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install frontend dependencies
   cd frontend && npm install
   
   # Install backend dependencies
   cd ../backend && npm install
   
   # Install WhatsApp service dependencies
   cd ../whatsapp-service && npm install
   ```

3. **Set up environment variables**
   ```bash
   # Copy environment files
   cp frontend/.env.example frontend/.env
   cp backend/.env.example backend/.env
   cp whatsapp-service/.env.example whatsapp-service/.env
   ```

4. **Set up database**
   ```bash
   # Run database migrations
   cd backend
   npm run migrate
   npm run seed
   ```

5. **Start development servers**
   ```bash
   # Start backend
   cd backend && npm run dev
   
   # Start frontend (in new terminal)
   cd frontend && npm start
   
   # Start WhatsApp service (in new terminal)
   cd whatsapp-service && npm run dev
   ```

## 📚 Documentation

- [API Documentation](docs/API.md)
- [Setup Instructions](docs/SETUP.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Contributing Guidelines](docs/CONTRIBUTING.md)

## 🤝 Contributing

Please read our [Contributing Guidelines](docs/CONTRIBUTING.md) before submitting pull requests.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@chatflow-pro.com or create an issue in this repository. 