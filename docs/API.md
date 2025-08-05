# ChatFlow Pro API Documentation

## Overview

The ChatFlow Pro API is a RESTful API built with Node.js and Express. It provides endpoints for managing users, chatbots, contacts, messages, and analytics.

## Base URL

```
Development: http://localhost:5000/api
Production: https://api.chatflow-pro.com/api
```

## Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Rate Limiting

- **General endpoints**: 100 requests per 15 minutes
- **Authentication endpoints**: 5 requests per 15 minutes
- **File upload endpoints**: 10 requests per 15 minutes

## Response Format

All API responses follow this format:

```json
{
  "success": true,
  "data": {},
  "message": "Operation successful"
}
```

Error responses:

```json
{
  "success": false,
  "error": "Error message",
  "code": "ERROR_CODE"
}
```

## Endpoints

### Authentication

#### POST /auth/register
Register a new user.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isEmailVerified": false,
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "jwt-token"
  }
}
```

#### POST /auth/login
Login user.

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /auth/me
Get current user profile.

#### PUT /auth/profile
Update user profile.

#### PUT /auth/password
Change password.

#### POST /auth/forgot-password
Request password reset.

#### POST /auth/reset-password
Reset password with token.

### Users

#### GET /users
Get all users (admin only).

#### GET /users/:id
Get user by ID.

#### PUT /users/:id
Update user (admin only).

#### DELETE /users/:id
Delete user (admin only).

### Chatbots

#### GET /chatbots
Get user's chatbots.

#### POST /chatbots
Create new chatbot.

**Request Body:**
```json
{
  "name": "Customer Support Bot",
  "description": "Handles customer inquiries",
  "flow": {
    "nodes": [],
    "edges": []
  },
  "settings": {
    "welcomeMessage": "Hello! How can I help you?",
    "fallbackMessage": "I didn't understand that."
  }
}
```

#### GET /chatbots/:id
Get chatbot by ID.

#### PUT /chatbots/:id
Update chatbot.

#### DELETE /chatbots/:id
Delete chatbot.

#### POST /chatbots/:id/test
Test chatbot with message.

### Contacts

#### GET /contacts
Get user's contacts.

#### POST /contacts
Create new contact.

#### GET /contacts/:id
Get contact by ID.

#### PUT /contacts/:id
Update contact.

#### DELETE /contacts/:id
Delete contact.

### Messages

#### GET /messages
Get messages with pagination.

#### POST /messages
Send message.

#### GET /messages/:id
Get message by ID.

#### DELETE /messages/:id
Delete message.

### Analytics

#### GET /analytics/overview
Get analytics overview.

#### GET /analytics/chatbots/:id
Get chatbot analytics.

#### GET /analytics/contacts/:id
Get contact analytics.

## WebSocket Events

### Connection
```javascript
const socket = io('http://localhost:5000');

socket.on('connect', () => {
  console.log('Connected to server');
});
```

### Message Events
```javascript
// Listen for new messages
socket.on('new_message', (message) => {
  console.log('New message:', message);
});

// Listen for message status updates
socket.on('message_status', (data) => {
  console.log('Message status:', data);
});
```

### Chatbot Events
```javascript
// Listen for chatbot status changes
socket.on('chatbot_status', (data) => {
  console.log('Chatbot status:', data);
});
```

## Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_ERROR` | Authentication required |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource conflict |
| `RATE_LIMIT_EXCEEDED` | Rate limit exceeded |
| `INTERNAL_ERROR` | Internal server error |

## File Upload

### Upload Avatar
```
POST /users/avatar
Content-Type: multipart/form-data
```

### Upload Chatbot Media
```
POST /chatbots/:id/media
Content-Type: multipart/form-data
```

## Pagination

For endpoints that return lists, use query parameters:

```
GET /messages?page=1&limit=20&sort=createdAt&order=desc
```

**Response:**
```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

## Filtering

Many endpoints support filtering:

```
GET /messages?status=sent&contactId=123&dateFrom=2024-01-01
```

## Sorting

Sort results using the `sort` and `order` parameters:

```
GET /contacts?sort=name&order=asc
```

## Search

Search functionality is available on most endpoints:

```
GET /contacts?search=john
GET /messages?search=hello
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `JWT_SECRET` | JWT secret key | - |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | chatflow_pro |
| `DB_USER` | Database user | postgres |
| `DB_PASSWORD` | Database password | - |
| `REDIS_URL` | Redis URL | redis://localhost:6379 |
| `FRONTEND_URL` | Frontend URL | http://localhost:3000 |

## SDKs and Libraries

### JavaScript/Node.js
```bash
npm install chatflow-pro-sdk
```

### Python
```bash
pip install chatflow-pro-python
```

### PHP
```bash
composer require chatflow-pro/php-sdk
```

## Support

For API support, contact:
- Email: api-support@chatflow-pro.com
- Documentation: https://docs.chatflow-pro.com
- GitHub Issues: https://github.com/chatflow-pro/api/issues 