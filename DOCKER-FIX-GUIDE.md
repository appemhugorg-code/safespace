# Docker Production Fix Guide

## Quick Fix (Run on Production Server)

```bash
# SSH into your production server first
ssh user@app.emhug.org

# Navigate to your project directory
cd /path/to/safe-space-app

# Run the fix script
./docker-fix.sh
```

## What the Script Does

The script runs these commands inside your Docker container:

1. **Clears caches** - Removes stale route/config caches
2. **Runs migrations** - Ensures database is up to date
3. **Rebuilds caches** - Creates fresh optimized caches
4. **Fixes permissions** - Ensures Laravel can write to storage
5. **Restarts Reverb** - Restarts WebSocket server
6. **Verifies routes** - Confirms appointments route exists

## Manual Commands (If Script Fails)

```bash
# Clear caches
docker exec safespace-app php artisan cache:clear
docker exec safespace-app php artisan route:clear
docker exec safespace-app php artisan config:clear

# Rebuild caches
docker exec safespace-app php artisan config:cache
docker exec safespace-app php artisan route:cache

# Restart Reverb
docker exec safespace-app php artisan reverb:restart
```

## Check Logs

```bash
# View live logs
docker logs safespace-app -f

# View last 50 lines
docker logs safespace-app --tail 50
```

## Run Diagnostics

```bash
./docker-diagnose.sh
```

## Access Container Shell

```bash
# If you need to run commands manually
docker exec -it safespace-app bash

# Then inside container:
php artisan route:list
php artisan migrate:status
tail -f storage/logs/laravel.log
```

## Restart Containers (Nuclear Option)

```bash
# Restart just the app
docker restart safespace-app

# Or restart everything
docker-compose -f docker-compose.yml -f docker-compose.prod.yml restart
```

## Common Issues

### "Container not found"
```bash
# Check container name
docker ps

# Update CONTAINER variable in scripts if different
```

### "Permission denied"
```bash
# Make scripts executable
chmod +x docker-fix.sh docker-diagnose.sh
```

### Still getting 404
```bash
# Check if route exists
docker exec safespace-app php artisan route:list | grep appointments

# Check Laravel logs
docker logs safespace-app --tail 100 | grep -i error
```
