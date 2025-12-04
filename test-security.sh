#!/bin/bash

# Security Testing Script for NMBS Gamification Platform
# This script performs automated security checks

echo "🔒 NMBS Gamify - Security Testing Suite"
echo "========================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

API_URL="http://localhost:5000/api"
PASSED=0
FAILED=0

# Test 1: Environment Variables
echo "📋 Test 1: Environment Variables Validation"
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ FAILED${NC} - .env file not found"
    ((FAILED++))
else
    if grep -q "your_super_secret" .env; then
        echo -e "${YELLOW}⚠️  WARNING${NC} - Default JWT_SECRET detected"
        ((FAILED++))
    else
        echo -e "${GREEN}✅ PASSED${NC} - Custom JWT_SECRET configured"
        ((PASSED++))
    fi
fi
echo ""

# Test 2: Rate Limiting on Auth Endpoints
echo "📋 Test 2: Rate Limiting (Auth Endpoints)"
echo "Making 6 consecutive login attempts..."

RATE_LIMIT_TRIGGERED=false
for i in {1..6}; do
    RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/auth/login" \
        -H "Content-Type: application/json" \
        -d '{"email":"test@example.com","password":"wrongpassword"}')
    
    if [ "$RESPONSE" == "429" ]; then
        RATE_LIMIT_TRIGGERED=true
        break
    fi
    sleep 1
done

if [ "$RATE_LIMIT_TRIGGERED" = true ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Rate limiting is working (got 429 status)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Rate limiting not working (never got 429)"
    ((FAILED++))
fi
echo ""

# Test 3: Unauthorized Access Protection
echo "📋 Test 3: Unauthorized Access Protection"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "$API_URL/users/me")

if [ "$RESPONSE" == "401" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Protected routes return 401 without token"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Protected route accessible without token (got $RESPONSE)"
    ((FAILED++))
fi
echo ""

# Test 4: CORS Headers
echo "📋 Test 4: CORS Configuration"
CORS_HEADER=$(curl -s -I "$API_URL/auth/login" | grep -i "access-control-allow-origin")

if [ -n "$CORS_HEADER" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - CORS headers present: $CORS_HEADER"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - No CORS headers detected"
    ((FAILED++))
fi
echo ""

# Test 5: Security Headers (Helmet)
echo "📋 Test 5: Security Headers (Helmet.js)"
SECURITY_HEADERS=$(curl -s -I "$API_URL/auth/login" | grep -i "x-content-type-options\|x-frame-options\|x-xss-protection")

if [ -n "$SECURITY_HEADERS" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Security headers present"
    echo "$SECURITY_HEADERS"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Security headers missing"
    ((FAILED++))
fi
echo ""

# Test 6: Password in Response
echo "📋 Test 6: Password Exposure Check"
# This requires a valid user - adjust as needed
echo "Skipped - Requires manual testing with valid credentials"
echo ""

# Test 7: NPM Audit
echo "📋 Test 7: NPM Security Audit"
echo "Running npm audit..."
NPM_AUDIT_OUTPUT=$(npm audit --json 2>/dev/null)
VULNERABILITIES=$(echo "$NPM_AUDIT_OUTPUT" | jq -r '.metadata.vulnerabilities | .critical + .high + .moderate + .low' 2>/dev/null)

if [ -z "$VULNERABILITIES" ] || [ "$VULNERABILITIES" == "0" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - No vulnerabilities found"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠️  WARNING${NC} - Found $VULNERABILITIES vulnerabilities"
    echo "Run 'npm audit' for details"
    ((FAILED++))
fi
echo ""

# Test 8: Admin Routes Protection (if implemented)
echo "📋 Test 8: Admin Routes Protection"
RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" -X POST "$API_URL/achievements" \
    -H "Content-Type: application/json" \
    -d '{"name":"Test"}')

if [ "$RESPONSE" == "401" ] || [ "$RESPONSE" == "403" ]; then
    echo -e "${GREEN}✅ PASSED${NC} - Admin routes protected (got $RESPONSE)"
    ((PASSED++))
else
    echo -e "${RED}❌ FAILED${NC} - Admin routes not properly protected (got $RESPONSE)"
    echo "Remember to implement adminAuth middleware!"
    ((FAILED++))
fi
echo ""

# Summary
echo "========================================"
echo "🏁 Security Test Results"
echo "========================================"
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

TOTAL=$((PASSED + FAILED))
if [ $TOTAL -gt 0 ]; then
    SCORE=$((PASSED * 100 / TOTAL))
    echo "Security Score: $SCORE%"
    echo ""
    
    if [ $SCORE -ge 80 ]; then
        echo -e "${GREEN}🎉 Great! Your application has good security measures.${NC}"
    elif [ $SCORE -ge 60 ]; then
        echo -e "${YELLOW}⚠️  Acceptable, but improvements recommended.${NC}"
    else
        echo -e "${RED}⚠️  CRITICAL: Multiple security issues detected!${NC}"
    fi
fi

echo ""
echo "📚 For detailed security documentation, see:"
echo "   - SECURITY.md"
echo "   - SECURITY_FIXES.md"
echo "   - SECURITY_SUMMARY.md"
echo ""

# Exit with error if any tests failed
if [ $FAILED -gt 0 ]; then
    exit 1
else
    exit 0
fi
