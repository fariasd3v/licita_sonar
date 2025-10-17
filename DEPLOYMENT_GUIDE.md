# Licita Sonar Deployment Guide

This guide will help you deploy the Licita Sonar application to Vercel (frontend) and Render (backend) for production use.

## Prerequisites

1. GitHub account
2. Vercel account (free tier)
3. Render account (free tier)
4. Node.js installed locally (for testing)

## Project Structure

```
licita-sonar/
├── src/                 # Backend source code
├── public/              # Frontend static files
│   ├── index.html       # Original frontend
│   └── dashboard.html   # Modern dashboard
├── package.json         # Project dependencies and scripts
├── vercel.json          # Vercel deployment configuration
├── render.yaml          # Render deployment configuration
├── .env.example         # Environment variables template
└── README.md            # Project documentation
```

## Frontend Deployment (Vercel)

### Step 1: Push to GitHub

1. Create a new repository on GitHub
2. Push your local code to the repository:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/licita-sonar.git
   git push -u origin main
   ```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework Preset: Other
   - Root Directory: Leave empty
   - Build and Output Settings:
     - Build Command: `npm run build:frontend` (or leave empty for static deployment)
     - Output Directory: `public`
     - Install Command: `npm install`
5. Click "Deploy"
6. Wait for the deployment to complete

### Step 3: Access Your Frontend

Once deployed, Vercel will provide you with a URL like:
```
https://licita-sonar.vercel.app
```

You can access:
- Original frontend: `https://your-url.vercel.app/`
- Modern dashboard: `https://your-url.vercel.app/dashboard.html`

## Backend Deployment (Render)

### Step 1: Deploy to Render

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - Name: `licita-sonar-backend`
   - Region: Choose your preferred region
   - Branch: main
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
5. Click "Advanced" and add environment variables:
   - `ACCESS_TOKEN_SECRET`: Generate a strong secret key
   - `NODE_ENV`: `production`
6. Click "Create Web Service"

### Step 2: Get Your Backend URL

Render will provide you with a URL like:
```
https://licita-sonar-backend.onrender.com
```

## Configuration

### Environment Variables

Create a `.env` file in your project root with the following variables:

```env
# Server Configuration
PORT=3000
NODE_ENV=production

# Security
ACCESS_TOKEN_SECRET=your_super_secret_access_token_key_here_change_it

# Logging
LOG_LEVEL=info
```

**Important**: Never commit your `.env` file to version control. The `.gitignore` file already excludes it.

## API Usage

Once deployed, you can interact with your API using the Render URL.

### 1. Register a User

```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"yourusername","password":"yourpassword"}'
```

Response:
```json
{
  "message": "User created successfully",
  "accessToken": "your_jwt_token"
}
```

### 2. Login

```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"yourusername","password":"yourpassword"}'
```

Response:
```json
{
  "message": "Login successful",
  "accessToken": "your_jwt_token",
  "user": {
    "id": 1,
    "username": "yourusername"
  }
}
```

### 3. Add a Session to Monitor

```bash
curl -X POST https://your-backend-url.onrender.com/api/sessions/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"sessionId":"SESSION_ID_TO_MONITOR"}'
```

Response:
```json
{
  "message": "Session added successfully",
  "sessionId": "SESSION_ID_TO_MONITOR",
  "id": 1
}
```

### 4. Get Messages for a Session

```bash
curl https://your-backend-url.onrender.com/api/sessions/SESSION_ID/messages \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

Response:
```json
{
  "messages": [
    {
      "id": 1,
      "sessao_id": "SESSION_ID_TO_MONITOR",
      "msg": "Message content",
      "timestamp": "2023-01-01T00:00:00.000Z"
    }
  ]
}
```

## Testing Your Deployment

### 1. Test Frontend Access

Visit your Vercel URLs:
- `https://your-project.vercel.app/` (original interface)
- `https://your-project.vercel.app/dashboard.html` (modern dashboard)

### 2. Test Backend API

Use the registration endpoint to create a test user:
```bash
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'
```

### 3. Test Session Monitoring

After logging in, add a session to monitor:
```bash
# First login to get token
curl -X POST https://your-backend-url.onrender.com/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","password":"testpass123"}'

# Use the token from the response to add a session
curl -X POST https://your-backend-url.onrender.com/api/sessions/add \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_FROM_LOGIN" \
  -d '{"sessionId":"12345"}'
```

## Troubleshooting

### Common Issues

1. **CORS Errors**: Make sure your frontend and backend URLs are properly configured in the CORS settings.

2. **Environment Variables**: Ensure all required environment variables are set in Render.

3. **Build Failures**: Check the build logs in Vercel/Render for specific error messages.

4. **WebSocket Connection**: If WebSocket connections fail, check that your Render service supports WebSocket connections (it should by default).

### Checking Logs

- **Vercel**: Visit your project dashboard and click on "Logs"
- **Render**: Visit your service dashboard and click on "Logs"

## Scaling Considerations

The free tier limitations:
- Render: 750 hours/month
- Vercel: Generous free tier with reasonable limits
- SQLite: File-based database, suitable for small-scale applications

For production use with higher traffic, consider:
- Upgrading to paid tiers
- Using a managed database service
- Implementing proxy rotation for scraping
- Adding caching mechanisms

## Security Best Practices

1. **JWT Secret**: Use a strong, randomly generated secret for `ACCESS_TOKEN_SECRET`
2. **HTTPS**: Both Vercel and Render provide HTTPS by default
3. **Input Validation**: The application includes input sanitization
4. **Rate Limiting**: Consider implementing rate limiting for API endpoints
5. **Regular Updates**: Keep dependencies updated

## Monitoring

Render provides built-in monitoring:
- CPU usage
- Memory usage
- Response times
- Error rates

Set up alerts for critical metrics to ensure your application stays healthy.

## Conclusion

Your Licita Sonar application is now ready for deployment! The combination of Vercel for frontend and Render for backend provides a robust, zero-cost hosting solution that can handle the application's requirements.

Remember to:
1. Keep your environment variables secure
2. Monitor your application's usage
3. Stay within the free tier limits
4. Regularly update dependencies