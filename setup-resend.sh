#!/bin/bash

# SafeSpace - Resend Email Setup Script

echo "🚀 SafeSpace - Resend Email Configuration"
echo "=========================================="
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please copy .env.example to .env first"
    exit 1
fi

# Prompt for Resend API key
echo "📧 Enter your Resend API key (starts with 're_'):"
read -r RESEND_KEY

if [ -z "$RESEND_KEY" ]; then
    echo "❌ Error: API key cannot be empty"
    exit 1
fi

# Prompt for FROM email
echo ""
echo "📬 Enter FROM email address (default: onboarding@resend.dev):"
read -r FROM_EMAIL
FROM_EMAIL=${FROM_EMAIL:-onboarding@resend.dev}

# Update .env file
echo ""
echo "⚙️  Updating .env configuration..."

# Update MAIL_MAILER
sed -i.bak 's/^MAIL_MAILER=.*/MAIL_MAILER=resend/' .env

# Update or add RESEND_API_KEY
if grep -q "^RESEND_API_KEY=" .env; then
    sed -i.bak "s|^RESEND_API_KEY=.*|RESEND_API_KEY=$RESEND_KEY|" .env
else
    echo "" >> .env
    echo "# Resend Configuration" >> .env
    echo "RESEND_API_KEY=$RESEND_KEY" >> .env
fi

# Update MAIL_FROM_ADDRESS
sed -i.bak "s|^MAIL_FROM_ADDRESS=.*|MAIL_FROM_ADDRESS=\"$FROM_EMAIL\"|" .env

# Clear caches
echo ""
echo "🧹 Clearing configuration cache..."
php artisan config:clear > /dev/null 2>&1
php artisan cache:clear > /dev/null 2>&1

echo ""
echo "✅ Resend configuration completed!"
echo ""
echo "📋 Configuration Summary:"
echo "   - Mailer: resend"
echo "   - API Key: ${RESEND_KEY:0:10}..."
echo "   - From Email: $FROM_EMAIL"
echo ""
echo "🧪 Test your setup:"
echo "   1. Visit: http://localhost:8000/test-email?email=your@email.com"
echo "   2. Or run: php artisan tinker"
echo "      Then: Mail::raw('Test', fn(\$m) => \$m->to('your@email.com')->subject('Test'));"
echo ""
echo "📖 Full guide: RESEND_SETUP_GUIDE.md"
echo ""
