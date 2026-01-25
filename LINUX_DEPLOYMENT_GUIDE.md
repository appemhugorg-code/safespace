# 🐧 SafeSpace Linux Deployment Guide

Complete guide for deploying SafeSpace on Linux systems - from local development to production.

## 📋 Table of Contents

- [System Requirements](#system-requirements)
- [Local Development Setup](#local-development-setup)
- [Production Deployment](#production-deployment)
- [SSL Configuration](#ssl-configuration)
- [Service Management](#service-management)
- [Troubleshooting](#troubleshooting)

---

## 🖥️ System Requirements

### Minimum Requirements
- **OS**: Ubuntu 20.04+, CentOS 8+, Debian 11+, or similar
- **RAM**: 2 GB (4 GB recommended)
- **Storage**: 10 GB free space (20 GB recommended)
- **CPU**: 1 vCPU (2 vCPU recommended)

### Required Software
- Docker 20.10+
- Docker Compose 2.0+
- Git
- Curl/Wget

---

## 🚀 Local Development Setup

### Step 1: Install Dependencies

#### Ubuntu/Debian
```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y git curl wget unzip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for group changes
newgrp docker
```

#### CentOS/RHEL/Fedora
```bash
# Update system
sudo dnf update -y

# Install required packages
sudo dnf install -y git curl wget unzip

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again
newgrp docker
```

### Step 2: Clone and Setup SafeSpace

```bash
# Clone the repository
git clone https://github.com/your-username/safespace.git
cd safespace

# Copy environment file
cp .env.example .env

# Generate application key
docker-compose run --rm safespace-app php artisan key:generate

# Start development environment
docker-compose up -d

# Run database migrations
docker-compose exec safespace-app php artisan migrate

# Seed database (optional)
docker-compose exec safespace-app php artisan db:seed
```

### Step 3: Access Development Environment

- **Application**: http://localhost
- **Database**: localhost:5432 (PostgreSQL)
- **Redis**: localhost:6379
- **WebSockets**: ws://localhost:8080

### Step 4: Development Commands

```bash
# View logs
docker-compose logs -f

# Access application container
docker-compose exec safespace-app bash

# Run artisan commands
docker-compose exec safespace-app php artisan [command]

# Install npm packages
docker-compose exec safespace-app npm install

# Build frontend assets
docker-compose exec safespace-app npm run build

# Stop development environment
docker-compose down
```

---

## 🌐 Production Deployment

### Option 1: Automated Deployment

```bash
# Download and run the universal deployment script
wget https://raw.githubusercontent.com/your-username/safespace/main/universal-deploy.sh
chmod +x universal-deploy.sh
./universal-deploy.sh
```

### Option 2: Manual Production Setup

#### Step 1: System Preparation

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y git curl wget unzip htop iotop nethogs

# Install Docker and Docker Compose (same as development)
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Configure firewall
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw enable
```

#### Step 2: Clone and Configure

```bash
# Clone repository
git clone https://github.com/your-username/safespace.git
cd safespace

# Set up production environment
cp .env.production.example .env.production

# Edit environment variables
nano .env.production
```

#### Step 3: Deploy Application

```bash
# Build and start production services
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build

# Run database migrations
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec safespace-app php artisan migrate --force

# Cache configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec safespace-app php artisan config:cache
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec safespace-app php artisan route:cache
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec safespace-app php artisan view:cache
```

---

## 🔒 SSL Configuration

### Step 1: Domain Setup

Ensure your domain points to your server:
```bash
# Check DNS resolution
nslookup app.emhug.org
dig app.emhug.org

# Should return your server's IP address
```

### Step 2: SSL Certificate Generation

```bash
# Using the automated SSL setup
chmod +x deploy-ssl.sh
./deploy-ssl.sh
```

### Step 3: Manual SSL Setup (if needed)

```bash
# Create certificate directories
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Start nginx for domain verification
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml up -d nginx

# Generate SSL certificate
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml run --rm certbot certonly \
  --webroot \
  --webroot-path=/var/www/certbot \
  --email admin@emhug.org \
  --agree-tos \
  --no-eff-email \
  -d app.emhug.org

# Start all services with SSL
cp .env.production.ssl .env.production
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml up -d
```

---

## 🔧 Service Management

### Systemd Service (Optional)

Create a systemd service for automatic startup:

```bash
# Create service file
sudo nano /etc/systemd/system/safespace.service
```

Add the following content:
```ini
[Unit]
Description=SafeSpace Application
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/safespace
ExecStart=/usr/local/bin/docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
ExecStop=/usr/local/bin/docker-compose -f docker-compose.yml -f docker-compose.prod.yml down
TimeoutStartSec=0
User=ubuntu
Group=docker

[Install]
WantedBy=multi-user.target
```

Enable and start the service:
```bash
sudo systemctl daemon-reload
sudo systemctl enable safespace.service
sudo systemctl start safespace.service
```

### Management Commands

```bash
# Check service status
sudo systemctl status safespace

# Start/stop/restart service
sudo systemctl start safespace
sudo systemctl stop safespace
sudo systemctl restart safespace

# View service logs
sudo journalctl -u safespace -f
```

### Docker Management

```bash
# View running containers
docker-compose ps

# View logs
docker-compose logs -f [service_name]

# Restart specific service
docker-compose restart [service_name]

# Update application
git pull origin main
docker-compose build safespace-app
docker-compose up -d safespace-app

# Clean up unused images
docker system prune -a
```

---

## 📊 Monitoring and Maintenance

### Log Management

```bash
# View application logs
docker-compose logs -f safespace-app

# View nginx logs
docker-compose logs -f nginx

# View database logs
docker-compose logs -f postgres

# System logs
sudo journalctl -f
```

### Performance Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Monitor system resources
htop                    # CPU and memory usage
iotop                   # Disk I/O
nethogs                 # Network usage
df -h                   # Disk space
free -h                 # Memory usage
```

### Database Management

```bash
# Access PostgreSQL
docker-compose exec postgres psql -U safespace_user -d safespace_production

# Backup database
docker-compose exec postgres pg_dump -U safespace_user safespace_production > backup.sql

# Restore database
docker-compose exec -T postgres psql -U safespace_user -d safespace_production < backup.sql
```

### Automated Backups

Create backup script:
```bash
nano backup.sh
```

Add content:
```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/backups"
mkdir -p $BACKUP_DIR

# Database backup
docker-compose exec -T postgres pg_dump -U safespace_user safespace_production > $BACKUP_DIR/db_$DATE.sql

# Storage backup
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz storage/

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
```

Make executable and schedule:
```bash
chmod +x backup.sh

# Add to crontab
crontab -e
# Add: 0 2 * * * /home/ubuntu/safespace/backup.sh
```

---

## 🔍 Troubleshooting

### Common Issues

#### 1. Permission Denied Errors
```bash
# Fix Docker permissions
sudo usermod -aG docker $USER
newgrp docker

# Fix file permissions
sudo chown -R $USER:$USER ./storage
sudo chmod -R 755 ./storage
```

#### 2. Port Already in Use
```bash
# Check what's using the port
sudo netstat -tulpn | grep :80
sudo lsof -i :80

# Stop conflicting services
sudo systemctl stop apache2
sudo systemctl stop nginx
```

#### 3. Database Connection Issues
```bash
# Check PostgreSQL logs
docker-compose logs postgres

# Reset database
docker-compose down
docker volume rm safespace_postgres_data
docker-compose up -d postgres
docker-compose exec safespace-app php artisan migrate
```

#### 4. SSL Certificate Issues
```bash
# Check certificate status
./scripts/verify-ssl.sh

# Renew certificate
./scripts/renew-ssl.sh

# Check nginx configuration
docker-compose exec nginx nginx -t
```

#### 5. Out of Memory
```bash
# Add swap space
sudo fallocate -l 2G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### Log Locations

```bash
# Application logs
./storage/logs/laravel.log

# Docker logs
docker-compose logs

# System logs
/var/log/syslog
/var/log/auth.log

# Nginx logs (if using host nginx)
/var/log/nginx/access.log
/var/log/nginx/error.log
```

### Health Checks

```bash
# Check application health
curl -I http://localhost
curl -I https://app.emhug.org

# Check database connection
docker-compose exec safespace-app php artisan tinker
# In tinker: DB::connection()->getPdo();

# Check Redis connection
docker-compose exec redis redis-cli ping
```

---

## 🎯 Quick Reference

### Essential Commands

```bash
# Start development
docker-compose up -d

# Start production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Start with SSL
docker-compose -f docker-compose.yml -f docker-compose.ssl.yml up -d

# View logs
docker-compose logs -f

# Access container
docker-compose exec safespace-app bash

# Run migrations
docker-compose exec safespace-app php artisan migrate

# Clear cache
docker-compose exec safespace-app php artisan cache:clear

# Stop services
docker-compose down

# Update application
git pull && docker-compose build && docker-compose up -d
```

### File Locations

```
safespace/
├── .env                          # Environment configuration
├── docker-compose.yml            # Development setup
├── docker-compose.prod.yml       # Production overrides
├── docker-compose.ssl.yml        # SSL configuration
├── deploy-ssl.sh                 # SSL deployment script
├── storage/logs/                 # Application logs
├── certbot/                      # SSL certificates
└── scripts/                      # Management scripts
```

---

## 🎉 Success Checklist

- [ ] System dependencies installed
- [ ] Docker and Docker Compose working
- [ ] SafeSpace repository cloned
- [ ] Environment configured
- [ ] Database migrations completed
- [ ] Application accessible
- [ ] SSL certificate installed (production)
- [ ] Backups configured
- [ ] Monitoring set up

Your SafeSpace application should now be running successfully on Linux!