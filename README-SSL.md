# SafeSpace SSL Setup Guide

This guide explains how to set up SSL certificates for SafeSpace production deployment using Let's Encrypt and Docker.

## Prerequisites

1. **Domain Setup**: Ensure `app.emhug.org` points to your server's IP address
2. **Docker & Docker Compose**: Installed on your production server
3. **Ports**: 80 and 443 should be open and available

## Quick Setup

Run the automated SSL setup script:

```bash
./scripts/ssl-setup.sh
```

This script will:
- Create necessary directories
- Obtain SSL certificates from Let's Encrypt
- Configure Nginx with SSL
- Start all services with HTTPS enabled
- Set up automatic renewal

## Manual Setup

If you prefer manual setup or need to troubleshoot:

### 1. Create Certificate Directories

```bash
mkdir -p ./certbot/conf
mkdir -p ./certbot/www
```

### 2. Start Initial Services

```bash
# Use init config for certificate generation
cp docker/nginx/init.conf docker/nginx/default.conf
docker-compose -f docker-compose.yml up -d nginx
```

### 3. Obtain SSL Certificate

```bash
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@emhug.org \
  --agree-tos \
  --no-eff-email \
  -d app.emhug.org
```

### 4. Switch to SSL Configuration

```bash
# Copy SSL environment
cp .env.production.ssl .env.production

# Start with SSL configuration
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml up -d
```

## File Structure

```
├── docker/
│   └── nginx/
│       ├── default.conf      # Original HTTP config
│       ├── ssl.conf          # SSL-enabled config
│       └── init.conf         # Initial setup config
├── scripts/
│   ├── ssl-setup.sh          # Automated setup script
│   └── renew-ssl.sh          # Renewal script
├── certbot/
│   ├── conf/                 # SSL certificates
│   └── www/                  # Challenge files
├── docker-compose.ssl.yml    # SSL-enabled compose file
├── .env.production.ssl       # SSL environment config
└── README-SSL.md            # This file
```

## Configuration Files

### SSL Nginx Configuration (`docker/nginx/ssl.conf`)
- HTTPS redirect from HTTP
- SSL/TLS security settings
- WebSocket support (WSS)
- Security headers
- Let's Encrypt challenge handling

### SSL Environment (`.env.production.ssl`)
- HTTPS URLs
- Secure cookies
- WSS for WebSockets
- SSL-specific Laravel settings

### Docker Compose SSL (`docker-compose.ssl.yml`)
- SSL port mappings (80, 443)
- Certificate volume mounts
- Certbot service configuration

## Certificate Management

### Automatic Renewal

Add to crontab for automatic renewal:

```bash
# Edit crontab
crontab -e

# Add this line (runs daily at noon)
0 12 * * * /path/to/your/project/scripts/renew-ssl.sh
```

### Manual Renewal

```bash
./scripts/renew-ssl.sh
```

### Check Certificate Status

```bash
# Check expiration
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml run --rm certbot certificates

# Test renewal (dry run)
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml run --rm certbot renew --dry-run
```

## Troubleshooting

### Certificate Generation Fails

1. **DNS Check**: Ensure `app.emhug.org` resolves to your server
   ```bash
   nslookup app.emhug.org
   ```

2. **Port Access**: Verify ports 80/443 are accessible
   ```bash
   curl -I http://app.emhug.org
   ```

3. **Nginx Logs**: Check for errors
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.ssl.yml logs nginx
   ```

### SSL Not Working

1. **Certificate Files**: Verify certificates exist
   ```bash
   ls -la ./certbot/conf/live/app.emhug.org/
   ```

2. **Nginx Configuration**: Test config syntax
   ```bash
   docker-compose -f docker-compose.yml -f docker-compose.ssl.yml exec nginx nginx -t
   ```

3. **SSL Test**: Use online SSL checker
   - https://www.ssllabs.com/ssltest/

### WebSocket Issues

1. **WSS Protocol**: Ensure frontend uses `wss://` for WebSockets
2. **Proxy Headers**: Check `X-Forwarded-Proto` is set to `https`
3. **Firewall**: Verify WebSocket port (8080) is accessible internally

## Security Features

- **TLS 1.2/1.3**: Modern encryption protocols
- **HSTS**: HTTP Strict Transport Security
- **Security Headers**: XSS, CSRF, Content-Type protection
- **CSP**: Content Security Policy
- **Secure Cookies**: HTTPS-only session cookies

## Production Checklist

- [ ] Domain DNS points to server
- [ ] Ports 80/443 are open
- [ ] SSL certificates obtained
- [ ] All services running with HTTPS
- [ ] WebSockets working (WSS)
- [ ] Automatic renewal configured
- [ ] SSL test passes (A+ rating)
- [ ] Application accessible via HTTPS

## Commands Reference

```bash
# Start with SSL
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml up -d

# View logs
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml logs

# Restart services
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml restart

# Stop services
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml down

# Renew certificates
./scripts/renew-ssl.sh

# Check certificate status
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml run --rm certbot certificates
```