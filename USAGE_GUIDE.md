# Licita Sonar Usage Guide

This guide explains how to use the Licita Sonar application after deployment to monitor public bidding chats on Licitações-e2.

## Getting Started

After deploying the application to Vercel (frontend) and Render (backend), you can access the web interface and API.

### Accessing the Web Interface

Visit your deployed frontend URL:
- Original interface: `https://your-project.vercel.app/`
- Modern dashboard: `https://your-project.vercel.app/dashboard.html`

### Using the API

Your backend API will be available at: `https://your-backend-url.onrender.com`

## Step-by-Step Usage

### 1. Register an Account

Before you can monitor sessions, you need to create an account:

1. Visit the web interface and use the registration form, OR
2. Use the API directly:

```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"yourusername","password":"yourpassword"}'
```

### 2. Login to Your Account

After registration, log in to get an authentication token:

1. Use the login form in the web interface, OR
2. Use the API:

```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"yourusername","password":"yourpassword"}'
```

Save the `accessToken` from the response for subsequent API calls.

### 3. Add Sessions to Monitor

To monitor a specific bidding session, you need to add it to your monitoring list:

1. In the web interface, use the "Adicionar Sessão" form, OR
2. Use the API:

```bash
curl -X POST https://your-backend-url.onrender.com/api/sessions/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"sessionId":"SESSION_ID_TO_MONITOR"}'
```

Replace `SESSION_ID_TO_MONITOR` with the actual session ID from Licitações-e2.

For example, if you want to monitor the session at:
`https://licitacoes-e2.bb.com.br/sessao/12345/chat`

The session ID is `12345`.

### 4. View Messages

Once you've added sessions, the application will automatically start scraping and collecting messages.

#### In the Web Interface

1. Select a session from the "Sessões Monitoradas" list
2. View real-time messages in the "Chat em Tempo Real" panel
3. Use filters to highlight specific CNPJs or keywords

#### Via API

To retrieve messages for a specific session:

```bash
curl https://your-backend-url.onrender.com/api/sessions/SESSION_ID/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### 5. Using Filters

The application supports filtering messages by:

1. **CNPJ**: Enter a CNPJ in the "Filtrar por CNPJ" field to highlight messages containing that CNPJ
2. **Keywords**: Enter keywords in the "Filtrar por Palavra-chave" field to highlight messages containing those keywords

Click "Aplicar Filtros" to update the message view.

## Web Interface Features

### Modern Dashboard

The modern dashboard (`/dashboard.html`) provides:

1. **Statistics Panel**:
   - Total messages collected
   - Active sessions count
   - System status indicator

2. **Session Management**:
   - Add new sessions to monitor
   - View and delete existing sessions
   - Select active session for monitoring

3. **Real-time Chat View**:
   - Live message updates via WebSocket
   - Message timestamping
   - Filter highlighting
   - Auto-scroll to newest messages

4. **Filtering System**:
   - CNPJ filtering with visual highlighting
   - Keyword filtering with visual highlighting
   - Apply filters button for immediate updates

### Original Interface

The original interface (`/`) provides similar functionality with a simpler design.

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/verify` - Verify token (used by frontend)

### Session Management

- `POST /api/sessions/add` - Add a session to monitor
- `GET /api/sessions` - Get user sessions
- `GET /api/sessions/:sessionId/messages` - Get chat messages for a session

## Example Workflow

Here's a complete example of how to use the API:

### 1. Register
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"myuser","password":"mypassword123"}'
```

### 2. Login
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"myuser","password":"mypassword123"}'
```

Response:
```json
{
  "message": "Login successful",
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "myuser"
  }
}
```

### 3. Add Session
```bash
curl -X POST https://your-backend-url.onrender.com/api/sessions/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..." \
  -d '{"sessionId":"12345"}'
```

### 4. Get Messages
```bash
curl https://your-backend-url.onrender.com/api/sessions/12345/messages \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

Response:
```json
{
  "messages": [
    {
      "id": 1,
      "sessao_id": "12345",
      "msg": "Pregoeiro: Sessão iniciada",
      "timestamp": "2023-01-01T10:00:00.000Z"
    },
    {
      "id": 2,
      "sessao_id": "12345",
      "msg": "Participante 123456789: Bom dia",
      "timestamp": "2023-01-01T10:00:05.000Z"
    }
  ]
}
```

## Finding Session IDs

To find session IDs to monitor:

1. Visit [Licitações-e2](https://licitacoes-e2.bb.com.br/)
2. Browse to the session you want to monitor
3. The URL will be in the format: `https://licitacoes-e2.bb.com.br/sessao/[SESSION_ID]/chat`
4. Extract the `SESSION_ID` from the URL

For example, for the URL `https://licitacoes-e2.bb.com.br/sessao/98765/chat`, the session ID is `98765`.

## Best Practices

### Session Management

1. **Limit Sessions**: The free tier supports up to 10 concurrent sessions
2. **Remove Unused Sessions**: Delete sessions you're no longer monitoring
3. **Monitor Regularly**: Check sessions periodically to ensure they're still active

### Filtering

1. **Specific CNPJs**: Use complete CNPJ numbers for accurate filtering
2. **Relevant Keywords**: Focus on keywords like "convocação", "habilitação", "empate"
3. **Combine Filters**: Use both CNPJ and keyword filters for precise results

### Security

1. **Strong Passwords**: Use strong, unique passwords for your accounts
2. **Token Management**: Keep your JWT tokens secure
3. **Regular Logouts**: Log out when using shared computers

## Troubleshooting

### Common Issues

1. **No Messages**: 
   - Check if the session is still active on Licitações-e2
   - Verify the session ID is correct
   - Wait a few minutes for the scraper to collect messages

2. **Authentication Errors**:
   - Ensure you're using the correct token
   - Check that your token hasn't expired (24-hour validity)
   - Verify your username and password

3. **Connection Issues**:
   - Check your internet connection
   - Verify the backend URL is correct
   - Check Render logs for backend issues

### Getting Help

If you encounter issues:

1. Check the application logs
2. Verify your environment variables
3. Review the deployment guides
4. Contact support if needed

## Compliance

The application follows ethical scraping practices:

1. **Respectful Requests**: Random delays between 5-15 seconds
2. **User-Agent Rotation**: 20+ realistic user agents
3. **Human Simulation**: Scroll and click simulation
4. **Error Handling**: Graceful handling of 403/429 responses
5. **Local Storage**: All data stored locally, no external sharing

## Limitations

1. **Free Tier**: 750 hours/month on Render
2. **Session Limit**: Up to 10 concurrent sessions
3. **No Proxies**: No proxy rotation (free tier restriction)
4. **Site Changes**: May require updates if Licitações-e2 changes structure

## Next Steps

After deployment and initial setup:

1. Add sessions you want to monitor
2. Set up regular checking schedules
3. Configure notifications (future enhancement)
4. Share relevant messages with your team
5. Provide feedback for improvements

Your Licita Sonar application is now ready to help you monitor public bidding chats efficiently and ethically!