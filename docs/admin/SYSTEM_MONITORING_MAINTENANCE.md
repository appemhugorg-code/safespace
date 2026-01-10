# System Monitoring & Maintenance Procedures

## Overview

This guide provides comprehensive procedures for monitoring and maintaining the SafeSpace platform. It covers system health monitoring, performance optimization, security maintenance, and troubleshooting procedures.

## System Architecture Overview

### Core Components

1. **Web Application** (Laravel)
   - Main application server
   - API endpoints
   - Background job processing

2. **Database** (SQLite/PostgreSQL)
   - User data and content
   - Session and cache data
   - Analytics and logs

3. **External Integrations**
   - Google Workspace (Calendar/Meet)
   - Email service provider (SendGrid/Mailgun)
   - File storage and CDN

4. **Background Services**
   - Queue workers
   - Scheduled tasks
   - Email processing

## Daily Monitoring Tasks

### System Health Checks

1. **Application Status**:
   ```bash
   # Check application health
   curl -f https://safespace.app/health || echo "Application down"
   
   # Verify database connectivity
   php artisan tinker --execute="DB::connection()->getPdo();"
   
   # Check queue status
   php artisan queue:monitor
   ```

2. **Performance Metrics**:
   - Response time monitoring
   - Database query performance
   - Memory and CPU usage
   - Disk space availability

3. **Error Monitoring**:
   ```bash
   # Check application logs
   tail -f storage/logs/laravel.log | grep ERROR
   
   # Monitor failed jobs
   php artisan queue:failed
   
   # Check email delivery failures
   php artisan email:check-failures
   ```

### Key Metrics Dashboard

| Metric | Threshold | Action |
|--------|-----------|--------|
| Response Time | > 2 seconds | Investigate performance |
| Error Rate | > 1% | Review error logs |
| Queue Backlog | > 100 jobs | Scale workers |
| Disk Usage | > 80% | Clean up logs/files |
| Memory Usage | > 85% | Restart services |

## Weekly Monitoring Tasks

### Performance Analysis

1. **Database Performance**:
   ```sql
   -- Check slow queries
   SELECT * FROM information_schema.processlist 
   WHERE time > 30;
   
   -- Analyze table sizes
   SELECT table_name, 
          round(((data_length + index_length) / 1024 / 1024), 2) as 'Size (MB)'
   FROM information_schema.tables 
   WHERE table_schema = 'safespace'
   ORDER BY (data_length + index_length) DESC;
   ```

2. **Application Metrics**:
   - User activity patterns
   - Feature usage statistics
   - API endpoint performance
   - Email delivery rates

3. **Security Monitoring**:
   - Failed login attempts
   - Suspicious user activity
   - API rate limiting triggers
   - File upload security scans

### System Optimization

1. **Cache Management**:
   ```bash
   # Clear application cache
   php artisan cache:clear
   php artisan config:clear
   php artisan route:clear
   php artisan view:clear
   
   # Optimize for production
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Database Optimization**:
   ```bash
   # Run database maintenance
   php artisan db:optimize
   
   # Update statistics
   php artisan db:analyze-tables
   
   # Check for needed indexes
   php artisan db:check-indexes
   ```

## Monthly Maintenance Tasks

### System Updates

1. **Security Updates**:
   ```bash
   # Update Composer dependencies
   composer update --no-dev
   
   # Update NPM packages
   npm audit fix
   
   # Check for Laravel security updates
   php artisan about
   ```

2. **Database Maintenance**:
   ```bash
   # Backup database
   php artisan backup:run --only-db
   
   # Clean old data
   php artisan cleanup:old-logs
   php artisan cleanup:old-sessions
   php artisan cleanup:old-email-deliveries
   
   # Optimize database
   php artisan db:vacuum
   ```

3. **Log Management**:
   ```bash
   # Archive old logs
   find storage/logs -name "*.log" -mtime +30 -exec gzip {} \;
   
   # Clean up old archived logs
   find storage/logs -name "*.gz" -mtime +90 -delete
   
   # Rotate current logs
   php artisan log:rotate
   ```

## Google Integration Monitoring

### API Usage Monitoring

1. **Quota Tracking**:
   ```bash
   # Check Google API usage
   php artisan google:check-quota
   
   # Monitor rate limits
   php artisan google:monitor-limits
   ```

2. **Integration Health**:
   - Calendar sync status
   - Meeting link generation success rate
   - OAuth token refresh status
   - API error rates

3. **Troubleshooting Commands**:
   ```bash
   # Test Google Calendar connection
   php artisan google:test-calendar
   
   # Refresh expired tokens
   php artisan google:refresh-tokens
   
   # Verify meeting creation
   php artisan google:test-meet
   ```

## Email System Monitoring

### Delivery Monitoring

1. **Email Queue Status**:
   ```bash
   # Check email queue
   php artisan queue:monitor email
   
   # Process failed emails
   php artisan queue:retry all
   
   # Monitor delivery rates
   php artisan email:delivery-stats
   ```

2. **Provider Integration**:
   - SendGrid/Mailgun API status
   - Bounce and complaint rates
   - Delivery success rates
   - Spam filter performance

3. **Email Health Commands**:
   ```bash
   # Test email sending
   php artisan email:test admin@safespace.app
   
   # Check template rendering
   php artisan email:test-templates
   
   # Verify SMTP configuration
   php artisan email:verify-config
   ```

## Performance Monitoring

### Application Performance

1. **Response Time Monitoring**:
   ```php
   // Monitor slow endpoints
   Route::middleware('monitor.performance')->group(function () {
       // API routes
   });
   ```

2. **Database Query Optimization**:
   ```bash
   # Enable query logging
   php artisan db:monitor-queries
   
   # Analyze slow queries
   php artisan db:slow-query-report
   ```

3. **Memory Usage Tracking**:
   ```bash
   # Monitor memory usage
   php artisan monitor:memory
   
   # Check for memory leaks
   php artisan debug:memory-usage
   ```

### Resource Utilization

1. **Server Resources**:
   ```bash
   # Check disk usage
   df -h
   
   # Monitor CPU usage
   top -p $(pgrep php)
   
   # Check memory usage
   free -h
   ```

2. **Application Resources**:
   - Active user sessions
   - Background job processing
   - File upload storage
   - Cache utilization

## Security Monitoring

### Access Monitoring

1. **Authentication Logs**:
   ```bash
   # Monitor failed logins
   grep "authentication.failed" storage/logs/laravel.log
   
   # Check suspicious activity
   php artisan security:check-activity
   
   # Review admin access
   php artisan security:admin-access-log
   ```

2. **API Security**:
   - Rate limiting effectiveness
   - Invalid token attempts
   - Suspicious request patterns
   - CORS policy violations

### Vulnerability Scanning

1. **Dependency Scanning**:
   ```bash
   # Check for vulnerable packages
   composer audit
   npm audit
   
   # Security scan
   php artisan security:scan
   ```

2. **File Integrity**:
   ```bash
   # Check for unauthorized changes
   php artisan security:file-integrity
   
   # Scan uploaded files
   php artisan security:scan-uploads
   ```

## Backup & Recovery

### Backup Procedures

1. **Database Backups**:
   ```bash
   # Daily database backup
   php artisan backup:run --only-db
   
   # Full system backup (weekly)
   php artisan backup:run
   
   # Verify backup integrity
   php artisan backup:verify
   ```

2. **File Backups**:
   ```bash
   # Backup uploaded files
   rsync -av storage/app/public/ /backup/files/
   
   # Backup configuration
   cp .env /backup/config/env-$(date +%Y%m%d)
   ```

### Recovery Procedures

1. **Database Recovery**:
   ```bash
   # Restore from backup
   php artisan backup:restore --backup-date=2025-01-01
   
   # Verify data integrity
   php artisan db:verify-integrity
   ```

2. **Application Recovery**:
   ```bash
   # Restore application files
   git checkout main
   composer install --no-dev
   
   # Restore configuration
   cp /backup/config/env-latest .env
   
   # Run migrations if needed
   php artisan migrate --force
   ```

## Troubleshooting Procedures

### Common Issues

1. **Application Not Responding**:
   ```bash
   # Check process status
   ps aux | grep php
   
   # Restart PHP-FPM
   sudo systemctl restart php8.3-fpm
   
   # Check web server
   sudo systemctl status nginx
   ```

2. **Database Connection Issues**:
   ```bash
   # Test database connection
   php artisan tinker --execute="DB::connection()->getPdo();"
   
   # Check database service
   sudo systemctl status mysql
   
   # Review database logs
   tail -f /var/log/mysql/error.log
   ```

3. **Queue Processing Problems**:
   ```bash
   # Restart queue workers
   php artisan queue:restart
   
   # Check failed jobs
   php artisan queue:failed
   
   # Clear stuck jobs
   php artisan queue:flush
   ```

### Performance Issues

1. **Slow Response Times**:
   - Enable query logging
   - Check for N+1 queries
   - Review cache hit rates
   - Analyze slow endpoints

2. **High Memory Usage**:
   - Check for memory leaks
   - Review large data processing
   - Optimize image handling
   - Clear unnecessary caches

3. **Database Performance**:
   - Analyze slow queries
   - Check index usage
   - Review table sizes
   - Optimize query patterns

## Alerting & Notifications

### Alert Configuration

1. **Critical Alerts** (Immediate Response):
   - Application down
   - Database connection failure
   - High error rates (>5%)
   - Security breaches

2. **Warning Alerts** (Within 1 hour):
   - Slow response times
   - Queue backlog
   - High resource usage
   - Failed email deliveries

3. **Info Alerts** (Daily review):
   - Performance metrics
   - Usage statistics
   - Backup completion
   - Maintenance reminders

### Notification Channels

```php
// Configure alerts in config/monitoring.php
'alerts' => [
    'critical' => ['email', 'sms', 'slack'],
    'warning' => ['email', 'slack'],
    'info' => ['email']
],

'recipients' => [
    'critical' => ['admin@safespace.app', 'tech-lead@safespace.app'],
    'warning' => ['admin@safespace.app'],
    'info' => ['admin@safespace.app']
]
```

## Maintenance Schedules

### Daily Tasks (Automated)
- System health checks
- Error log monitoring
- Backup verification
- Performance metrics collection

### Weekly Tasks (Manual Review)
- Performance analysis
- Security log review
- Capacity planning
- Update planning

### Monthly Tasks (Scheduled Maintenance)
- System updates
- Database optimization
- Log cleanup
- Security audits

### Quarterly Tasks (Major Maintenance)
- Full system backup
- Disaster recovery testing
- Security penetration testing
- Performance optimization review

## Emergency Procedures

### Incident Response

1. **Severity Classification**:
   - **Critical**: Complete service outage
   - **High**: Major feature unavailable
   - **Medium**: Performance degradation
   - **Low**: Minor issues

2. **Response Timeline**:
   - Critical: Immediate response (< 15 minutes)
   - High: Within 1 hour
   - Medium: Within 4 hours
   - Low: Next business day

3. **Escalation Path**:
   1. On-call administrator
   2. Technical lead
   3. System administrator
   4. External support

### Contact Information

- **Primary Admin**: admin@safespace.app
- **Technical Lead**: tech-lead@safespace.app
- **Emergency**: +1-555-SAFE-SPACE
- **Hosting Provider**: [Provider Support]
- **Google Support**: [Google Cloud Support]

---

**Last Updated**: November 2025  
**Version**: 1.0  
**Maintained By**: SafeSpace Operations Team  
**Emergency Contact**: emergency@safespace.app