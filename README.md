# Licita Sonar - Public Bidding Chat Monitoring System

## Overview

Licita Sonar is a comprehensive solution for monitoring real-time chat communications in public bidding sessions on the BB platform (https://licitacoes-e2.bb.com.br). This system allows users to track multiple bidding sessions, collect chat messages, and analyze communications for business intelligence and compliance purposes.

## Features

### Core Functionality
- **Multi-Session Monitoring**: Add and track multiple bidding sessions by their IDs
- **Real-time Chat Collection**: Automatically scrape and collect chat messages from sessions
- **User Authentication**: Secure login/registration system with JWT tokens
- **Session Management**: Maintain a list of active monitoring sessions
- **Session Switching**: Enable users to switch between different sessions
- **Advanced Filtering**: Filter messages by CNPJ or custom keywords
- **Real-time Updates**: WebSocket-based live message updates
- **Data Persistence**: Store all collected data in SQLite database

### Technical Features
- **Anti-Detection Scraping**: Uses Puppeteer with stealth plugin to avoid bot detection
- **User Agent Rotation**: 20+ realistic user agents to mimic human behavior
- **Human Interaction Simulation**: Random scrolls, clicks, and delays
- **Responsive Web Interface**: Modern, mobile-friendly dashboard
- **RESTful API**: Well-documented API endpoints for all functionality
- **WebSocket Communication**: Real-time message broadcasting
- **Comprehensive Logging**: Detailed logs for debugging and monitoring

## Architecture

### Frontend
- **HTML/CSS/JavaScript**: Pure frontend implementation without external frameworks
- **Responsive Design**: Works on desktop and mobile devices
- **Real-time UI**: Updates automatically with new messages via WebSocket

### Backend
- **Node.js/Express**: REST API server
- **SQLite**: Lightweight database for data storage
- **Puppeteer**: Web scraping engine with anti-detection features
- **Socket.IO**: Real-time communication
- **JWT**: Secure authentication

## Installation

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
   Create a `.env` file based on `.env.example`:
   ```env
   ACCESS_TOKEN_SECRET=your_jwt_secret_here
   PORT=3000
   ```

4. **Start the application**:
   ```bash
   npm start
   ```

5. **Access the application**:
   Open your browser and navigate to `http://localhost:3000`

## Usage

### 1. Authentication
- Register a new account or login with existing credentials
- All sessions are user-specific for data privacy

### 2. Session Management
- Add sessions by their ID using the "Adicionar Sessão" form
- View all monitored sessions in the sidebar
- Click on any session to view its chat messages
- Delete sessions you no longer want to monitor

### 3. Message Monitoring
- Real-time message updates appear automatically
- Use filters to highlight specific CNPJs or keywords
- Refresh manually or trigger immediate scraping with "Coletar Agora"

### 4. Data Analysis
- View statistics on message count and active sessions
- Filter messages for specific information
- All data is persisted for historical analysis

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Verify JWT token

### Sessions
- `POST /api/sessions/add` - Add new session to monitor
- `GET /api/sessions` - Get all user sessions
- `GET /api/sessions/:sessionId/messages` - Get messages for a session
- `POST /api/sessions/:sessionId/scrape` - Trigger manual scraping

## Deployment

### Backend (Render)
- Free tier deployment with 750 hours/month
- Automatic scaling and SSL

### Frontend (Vercel)
- Free tier static site hosting
- Automatic deployments from GitHub

## Anti-Detection Measures

To avoid being blocked by the target website, the system implements:
- User agent rotation (20+ realistic agents)
- Human interaction simulation (random scrolls, clicks, delays)
- Puppeteer stealth plugin for fingerprint evasion
- Randomized scraping intervals (5-15 seconds)
- Proper HTTP headers and viewport settings

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a pull request

## Support

For support, please open an issue on the GitHub repository or contact the development team.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Company Information

This solution was developed to help companies monitor public bidding processes transparently, identify business opportunities in real-time, and ensure fair and transparent public procurement processes. The system acts as a "sonar" that detects and tracks relevant conversations in the "sea" of public bidding chats, hence the name "Licita Sonar".