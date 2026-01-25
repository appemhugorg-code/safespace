# SafeSpace Cloud Deployment Guide

This guide provides step-by-step instructions to deploy SafeSpace to various cloud providers with SSL support for `app.emhug.org`.

## 🌐 Supported Cloud Providers

- [DigitalOcean Droplets](#digitalocean-deployment)
- [AWS EC2](#aws-ec2-deployment)
- [Google Cloud Platform](#gcp-deployment)
- [Vultr](#vultr-deployment)
- [Linode](#linode-deployment)

---

## 🚀 DigitalOcean Deployment

### Prerequisites
- DigitalOcean account
- Domain `app.emhug.org` configured to point to your droplet IP

### Step 1: Create Droplet

1. **Create Droplet:**
   - Size: 2 GB RAM, 1 vCPU (minimum)
   - OS: Ubuntu 22.04 LTS
   - Add SSH key for secure access

2. **Configure Firewall:**
   ```bash
   # Allow HTTP, HTTPS, and SSH
   ufw allow 22
   ufw allow 80
   ufw allow 443
   ufw enable
   ```

### Step 2: Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install additional tools
sudo apt install -y git curl wget unzip
```

### Step 3: Deploy Application

```bash
# Clone repository
git clone <your-repo-url> safespace
cd safespace

# Set up environment
cp .env.production.ssl .env.production

# Update domain configuration
sed -i 's/APP_URL=.*/APP_URL=https:\/\/app.emhug.org/' .env.production

# Deploy with SSL
chmod +x deploy-ssl.sh
./deploy-ssl.sh
```

### Step 4: Configure DNS

1. Go to your domain registrar
2. Set A record: `app.emhug.org` → Your droplet IP
3. Wait for DNS propagation (5-30 minutes)

---

## ☁️ AWS EC2 Deployment

### Step 1: Launch EC2 Instance

1. **Instance Configuration:**
   - AMI: Ubuntu Server 22.04 LTS
   - Instance Type: t3.small (minimum)
   - Storage: 20 GB GP3

2. **Security Group:**
   ```
   Type        Protocol    Port Range    Source
   SSH         TCP         22           0.0.0.0/0
   HTTP        TCP         80           0.0.0.0/0
   HTTPS       TCP         443          0.0.0.0/0
   ```

3. **Elastic IP:**
   - Allocate and associate an Elastic IP
   - Update DNS to point to this IP

### Step 2: Connect and Setup

```bash
# Connect to instance
ssh -i your-key.pem ubuntu@your-elastic-ip

# Install Docker and dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker ubuntu

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Logout and login again for docker group changes
exit
ssh -i your-key.pem ubuntu@your-elastic-ip
```

### Step 3: Deploy Application

```bash
# Clone and deploy
git clone <your-repo-url> safespace
cd safespace

# Configure environment
cp .env.production.ssl .env.production
nano .env.production  # Update APP_URL and other settings

# Deploy
chmod +x deploy-ssl.sh
./deploy-ssl.sh
```

---

## 🌍 Google Cloud Platform Deployment

### Step 1: Create VM Instance

```bash
# Using gcloud CLI
gcloud compute instances create safespace-vm \
    --zone=us-central1-a \
    --machine-type=e2-small \
    --image-family=ubuntu-2204-lts \
    --image-project=ubuntu-os-cloud \
    --boot-disk-size=20GB \
    --tags=http-server,https-server

# Create firewall rules
gcloud compute firewall-rules create allow-http --allow tcp:80 --source-ranges 0.0.0.0/0 --target-tags http-server
gcloud compute firewall-rules create allow-https --allow tcp:443 --source-ranges 0.0.0.0/0 --target-tags https-server
```

### Step 2: Setup and Deploy

```bash
# SSH to instance
gcloud compute ssh safespace-vm --zone=us-central1-a

# Install dependencies and deploy (same as DigitalOcean steps 2-3)
```

---

## 🔥 Vultr Deployment

### Step 1: Deploy Server

1. **Server Configuration:**
   - Location: Choose closest to your users
   - Server Type: Cloud Compute
   - Size: 2 GB RAM, 1 vCPU
   - OS: Ubuntu 22.04

2. **Firewall:**
   - Allow ports 22, 80, 443

### Step 2: Setup and Deploy

Follow the same steps as DigitalOcean deployment.

---

## 🌊 Linode Deployment

### Step 1: Create Linode

1. **Linode Configuration:**
   - Distribution: Ubuntu 22.04 LTS
   - Plan: Nanode 1GB (minimum)
   - Region: Choose closest to users

2. **Firewall:**
   ```bash
   # Configure firewall
   ufw allow 22
   ufw allow 80
   ufw allow 443
   ufw enable
   ```

### Step 2: Setup and Deploy

Follow the same steps as DigitalOcean deployment.

---

## 🔧 Universal Deployment Script

Create this script on your cloud server for automated deployment:

```bash
#!/bin/bash
# universal-deploy.sh - Universal cloud deployment script

set -e

echo "🌐 SafeSpace Universal Cloud Deployment"
echo "======================================"

# Detect OS
if [ -f /etc/os-release ]; then
    . /etc/os-release
    OS=$NAME
fi

echo "Operating System: $OS"
echo "Domain: app.emhug.org"

# Update system
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
echo "🐳 Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
fi

# Install Docker Compose
echo "🔧 Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
fi

# Install additional tools
echo "🛠️ Installing additional tools..."
sudo apt install -y git curl wget unzip htop

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw allow 22
sudo ufw allow 80
sudo ufw allow 443
sudo ufw --force enable

# Clone repository
echo "📥 Cloning SafeSpace repository..."
if [ ! -d "safespace" ]; then
    read -p "Enter your repository URL: " REPO_URL
    git clone $REPO_URL safespace
fi

cd safespace

# Configure environment
echo "⚙️ Configuring environment..."
cp .env.production.ssl .env.production

# Get server IP
SERVER_IP=$(curl -s ifconfig.me)
echo "Server IP: $SERVER_IP"

# Update environment with server IP
sed -i "s/REVERB_HOST=.*/REVERB_HOST=\"app.emhug.org\"/" .env.production
sed -i "s/APP_URL=.*/APP_URL=https:\/\/app.emhug.org/" .env.production

echo "🚀 Starting deployment..."
echo "Make sure app.emhug.org points to $SERVER_IP"
read -p "Press Enter to continue when DNS is configured..."

# Deploy with SSL
chmod +x deploy-ssl.sh
./deploy-ssl.sh

echo "✅ Deployment completed!"
echo "🌐 Your application should be available at: https://app.emhug.org"
```

---

## 📋 Post-Deployment Checklist

### 1. Verify Deployment

```bash
# Check container status
docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps

# Test SSL
./scripts/verify-ssl.sh

# Check logs
docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs
```

### 2. Set Up Monitoring

```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Set up log rotation
sudo nano /etc/logrotate.d/safespace
```

Add to logrotate config:
```
/home/ubuntu/safespace/storage/logs/*.log {
    daily
    missingok
    rotate 52
    compress
    notifempty
    create 644 www-data www-data
}
```

### 3. Configure Automatic Updates

```bash
# Set up automatic SSL renewal
crontab -e

# Add this line:
0 12 * * * /home/ubuntu/safespace/scripts/renew-ssl.sh
```

### 4. Backup Strategy

```bash
# Create backup script
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/ubuntu/backups"
mkdir -p $BACKUP_DIR

# Backup database
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec -T postgres pg_dump -U safespace_user safespace_production > $BACKUP_DIR/db_$DATE.sql

# Backup uploads
tar -czf $BACKUP_DIR/uploads_$DATE.tar.gz storage/app/public/

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete
EOF

chmod +x backup.sh

# Schedule daily backups
crontab -e
# Add: 0 2 * * * /home/ubuntu/safespace/backup.sh
```

---

## 🔍 Troubleshooting

### Common Issues

1. **SSL Certificate Generation Fails:**
   ```bash
   # Check DNS resolution
   nslookup app.emhug.org
   
   # Test domain accessibility
   curl -I http://app.emhug.org
   
   # Check nginx logs
   docker-compose logs nginx
   ```

2. **Application Not Accessible:**
   ```bash
   # Check firewall
   sudo ufw status
   
   # Check container status
   docker-compose ps
   
   # Check application logs
   docker-compose logs safespace-app
   ```

3. **Database Connection Issues:**
   ```bash
   # Check PostgreSQL logs
   docker-compose logs postgres
   
   # Test database connection
   docker-compose exec postgres psql -U safespace_user -d safespace_production
   ```

### Performance Optimization

1. **Enable Swap (for small instances):**
   ```bash
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
   ```

2. **Optimize Docker:**
   ```bash
   # Clean up unused images
   docker system prune -a
   
   # Set up log rotation for containers
   sudo nano /etc/docker/daemon.json
   ```
   
   Add:
   ```json
   {
     "log-driver": "json-file",
     "log-opts": {
       "max-size": "10m",
       "max-file": "3"
     }
   }
   ```

---

## 📊 Monitoring and Maintenance

### Health Check Script

```bash
# Create health check
cat > health-check.sh << 'EOF'
#!/bin/bash
DOMAIN="app.emhug.org"

# Check HTTPS
if curl -s -f https://$DOMAIN > /dev/null; then
    echo "✅ HTTPS OK"
else
    echo "❌ HTTPS FAILED"
    # Restart services
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart
fi

# Check SSL expiry
DAYS_UNTIL_EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -checkend 2592000)
if [ $? -eq 0 ]; then
    echo "✅ SSL Certificate valid for >30 days"
else
    echo "⚠️ SSL Certificate expires soon"
    ./scripts/renew-ssl.sh
fi
EOF

chmod +x health-check.sh

# Run every 6 hours
crontab -e
# Add: 0 */6 * * * /home/ubuntu/safespace/health-check.sh
```

---

## 🎯 Quick Start Commands

```bash
# One-line deployment (after server setup)
curl -fsSL https://raw.githubusercontent.com/your-repo/safespace/main/universal-deploy.sh | bash

# Or manual deployment
git clone <your-repo> safespace && cd safespace && chmod +x deploy-ssl.sh && ./deploy-ssl.sh
```

Your SafeSpace application will be live at `https://app.emhug.org` with full SSL security and production optimizations!