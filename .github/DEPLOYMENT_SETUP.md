# GitHub Actions Deployment Setup

This guide will help you configure automatic deployment for your SafeSpace application using appleboy actions.

## Required GitHub Secrets

Go to your repository Settings → Secrets and variables → Actions, and add these secrets:

### Server Connection (Required)
- `SSH_PRIVATE_KEY`: Your private SSH key for server access
- `SSH_USER`: Username for SSH connection (e.g., `root` or `ubuntu`)
- `SERVER_HOST`: Your server IP address or domain (e.g., `155.138.228.28`)
- `PROJECT_PATH`: Full path to your project on the server (e.g., `/var/www/safespace`)

## SSH Key Setup

1. **Generate SSH key pair** (if you don't have one):
   ```bash
   ssh-keygen -t ed25519 -C "github-actions@safespace"
   ```

2. **Add public key to server**:
   ```bash
   # Copy public key to server
   ssh-copy-id -i ~/.ssh/id_ed25519.pub user@your-server-ip
   
   # Or manually add to ~/.ssh/authorized_keys on server
   ```

3. **Add private key to GitHub secrets**:
   - Copy the entire private key content (including `-----BEGIN` and `-----END` lines)
   - Paste it as the `SSH_PRIVATE_KEY` secret

## Server Preparation

Ensure your server has:

1. **Git repository cloned**:
   ```bash
   cd /var/www
   git clone https://github.com/yourusername/safespace.git
   cd safespace
   ```

2. **Docker and Docker Compose installed**:
   ```bash
   # Install Docker
   curl -fsSL https://get.docker.com -o get-docker.sh
   sh get-docker.sh
   
   # Install Docker Compose
   sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker compose
   sudo chmod +x /usr/local/bin/docker compose
   ```

3. **Production environment file**:
   ```bash
   cp .env.production.example .env.production
   # Edit .env.production with your production settings
   ```

4. **Proper permissions**:
   ```bash
   sudo chown -R $USER:$USER /var/www/safespace
   chmod +x deploy.sh
   ```

## How It Works

The workflow consists of two main jobs:

### 1. Test Job
- Runs PHP and JavaScript tests
- Sets up PostgreSQL database for testing
- Builds frontend assets
- Ensures code quality before deployment

### 2. Deploy Job
- **Copy Files**: Uses `appleboy/scp-action` to copy your code to the server
- **Run Deployment**: Uses `appleboy/ssh-action` to execute deployment commands
- **Verify**: Checks if the application is running correctly

## Usage

### Automatic Deployment
Push to `main` or `master` branch to trigger automatic deployment:
```bash
git push origin main
```

### Manual Deployment
Go to Actions tab → Select "Deploy SafeSpace Application" → "Run workflow"

## What Gets Deployed

The workflow automatically:
1. Installs PHP and Node.js dependencies
2. Builds your frontend assets
3. Copies all files to your server (excluding `node_modules`, `.git`, etc.)
4. Runs your existing `deploy.sh` script
5. Executes Laravel optimization commands
6. Runs database migrations
7. Verifies the deployment worked

## File Exclusions

The following files/folders are automatically excluded from deployment:
- `node_modules/`
- `.git/`
- `tests/`
- `storage/logs/*`
- `storage/framework/cache/*`
- `storage/framework/sessions/*`
- `storage/framework/views/*`

## Monitoring

- **GitHub Actions**: Monitor deployment progress in the Actions tab
- **Server logs**: `docker compose logs -f safespace-app`
- **Application**: Check your application at your server URL

## Troubleshooting

### Common Issues

1. **SSH Connection Failed**:
   - Verify SSH key is correct and in OpenSSH format
   - Check server firewall allows SSH (port 22)
   - Ensure SSH service is running on server

2. **SCP Copy Failed**:
   - Check `PROJECT_PATH` exists on server
   - Verify user has write permissions to target directory
   - Ensure sufficient disk space on server

3. **Docker Build Failed**:
   - Check Docker is installed and running on server
   - Verify Docker Compose version compatibility
   - Check server has enough memory and disk space

4. **Application Not Responding**:
   - Check `.env.production` file is configured correctly
   - Verify database connection settings
   - Check container logs: `docker compose logs safespace-app`

### Debug Commands

Run these on your server to debug issues:

```bash
# Check container status
docker compose -f docker compose.yml -f docker compose.prod.yml ps

# View application logs
docker compose -f docker compose.yml -f docker compose.prod.yml logs safespace-app

# Check disk space
df -h

# Check file permissions
ls -la /var/www/safespace
```

## Next Steps

1. Set up the required GitHub secrets (SSH_PRIVATE_KEY, SSH_USER, SERVER_HOST, PROJECT_PATH)
2. Test the deployment workflow by pushing to main branch
3. Monitor the deployment in GitHub Actions
4. Set up server monitoring and alerting