# Automation System Documentation

## Overview

The ChatFlow Pro Automation System allows you to create automated responses and workflows for your WhatsApp business. This system enables you to automatically respond to customer messages, send scheduled messages, and manage media files for your automation rules.

## Features

### 🔄 Automation Rules
- **Keyword-based triggers**: Respond automatically when customers mention specific words
- **Welcome messages**: Send automatic greetings to new contacts
- **Scheduled messages**: Send messages at specific times
- **Event-based triggers**: Respond to specific events or conditions

### 📊 Analytics & Monitoring
- Real-time execution logs
- Performance statistics
- Success/failure tracking
- Automation insights and recommendations

### 📁 Media Library
- Upload and manage media files
- Support for images, videos, audio, and documents
- Easy integration with automation rules

### ⏰ Scheduled Messages
- Schedule messages for future delivery
- Cancel pending messages
- Track delivery status

## Getting Started

### 1. Access the Automation Dashboard

Navigate to `/automation` in your ChatFlow Pro application to access the automation dashboard.

### 2. Create Your First Automation Rule

1. Click "Create Rule" in the Automation Rules tab
2. Choose a trigger type:
   - **Keyword**: Respond when specific words are mentioned
   - **Welcome**: Send messages to new contacts
   - **Schedule**: Send messages at specific times
   - **Event**: Respond to specific events

3. Configure trigger conditions
4. Add actions (send message, send media, schedule message, etc.)
5. Set priority and activation status

### 3. Upload Media Files

1. Go to the Media Library tab
2. Click "Upload Media"
3. Provide file details and URL
4. Use uploaded media in your automation rules

## Automation Rule Types

### Keyword-based Rules

Trigger when customers mention specific keywords in their messages.

**Example:**
- Keywords: ["price", "cost", "how much"]
- Action: Send message with pricing information

**Configuration:**
```json
{
  "triggerType": "keyword",
  "triggerConditions": {
    "keywords": ["price", "cost", "how much"]
  },
  "actions": [
    {
      "type": "send_message",
      "data": {
        "content": "Our pricing starts at $99/month. Would you like to see our full price list?"
      }
    }
  ]
}
```

### Welcome Messages

Automatically send greetings to new contacts.

**Example:**
- Trigger: First message from a contact
- Action: Send welcome message with business information

**Configuration:**
```json
{
  "triggerType": "welcome",
  "triggerConditions": {},
  "actions": [
    {
      "type": "send_message",
      "data": {
        "content": "Welcome! Thank you for contacting us. How can we help you today?"
      }
    },
    {
      "type": "send_media",
      "data": {
        "mediaId": "uuid-of-media-file",
        "caption": "Here's our latest catalog"
      }
    }
  ]
}
```

### Scheduled Messages

Send messages at specific times or intervals.

**Example:**
- Trigger: Daily at 9 AM
- Action: Send daily reminder

**Configuration:**
```json
{
  "triggerType": "schedule",
  "triggerConditions": {
    "schedule": {
      "days": [1, 2, 3, 4, 5], // Monday to Friday
      "time": {
        "start": "09:00",
        "end": "09:00"
      }
    }
  },
  "actions": [
    {
      "type": "schedule_message",
      "data": {
        "content": "Good morning! Don't forget to check your daily tasks.",
        "scheduledAt": "2024-01-15T09:00:00Z"
      }
    }
  ]
}
```

### Event-based Rules

Respond to specific events or conditions.

**Example:**
- Trigger: No response for 24 hours
- Action: Send follow-up message

**Configuration:**
```json
{
  "triggerType": "event",
  "triggerConditions": {
    "events": ["no_response_24h"]
  },
  "actions": [
    {
      "type": "send_message",
      "data": {
        "content": "Hi! We noticed you haven't responded. Is there anything we can help you with?"
      }
    }
  ]
}
```

## Action Types

### Send Message
Send an immediate text message to the contact.

```json
{
  "type": "send_message",
  "data": {
    "content": "Your message here",
    "messageType": "text"
  }
}
```

### Send Media
Send a media file (image, video, audio, document) to the contact.

```json
{
  "type": "send_media",
  "data": {
    "mediaId": "uuid-of-media-file",
    "caption": "Optional caption"
  }
}
```

### Schedule Message
Schedule a message for future delivery.

```json
{
  "type": "schedule_message",
  "data": {
    "content": "Your scheduled message",
    "scheduledAt": "2024-01-15T10:00:00Z",
    "messageType": "text"
  }
}
```

### Update Contact
Update contact information or add tags.

```json
{
  "type": "update_contact",
  "data": {
    "name": "Updated Name",
    "email": "new@email.com"
  }
}
```

### Add Tag
Add a tag to the contact for categorization.

```json
{
  "type": "add_tag",
  "data": {
    "tag": "interested_customer"
  }
}
```

## Media Library

### Supported File Types
- **Images**: JPG, PNG, GIF, WebP
- **Videos**: MP4, AVI, MOV
- **Audio**: MP3, WAV, OGG
- **Documents**: PDF, DOC, DOCX, TXT

### Upload Process
1. Provide a name for the media file
2. Select the file type
3. Enter the file URL (must be publicly accessible)
4. Optionally provide file size and MIME type
5. Click "Upload"

### Using Media in Automation
After uploading media files, you can reference them in your automation rules using their unique ID.

## Scheduled Messages

### Managing Scheduled Messages
- View all scheduled messages in the Scheduled Messages tab
- Filter by status (pending, sent, failed, cancelled)
- Cancel pending messages before they're sent
- Track delivery status and errors

### Scheduling Options
- **Immediate**: Send within the next minute
- **Specific time**: Send at a specific date and time
- **Recurring**: Send at regular intervals (via automation rules)

## Analytics & Monitoring

### Execution Logs
Track all automation rule executions with detailed logs including:
- Trigger type and conditions
- Action results
- Success/failure status
- Error messages (if any)
- Execution timestamps

### Performance Metrics
- Total rule executions
- Success rate percentage
- Failed executions count
- Average response time
- Most active rules

### Recommendations
The system provides intelligent recommendations based on your automation performance:
- Suggestions for improving rule configurations
- Alerts for failed executions
- Tips for optimizing automation workflows

## Best Practices

### 1. Start Simple
- Begin with basic keyword-based rules
- Test thoroughly before activating
- Monitor performance and adjust as needed

### 2. Use Clear Keywords
- Choose specific, relevant keywords
- Avoid overly broad terms
- Consider variations and synonyms

### 3. Personalize Messages
- Use contact names when possible
- Provide relevant, helpful information
- Keep messages concise and clear

### 4. Monitor and Optimize
- Regularly review execution logs
- Analyze success rates
- Update rules based on performance

### 5. Respect Contact Preferences
- Don't spam contacts with too many automated messages
- Provide opt-out options
- Respect quiet hours

## API Reference

### Automation Rules

#### Get All Rules
```http
GET /api/automation/rules
```

#### Create Rule
```http
POST /api/automation/rules
Content-Type: application/json

{
  "name": "Price Inquiry Response",
  "description": "Respond to price inquiries",
  "triggerType": "keyword",
  "triggerConditions": {
    "keywords": ["price", "cost"]
  },
  "actions": [
    {
      "type": "send_message",
      "data": {
        "content": "Our pricing information..."
      }
    }
  ],
  "priority": 1,
  "isActive": true
}
```

#### Update Rule
```http
PUT /api/automation/rules/:id
```

#### Delete Rule
```http
DELETE /api/automation/rules/:id
```

#### Toggle Rule Status
```http
PATCH /api/automation/rules/:id/toggle
```

### Media Library

#### Get Media Files
```http
GET /api/automation/media
```

#### Upload Media
```http
POST /api/automation/media
Content-Type: application/json

{
  "name": "Product Catalog",
  "type": "document",
  "fileUrl": "https://example.com/catalog.pdf",
  "fileSize": 1024000,
  "mimeType": "application/pdf"
}
```

#### Delete Media
```http
DELETE /api/automation/media/:id
```

### Analytics

#### Get Statistics
```http
GET /api/automation/stats?days=30
```

#### Get Execution Logs
```http
GET /api/automation/logs?page=1&limit=20
```

### Scheduled Messages

#### Get Scheduled Messages
```http
GET /api/automation/scheduled?status=pending
```

#### Cancel Scheduled Message
```http
DELETE /api/automation/scheduled/:id
```

## Troubleshooting

### Common Issues

#### Rule Not Triggering
1. Check if the rule is active
2. Verify trigger conditions are correct
3. Ensure keywords match exactly (case-sensitive)
4. Check execution logs for errors

#### Messages Not Sending
1. Verify WhatsApp connection is active
2. Check message content for invalid characters
3. Ensure media files are accessible
4. Review error logs for specific issues

#### Scheduled Messages Not Delivering
1. Verify the scheduled message processor is running
2. Check server timezone settings
3. Ensure messages are scheduled for future times
4. Review scheduled message logs

### Error Codes

- `400`: Invalid request data
- `401`: Unauthorized access
- `403`: Forbidden operation
- `404`: Resource not found
- `422`: Validation error
- `500`: Internal server error

### Getting Help

If you encounter issues with the automation system:

1. Check the execution logs for error details
2. Review the analytics dashboard for performance insights
3. Contact support with specific error messages and rule configurations
4. Test rules in a development environment first

## Security Considerations

### Data Protection
- All automation data is encrypted at rest
- API endpoints require authentication
- User data is isolated per account
- Media files are validated before processing

### Rate Limiting
- API requests are rate-limited to prevent abuse
- Automation executions are throttled to prevent spam
- Scheduled messages have delivery limits

### Privacy
- Contact information is handled according to privacy regulations
- Users can opt out of automated messages
- All data processing follows GDPR guidelines

## Future Enhancements

### Planned Features
- **AI-powered responses**: Smart reply suggestions
- **Advanced scheduling**: Recurring message patterns
- **A/B testing**: Test different automation strategies
- **Integration APIs**: Connect with external services
- **Advanced analytics**: Machine learning insights
- **Multi-language support**: Internationalization

### Customization Options
- **Custom triggers**: User-defined trigger conditions
- **Template system**: Reusable message templates
- **Workflow builder**: Visual automation designer
- **Advanced media**: Rich media support

---

For more information or support, please contact the ChatFlow Pro team. 