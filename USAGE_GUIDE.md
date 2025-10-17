# Licita Sonar Usage Guide

## Getting Started

Welcome to Licita Sonar, your comprehensive solution for monitoring real-time chat communications in public bidding sessions. This guide will walk you through all the features and functionality of the system.

## Registration and Login

### Creating an Account
1. Open your web browser and navigate to the Licita Sonar application
2. Click on the "Registrar" button
3. Enter a username and password
4. Click "Registrar" to create your account
5. You'll see a success message prompting you to log in

### Logging In
1. Enter your username and password in the login form
2. Click "Entrar" or press Enter
3. You'll be redirected to the main dashboard

### Logging Out
1. Click the "Sair" button in the top right corner
2. You'll be logged out and returned to the login screen

## Dashboard Overview

The main dashboard is divided into two main sections:

### Left Sidebar
- **Sessões Monitoradas**: List of all sessions you're currently monitoring
- **Adicionar Sessão**: Form to add new sessions to monitor
- **Filtros**: Tools to filter messages by CNPJ or keywords

### Main Content Area
- **Statistics Cards**: Overview of message count, active sessions, and system status
- **Chat Messages**: Real-time display of chat messages from selected sessions

## Session Management

### Adding a New Session
1. Find the session ID you want to monitor on https://licitacoes-e2.bb.com.br
2. In the "Adicionar Sessão" section, enter the session ID
3. Click the "Adicionar" button
4. The session will appear in your "Sessões Monitoradas" list

### Viewing Session Messages
1. Click on any session in the "Sessões Monitoradas" list
2. The session will become highlighted in blue
3. Messages from that session will appear in the main chat area
4. New messages will appear in real-time as they're collected

### Removing a Session
1. Click the trash can icon next to any session in your list
2. Confirm the deletion when prompted
3. The session will be removed from your monitoring list

## Message Monitoring

### Real-time Updates
- Messages appear automatically as they're collected from the BB website
- The system scrapes messages every 5-15 seconds
- New messages are highlighted with a blue left border

### Manual Refresh
1. Click the "Atualizar" button to manually refresh messages
2. This is useful if you suspect messages were missed

### Immediate Scraping
1. Click the "Coletar Agora" button to trigger immediate message collection
2. This bypasses the normal scraping interval
3. Useful for getting the most recent messages right away

## Filtering Messages

### Filtering by CNPJ
1. Enter a CNPJ in the "Filtrar por CNPJ" field (e.g., 12.345.678/0001-90)
2. Click "Aplicar Filtros"
3. Messages containing that CNPJ will be highlighted

### Filtering by Keywords
1. Enter a keyword in the "Filtrar por Palavra-chave" field (e.g., "convocação")
2. Click "Aplicar Filtros"
3. Messages containing that keyword will be highlighted

### Clearing Filters
1. Clear the filter fields
2. Click "Aplicar Filtros"
3. All messages will be displayed normally

## Statistics and Status

### Message Count
- Shows the total number of messages collected across all sessions
- Updates in real-time as new messages arrive

### Session Count
- Shows the number of active sessions you're monitoring
- Updates when you add or remove sessions

### System Status
- Green circle: System is operating normally
- Red circle: System is disconnected or experiencing issues

## Best Practices

### Session Management
- Only monitor sessions you're actively interested in
- Remove sessions you no longer need to reduce resource usage
- Check sessions regularly to ensure they're still active

### Filtering
- Use specific CNPJs or keywords for more relevant results
- Combine CNPJ and keyword filters for precise monitoring
- Update filters as your monitoring needs change

### Resource Usage
- The system automatically manages scraping intervals to avoid overloading the target website
- Avoid clicking "Coletar Agora" too frequently
- Close unused browser tabs to reduce memory usage

## Troubleshooting

### No Messages Appearing
1. Check that you've selected a session
2. Verify the session is still active on the BB website
3. Try clicking "Coletar Agora" to force immediate collection
4. Check if there are any error messages in the filter section

### Session Not Found
1. Verify the session ID is correct
2. Check that the session exists on the BB website
3. Some sessions may be private or restricted

### Authentication Issues
1. Ensure you're using the correct username and password
2. If you've forgotten your password, you'll need to create a new account
3. Try clearing your browser cache and cookies

### System Status Red
1. Check your internet connection
2. Refresh the page
3. If the issue persists, the system may be undergoing maintenance

## Advanced Features

### Multiple Session Monitoring
- Monitor multiple sessions simultaneously
- Switch between sessions to view different chat feeds
- Each session's messages are stored separately

### Historical Data
- All messages are stored in the database
- View historical messages even after they've scrolled off the screen
- Data is retained until manually deleted

### Export Options
- While there's no direct export feature, you can:
  - Copy messages from the interface
  - Access raw data through the API
  - Request database exports from administrators

## Privacy and Security

### Data Protection
- Your sessions and messages are private to your account
- No other users can see your monitored sessions
- All communication is secured with JWT authentication

### Data Retention
- Messages are stored indefinitely unless manually deleted
- Session data is retained until you remove the session
- Regular database backups ensure data safety

## Support

If you encounter any issues not covered in this guide:
1. Check for error messages in the interface
2. Try refreshing the page
3. Contact your system administrator
4. Refer to the technical documentation for advanced troubleshooting

## Glossary

- **Sessão**: A public bidding session on the BB platform
- **CNPJ**: Brazilian corporate tax ID number
- **Scraping**: Automated data collection from websites
- **WebSocket**: Technology enabling real-time communication
- **JWT**: JSON Web Token, used for secure authentication

## Version Information

Current version: 1.0.0
Last updated: 2025