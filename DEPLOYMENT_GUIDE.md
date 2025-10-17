# Licita Sonar Deployment Guide

## Overview

This guide provides step-by-step instructions for deploying the Licita Sonar application to production environments. The application consists of a Node.js backend and a static frontend that can be deployed separately.

## Prerequisites

- Node.js v16+ installed
- npm or yarn package manager
- Git installed
- Accounts on Render (backend) and Vercel (frontend)

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd licita-sonar
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   Create a `.env` file in the root directory:
   ```env
   ACCESS_TOKEN_SECRET=your_secure_jwt_secret_here
   PORT=3000
   NODE_ENV=production
   ```

4. **Initialize the database**:
   The SQLite database will be created automatically on first run.

5. **Start the development server**:
   ```bash
   npm run dev
   ```

## Production Deployment

### Backend Deployment (Render)

1. **Create a Render account**:
   - Go to https://render.com
   - Sign up for a free account

2. **Create a new Web Service**:
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Set the following configuration:
     - Name: `licita-sonar-backend`
     - Region: Choose your preferred region
     - Branch: `main`
     - Root Directory: Leave empty
     - Environment: `Node`
     - Build Command: `npm install`
     - Start Command: `node src/index.js`
     - Plan: `Free`

3. **Configure environment variables**:
   In the "Advanced" section, add these environment variables:
   ```
   ACCESS_TOKEN_SECRET=your_production_jwt_secret_here
   NODE_ENV=production
   ```

4. **Deploy**:
   - Click "Create Web Service"
   - Render will automatically build and deploy your application
   - Note the generated URL for your backend

### Frontend Deployment (Vercel)

1. **Create a Vercel account**:
   - Go to https://vercel.com
   - Sign up for a free account

2. **Import the project**:
   - Click "New Project"
   - Import your Git repository or upload the files
   - Set the following configuration:
     - Framework Preset: `Other`
     - Root Directory: Leave as default
     - Build Command: `npm run build:frontend`
     - Output Directory: `public`
     - Install Command: `npm install`

3. **Configure environment variables** (if needed):
   - Generally not required for static frontend

4. **Deploy**:
   - Click "Deploy"
   - Vercel will build and deploy your frontend

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ACCESS_TOKEN_SECRET` | JWT secret for authentication | `your_secure_secret_here` |
| `PORT` | Server port (optional, defaults to 3000) | `3000` |
| `NODE_ENV` | Environment (development/production) | `production` |

### Optional Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `LOG_LEVEL` | Logging level (error/warn/info/debug) | `info` |

## Database Management

The application uses SQLite for data storage. In production:

1. **Backup Strategy**:
   - Regularly backup the `database.sqlite` file
   - Consider automated backup solutions

2. **Migration**:
   - Database schema is automatically created on first run
   - Future schema changes should be handled with migration scripts

## Monitoring and Logging

### Log Files
- `logs/error.log` - Error logs
- `logs/combined.log` - All logs

### Health Checks
- Endpoint: `GET /health`
- Returns: Application status, uptime, memory usage

### Monitoring
- Set up alerts for application downtime
- Monitor log files for errors
- Track scraping success rates

## Scaling Considerations

### Current Limitations
- SQLite database limits concurrent writes
- Single server instance
- Puppeteer resource usage

### Scaling Options
1. **Database**: Migrate to PostgreSQL or MySQL
2. **Clustering**: Use PM2 or similar process managers
3. **Microservices**: Split scraping functionality into separate services
4. **Caching**: Implement Redis for session caching

## Troubleshooting

### Common Issues

1. **Port in use**:
   ```bash
   # On Linux/Mac
   lsof -i :3000
   kill -9 <PID>
   
   # On Windows
   netstat -ano | findstr :3000
   taskkill /PID <PID> /F
   ```

2. **Database locked**:
   - Ensure only one process accesses the database
   - Check for orphaned database connections

3. **Scraping failures**:
   - Check logs for "BLOCKED" or "Estrutura alterada" errors
   - Verify target website is accessible
   - Update selectors in scraper utility if structure changed

4. **Authentication issues**:
   - Verify `ACCESS_TOKEN_SECRET` is set correctly
   - Check JWT token expiration settings

### Debugging

1. **Enable debug logging**:
   Set `LOG_LEVEL=debug` in environment variables

2. **Check browser compatibility**:
   Ensure Puppeteer dependencies are installed:
   ```bash
   npm install puppeteer
   ```

3. **Test scraping manually**:
   Use the "Coletar Agora" button to trigger immediate scraping

## Security Considerations

### Authentication
- Use a strong `ACCESS_TOKEN_SECRET`
- JWT tokens expire after 24 hours
- Passwords are hashed with bcrypt

### Data Protection
- User data is isolated by user ID
- Sessions are user-specific
- No sensitive data is stored in logs

### Network Security
- CORS is configured for specific origins
- HTTPS is recommended for production
- API endpoints are protected with authentication

## Maintenance

### Regular Tasks
1. **Database cleanup**:
   - Remove old sessions that are no longer needed
   - Archive old chat messages

2. **Log rotation**:
   - Implement log rotation to prevent disk space issues
   - Monitor log file sizes

3. **Dependency updates**:
   - Regularly update npm packages
   - Monitor for security vulnerabilities

### Backup Strategy
1. **Daily backups**:
   - Backup `database.sqlite` file
   - Backup `logs/` directory

2. **Disaster recovery**:
   - Document recovery procedures
   - Test backup restoration regularly

## Support

For deployment issues, please:
1. Check the logs for error messages
2. Verify all environment variables are set
3. Ensure all dependencies are installed
4. Contact the development team if issues persist

## Version Information

Current version: 1.0.0
Node.js requirement: v16+