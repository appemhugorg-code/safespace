#!/bin/bash

# SSL Verification Script for SafeSpace
# Tests SSL certificate and application functionality

DOMAIN="app.emhug.org"
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

print_test() {
    echo -n "Testing $1... "
}

print_pass() {
    echo -e "${GREEN}PASS${NC}"
}

print_fail() {
    echo -e "${RED}FAIL${NC}"
}

print_warn() {
    echo -e "${YELLOW}WARN${NC}"
}

echo "🔍 SafeSpace SSL Verification"
echo "============================"
echo "Domain: $DOMAIN"
echo ""

# Test 1: HTTP to HTTPS redirect
print_test "HTTP to HTTPS redirect"
HTTP_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -L http://$DOMAIN)
if [ "$HTTP_RESPONSE" = "200" ]; then
    print_pass
else
    print_fail
    echo "   Expected: 200, Got: $HTTP_RESPONSE"
fi

# Test 2: HTTPS accessibility
print_test "HTTPS accessibility"
HTTPS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN)
if [ "$HTTPS_RESPONSE" = "200" ]; then
    print_pass
else
    print_fail
    echo "   Expected: 200, Got: $HTTPS_RESPONSE"
fi

# Test 3: SSL certificate validity
print_test "SSL certificate validity"
SSL_EXPIRY=$(echo | openssl s_client -servername $DOMAIN -connect $DOMAIN:443 2>/dev/null | openssl x509 -noout -dates | grep notAfter | cut -d= -f2)
if [ ! -z "$SSL_EXPIRY" ]; then
    print_pass
    echo "   Expires: $SSL_EXPIRY"
else
    print_fail
fi

# Test 4: Security headers
print_test "Security headers (HSTS)"
HSTS_HEADER=$(curl -s -I https://$DOMAIN | grep -i "strict-transport-security")
if [ ! -z "$HSTS_HEADER" ]; then
    print_pass
else
    print_warn
    echo "   HSTS header not found"
fi

# Test 5: WebSocket endpoint
print_test "WebSocket endpoint"
WS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" https://$DOMAIN/app/)
if [ "$WS_RESPONSE" = "426" ] || [ "$WS_RESPONSE" = "101" ]; then
    print_pass
else
    print_warn
    echo "   Expected: 426 or 101, Got: $WS_RESPONSE"
fi

# Test 6: Container health
print_test "Docker containers"
RUNNING_CONTAINERS=$(docker compose -f docker compose.yml -f docker compose.ssl.yml ps --services --filter "status=running" | wc -l)
TOTAL_CONTAINERS=$(docker compose -f docker compose.yml -f docker compose.ssl.yml ps --services | wc -l)

if [ "$RUNNING_CONTAINERS" -eq "$TOTAL_CONTAINERS" ]; then
    print_pass
    echo "   $RUNNING_CONTAINERS/$TOTAL_CONTAINERS containers running"
else
    print_fail
    echo "   $RUNNING_CONTAINERS/$TOTAL_CONTAINERS containers running"
fi

# Test 7: Certificate files
print_test "Certificate files"
if [ -f "./certbot/conf/live/$DOMAIN/fullchain.pem" ] && [ -f "./certbot/conf/live/$DOMAIN/privkey.pem" ]; then
    print_pass
else
    print_fail
    echo "   Certificate files not found"
fi

echo ""
echo "🔗 Quick Links:"
echo "   Application: https://$DOMAIN"
echo "   SSL Test:    https://www.ssllabs.com/ssltest/analyze.html?d=$DOMAIN"
echo ""
echo "📊 SSL Grade Check:"
echo "   Run: curl -s \"https://api.ssllabs.com/api/v3/analyze?host=$DOMAIN\" | jq '.endpoints[0].grade'"
echo ""