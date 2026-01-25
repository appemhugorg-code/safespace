# SafeSpace Production Deployment Guide

This guide covers deploying SafeSpace with real-time messaging capabilities in a production Docker environment.

## Prerequisites

- Docker and Docker Compose installed
- Domain name configured (for WebSocket connections)
- SSL certificate (recommended for production)

## Production Architecture

The production setup includes these services:

- **SafeSpace App**: Laravel application with PHP-FPM
- **Nginx**: Web server and reverse proxy
- **PostgreSQL**: Primary database
- **Redis**: Cache, sessions, and queue backend
- **Supervisor**: Process manager for background services
  - **Queue Workers**: Process message broadcasting (2 workers)
  - **Reverb Server**: WebSocket server for real-time messaging
  - **Laravel Scheduler**: Handles scheduled tasks

## Quick Deployment

1. **Clone and configure:**
   ```bash
   git clone <repository-url>
   cd safespace-app
   cp .env.production.example .env.production
   ```

2. **Edit `.env.production`:**
   ```bash
   # Update these critical settings:
   APP_URL=https://your-domain.com
   REVERB_HOST="your-domain.com"
   REVERB_SCHEME=wss
   DB_PASSWORD=your-secure-password
   REVERB_APP_KEY=your-secure-key
   REVERB_APP_SECRET=your-secure-secret
   ```

3. **Deploy:**
   ```bash
   ./docker/scripts/deploy.sh
   ```

## Real-time Messaging Configuration

### Queue Workers
- **Purpose**: Process message broadcasting events
- **Count**: 2 workers for redundancy
- **Auto-restart**: Yes, managed by Supervisor
- **Logs**: `/var/log/supervisor/queue-worker.log`

### Reverb WebSocket Server
- **Purpose**: Handle real-time WebSocket connections
- **Port**: 8080 (exposed)
- **Auto-restart**: Yes, managed by Supervisor
- **Logs**: `/var/log/supervisor/reverb.log`

### Broadcasting Configuration
```env
BROADCAST_CONNECTION=reverb
QUEUE_CONNECTION=redis
REVERB_HOST="your-domain.com"
REVERB_PORT=8080
REVERB_SCHEME=wss  # Use 'wss' for HTTPS, 'ws' for HTTP
```

## Monitoring Real-time Services

### Check Service Status
```bash
./docker/scripts/monitor-realtime.sh
```

### Manual Service Management
```bash
# Check all processes
docker compose exec safespace-app supervisorctl status

# Restart queue workers
docker compose exec safespace-app supervisorctl restart laravel-queue-worker:*

# Restart Reverb server
docker compose exec safespace-app supervisorctl restart laravel-reverb

# View logs
docker compose logs -f safespace-app
```

## SSL/TLS Configuration (Production)

For production with HTTPS, you need to:

1. **Configure Nginx for SSL:**
   ```nginx
   server {
       listen 443 ssl http2;
       server_name your-domain.com;
       
       ssl_certificate /path/to/certificate.crt;
       ssl_certificate_key /path/to/private.key;
       
       # WebSocket proxy for Reverb
       location /app/ {
           proxy_pass http://safespace-app:8080;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

2. **Update environment variables:**
   ```env
   REVERB_SCHEME=wss
   REVERB_PORT=443
   ```

## Troubleshooting

### Messages Not Delivered in Real-time

1. **Check queue workers:**
   ```bash
   docker compose exec safespace-app supervisorctl status laravel-queue-worker:*
   ```

2. **Check Reverb server:**
   ```bash
   docker compose exec safespace-app supervisorctl status laravel-reverb
   ```

3. **Test WebSocket connection:**
   ```bash
   curl -I http://localhost:8080
   ```

### Queue Workers Not Processing

1. **Check Redis connection:**
   ```bash
   docker compose exec safespace-app php artisan tinker --execute="Redis::ping();"
   ```

2. **Manually process queue:**
   ```bash
   docker compose exec safespace-app php artisan queue:work --once
   ```

3. **Clear failed jobs:**
   ```bash
   docker compose exec safespace-app php artisan queue:clear
   ```

### WebSocket Connection Issues

1. **Check port accessibility:**
   ```bash
   netstat -tlnp | grep :8080
   ```

2. **Check firewall settings:**
   - Ensure port 8080 is open
   - For production, configure proper SSL termination

3. **Check browser console:**
   - Look for WebSocket connection errors
   - Verify correct WebSocket URL

## Performance Tuning

### Queue Workers
- Increase workers for high message volume: Edit `supervisord.conf`
- Monitor memory usage: `docker stats safespace-app`
- Adjust `--max-time` and `--max-jobs` parameters

### Reverb Server
- Monitor WebSocket connections
- Consider load balancing for multiple instances
- Use Redis for scaling across multiple servers

## Security Considerations

1. **Environment Variables:**
   - Use strong, unique keys for `REVERB_APP_KEY` and `REVERB_APP_SECRET`
   - Secure database passwords
   - Use HTTPS in production

2. **Network Security:**
   - Restrict database access to application containers
   - Use internal Docker networks
   - Configure proper firewall rules

3. **WebSocket Security:**
   - Use WSS (WebSocket Secure) in production
   - Implement proper authentication for private channels
   - Monitor for suspicious connection patterns

## Backup and Recovery

1. **Database Backups:**
   ```bash
   docker compose exec postgres pg_dump -U safespace_user safespace_production > backup.sql
   ```

2. **Redis Backups:**
   ```bash
   docker compose exec redis redis-cli BGSAVE
   ```

3. **Application Files:**
   - Backup uploaded files in `./public/uploads`
   - Backup storage directory `./storage`

## Scaling Considerations

For high-traffic deployments:

1. **Multiple Queue Workers:**
   - Increase `numprocs` in `supervisord.conf`
   - Monitor queue length and processing time

2. **Load Balancing:**
   - Use multiple application instances
   - Configure Redis for session sharing
   - Use external Redis cluster for queues

3. **Database Scaling:**
   - Consider read replicas for PostgreSQL
   - Implement connection pooling
   - Monitor query performance
