#!/bin/bash
# Universal Cloud Deployment Script for SafeSpace
# Supports: DigitalOcean, AWS EC2, GCP, Vultr, Linode

set -e

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_status() { echo -e "${BLUE}[INFO]${NC} $1"; }
print_success() { echo -e "${GREEN}[SUCCESS]${NC} $1"; }
print_warning() { echo -e "${YELLOW}[WARNING]${NC} $1"; }
print_error() { echo -e "${RED}[ERROR]${NC} $1"; }

echo "🌐 SafeSpace Universal Cloud Deployment"
echo "======================================"
echo "Domain: app.emhug.org"
echo "Target: Production with SSL"
echo ""

# Detect cloud provider
detect_provider() {
    if curl -s --max-time 2 http://169.254.169.254/metadata/v1/id &>/dev/null; then
        echo "DigitalOcean"
    elif curl -s --max-time 2 http://169.254.169.254/latest/meta-data/instance-id &>/dev/null; then
        echo "AWS"
    elif curl -s --max-time 2 -H "Metadata-Flavor: Google" http://169.254.169.254/computeMetadata/v1/instance/id &>/dev/null; then
        echo "GCP"
    else
        echo "Unknown"
    fi
}

PROVIDER=$(detect_provider)
print_status "Detected cloud provider: $PROVIDER"

# Get server information
SERVER_IP=$(curl -s ifconfig.me || curl -s ipinfo.io/ip || echo "Unable to detect")
print_status "Server IP: $SERVER_IP"

# Check if running as root
if [ "$EUID" -eq 0 ]; then
    print_error "Please don't run this script as root. Use a regular user with sudo privileges."
    exit 1
fi

# Update system
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install Docker
print_status "Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh
    sudo usermod -aG docker $USER
    rm get-docker.sh
    print_success "Docker installed successfully"
else
    print_success "Docker already installed"
fi

# Install Docker Compose
print_status "Installing Docker Compose..."
if ! command -v docker-compose &> /dev/null; then
    sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
    sudo chmod +x /usr/local/bin/docker-compose
    print_success "Docker Compose installed successfully"
else
    print_success "Docker Compose already installed"
fi

# Install additional tools
print_status "Installing additional tools..."
sudo apt install -y git curl wget unzip htop iotop nethogs

# Configure firewall
print_status "Configuring firewall..."
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
echo "y" | sudo ufw enable
print_success "Firewall configured"

# Check if SafeSpace directory exists
if [ -d "safespace" ]; then
    print_warning "SafeSpace directory already exists"
    read -p "Do you want to update it? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        cd safespace
        git pull origin main
        print_success "Repository updated"
    else
        cd safespace
    fi
else
    # Get repository URL
    print_status "Setting up SafeSpace repository..."
    echo "Please provide your SafeSpace repository URL:"
    echo "Examples:"
    echo "  - https://github.com/username/safespace.git"
    echo "  - git@github.com:username/safespace.git"
    echo ""
    read -p "Repository URL: " REPO_URL
    
    if [ -z "$REPO_URL" ]; then
        print_error "Repository URL is required"
        exit 1
    fi
    
    print_status "Cloning SafeSpace repository..."
    git clone $REPO_URL safespace
    cd safespace
    print_success "Repository cloned successfully"
fi

# Configure environment
print_status "Configuring production environment..."
if [ ! -f ".env.production.ssl" ]; then
    print_error ".env.production.ssl file not found in repository"
    exit 1
fi

cp .env.production.ssl .env.production

# Update environment variables
print_status "Updating environment configuration..."
sed -i "s|APP_URL=.*|APP_URL=https://app.emhug.org|" .env.production
sed -i "s|REVERB_HOST=.*|REVERB_HOST=\"app.emhug.org\"|" .env.production
sed -i "s|VITE_REVERB_HOST=.*|VITE_REVERB_HOST=\"app.emhug.org\"|" .env.production
sed -i "s|SANCTUM_STATEFUL_DOMAINS=.*|SANCTUM_STATEFUL_DOMAINS=app.emhug.org|" .env.production

print_success "Environment configured for app.emhug.org"

# DNS Check
print_status "Checking DNS configuration..."
DOMAIN_IP=$(dig +short app.emhug.org | tail -n1)

if [ "$DOMAIN_IP" = "$SERVER_IP" ]; then
    print_success "DNS is correctly configured"
else
    print_warning "DNS Configuration Issue:"
    echo "  Domain app.emhug.org resolves to: $DOMAIN_IP"
    echo "  Server IP is: $SERVER_IP"
    echo ""
    echo "Please update your DNS settings:"
    echo "  1. Go to your domain registrar (where you bought app.emhug.org)"
    echo "  2. Set an A record: app.emhug.org → $SERVER_IP"
    echo "  3. Wait 5-30 minutes for DNS propagation"
    echo ""
    read -p "Continue anyway? (y/n): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_error "Please configure DNS first, then run this script again"
        exit 1
    fi
fi

# Check if deployment script exists
if [ ! -f "deploy-ssl.sh" ]; then
    print_error "deploy-ssl.sh not found in repository"
    exit 1
fi

# Make deployment script executable
chmod +x deploy-ssl.sh
chmod +x scripts/*.sh 2>/dev/null || true

# Final confirmation
echo ""
print_status "Ready to deploy SafeSpace with SSL"
echo "Configuration Summary:"
echo "  🌐 Domain: app.emhug.org"
echo "  🖥️  Server IP: $SERVER_IP"
echo "  ☁️  Provider: $PROVIDER"
echo "  🔒 SSL: Let's Encrypt"
echo "  📧 Admin Email: admin@emhug.org"
echo ""
read -p "Proceed with deployment? (y/n): " -n 1 -r
echo

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "Deployment cancelled"
    exit 0
fi

# Start deployment
print_status "Starting SSL deployment..."
./deploy-ssl.sh

# Post-deployment setup
print_status "Setting up post-deployment configurations..."

# Create backup directory
mkdir -p ~/backups

# Set up automatic SSL renewal
print_status "Setting up automatic SSL renewal..."
(crontab -l 2>/dev/null; echo "0 12 * * * $(pwd)/scripts/renew-ssl.sh") | crontab -

# Set up health monitoring
print_status "Setting up health monitoring..."
cat > health-check.sh << 'EOF'
#!/bin/bash
DOMAIN="app.emhug.org"
LOG_FILE="$HOME/health-check.log"

echo "$(date): Starting health check" >> $LOG_FILE

# Check HTTPS
if curl -s -f https://$DOMAIN > /dev/null; then
    echo "$(date): ✅ HTTPS OK" >> $LOG_FILE
else
    echo "$(date): ❌ HTTPS FAILED - Restarting services" >> $LOG_FILE
    cd $(dirname "$0")
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart
fi

# Check SSL expiry (30 days)
if echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -checkend 2592000 > /dev/null; then
    echo "$(date): ✅ SSL Certificate valid" >> $LOG_FILE
else
    echo "$(date): ⚠️ SSL Certificate expires soon - Renewing" >> $LOG_FILE
    cd $(dirname "$0")
    ./scripts/renew-ssl.sh
fi
EOF

chmod +x health-check.sh

# Schedule health checks every 6 hours
(crontab -l 2>/dev/null; echo "0 */6 * * * $(pwd)/health-check.sh") | crontab -

# Create backup script
print_status "Setting up backup system..."
cat > backup.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$HOME/backups"
PROJECT_DIR=$(dirname "$0")

mkdir -p $BACKUP_DIR

echo "$(date): Starting backup" >> $BACKUP_DIR/backup.log

# Backup database
cd $PROJECT_DIR
docker-compose -f docker-compose.yml -f docker-compose.prod.yml exec -T postgres pg_dump -U safespace_user safespace_production > $BACKUP_DIR/db_$DATE.sql

# Backup storage
tar -czf $BACKUP_DIR/storage_$DATE.tar.gz storage/

# Keep only last 7 days
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
find $BACKUP_DIR -name "*.tar.gz" -mtime +7 -delete

echo "$(date): Backup completed" >> $BACKUP_DIR/backup.log
EOF

chmod +x backup.sh

# Schedule daily backups at 2 AM
(crontab -l 2>/dev/null; echo "0 2 * * * $(pwd)/backup.sh") | crontab -

# Enable swap for small instances
if [ $(free -m | awk 'NR==2{print $2}') -lt 2048 ]; then
    print_status "Enabling swap for better performance..."
    if [ ! -f /swapfile ]; then
        sudo fallocate -l 2G /swapfile
        sudo chmod 600 /swapfile
        sudo mkswap /swapfile
        sudo swapon /swapfile
        echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
        print_success "2GB swap enabled"
    fi
fi

# Final verification
print_status "Running final verification..."
sleep 10

if curl -s -I https://app.emhug.org | grep -q "200 OK"; then
    print_success "✅ Application is accessible via HTTPS"
else
    print_warning "⚠️ Application may not be fully ready yet"
fi

# Display completion message
echo ""
echo "🎉 SafeSpace Cloud Deployment Complete!"
echo "======================================"
print_success "✅ SafeSpace deployed with SSL"
print_success "✅ Automatic SSL renewal configured"
print_success "✅ Health monitoring enabled"
print_success "✅ Daily backups scheduled"
print_success "✅ Performance optimizations applied"
echo ""
echo "📋 Deployment Summary:"
echo "   🌐 Application URL: https://app.emhug.org"
echo "   🔒 SSL Certificate: Let's Encrypt"
echo "   ☁️  Cloud Provider: $PROVIDER"
echo "   🖥️  Server IP: $SERVER_IP"
echo "   📧 Admin Email: admin@emhug.org"
echo ""
echo "🔧 Management Commands:"
echo "   View status:  docker-compose -f docker-compose.yml -f docker-compose.prod.yml ps"
echo "   View logs:    docker-compose -f docker-compose.yml -f docker-compose.prod.yml logs"
echo "   Restart:      docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart"
echo "   Stop:         docker-compose -f docker-compose.yml -f docker-compose.prod.yml down"
echo "   SSL renewal:  ./scripts/renew-ssl.sh"
echo "   Verify SSL:   ./scripts/verify-ssl.sh"
echo "   Backup:       ./backup.sh"
echo ""
echo "📊 Monitoring:"
echo "   Health logs:  tail -f ~/health-check.log"
echo "   Backup logs:  tail -f ~/backups/backup.log"
echo "   Cron jobs:    crontab -l"
echo ""
echo "🔗 Next Steps:"
echo "   1. Test your application: https://app.emhug.org"
echo "   2. Check SSL rating: https://www.ssllabs.com/ssltest/analyze.html?d=app.emhug.org"
echo "   3. Monitor logs and performance"
echo "   4. Set up additional monitoring if needed"
echo ""
print_success "🚀 SafeSpace is now live at https://app.emhug.org"