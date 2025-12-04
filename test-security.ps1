# Security Testing Script for NMBS Gamification Platform (PowerShell)
# This script performs automated security checks

Write-Host "🔒 NMBS Gamify - Security Testing Suite" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

$API_URL = "http://localhost:5000/api"
$PASSED = 0
$FAILED = 0

# Test 1: Environment Variables
Write-Host "📋 Test 1: Environment Variables Validation"
if (-Not (Test-Path ".env")) {
    Write-Host "❌ FAILED - .env file not found" -ForegroundColor Red
    $FAILED++
} else {
    $envContent = Get-Content ".env" -Raw
    if ($envContent -match "your_super_secret") {
        Write-Host "⚠️  WARNING - Default JWT_SECRET detected" -ForegroundColor Yellow
        $FAILED++
    } else {
        Write-Host "✅ PASSED - Custom JWT_SECRET configured" -ForegroundColor Green
        $PASSED++
    }
}
Write-Host ""

# Test 2: Rate Limiting on Auth Endpoints
Write-Host "📋 Test 2: Rate Limiting (Auth Endpoints)"
Write-Host "Making 6 consecutive login attempts..."

$RATE_LIMIT_TRIGGERED = $false
$body = @{
    email = "test@example.com"
    password = "wrongpassword"
} | ConvertTo-Json

for ($i = 1; $i -le 6; $i++) {
    try {
        $response = Invoke-WebRequest -Uri "$API_URL/auth/login" `
            -Method POST `
            -ContentType "application/json" `
            -Body $body `
            -UseBasicParsing `
            -ErrorAction SilentlyContinue
        
        if ($response.StatusCode -eq 429) {
            $RATE_LIMIT_TRIGGERED = $true
            break
        }
    } catch {
        if ($_.Exception.Response.StatusCode.value__ -eq 429) {
            $RATE_LIMIT_TRIGGERED = $true
            break
        }
    }
    Start-Sleep -Seconds 1
}

if ($RATE_LIMIT_TRIGGERED) {
    Write-Host "✅ PASSED - Rate limiting is working (got 429 status)" -ForegroundColor Green
    $PASSED++
} else {
    Write-Host "❌ FAILED - Rate limiting not working (never got 429)" -ForegroundColor Red
    $FAILED++
}
Write-Host ""

# Test 3: Unauthorized Access Protection
Write-Host "📋 Test 3: Unauthorized Access Protection"
try {
    $response = Invoke-WebRequest -Uri "$API_URL/users/me" `
        -Method GET `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "❌ FAILED - Protected route accessible without token (got $($response.StatusCode))" -ForegroundColor Red
    $FAILED++
} catch {
    if ($_.Exception.Response.StatusCode.value__ -eq 401) {
        Write-Host "✅ PASSED - Protected routes return 401 without token" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "⚠️  WARNING - Unexpected status code: $($_.Exception.Response.StatusCode.value__)" -ForegroundColor Yellow
        $FAILED++
    }
}
Write-Host ""

# Test 4: CORS Headers
Write-Host "📋 Test 4: CORS Configuration"
try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/login" -Method OPTIONS -UseBasicParsing
    $corsHeader = $response.Headers["Access-Control-Allow-Origin"]
    
    if ($corsHeader) {
        Write-Host "✅ PASSED - CORS headers present: $corsHeader" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "⚠️  WARNING - No CORS headers detected" -ForegroundColor Yellow
        $FAILED++
    }
} catch {
    Write-Host "⚠️  WARNING - Could not check CORS headers" -ForegroundColor Yellow
    $FAILED++
}
Write-Host ""

# Test 5: Security Headers (Helmet)
Write-Host "📋 Test 5: Security Headers (Helmet.js)"
try {
    $response = Invoke-WebRequest -Uri "$API_URL/auth/login" -Method GET -UseBasicParsing -ErrorAction SilentlyContinue
    
    $securityHeaders = @()
    if ($response.Headers["X-Content-Type-Options"]) { $securityHeaders += "X-Content-Type-Options" }
    if ($response.Headers["X-Frame-Options"]) { $securityHeaders += "X-Frame-Options" }
    if ($response.Headers["X-XSS-Protection"]) { $securityHeaders += "X-XSS-Protection" }
    
    if ($securityHeaders.Count -gt 0) {
        Write-Host "✅ PASSED - Security headers present: $($securityHeaders -join ', ')" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "❌ FAILED - Security headers missing" -ForegroundColor Red
        $FAILED++
    }
} catch {
    Write-Host "⚠️  WARNING - Could not check security headers" -ForegroundColor Yellow
}
Write-Host ""

# Test 6: NPM Audit
Write-Host "📋 Test 6: NPM Security Audit"
Write-Host "Running npm audit..."
$auditOutput = npm audit --json 2>$null | ConvertFrom-Json

if ($auditOutput.metadata.vulnerabilities) {
    $totalVulns = $auditOutput.metadata.vulnerabilities.critical + 
                  $auditOutput.metadata.vulnerabilities.high + 
                  $auditOutput.metadata.vulnerabilities.moderate + 
                  $auditOutput.metadata.vulnerabilities.low
    
    if ($totalVulns -eq 0) {
        Write-Host "✅ PASSED - No vulnerabilities found" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "⚠️  WARNING - Found $totalVulns vulnerabilities" -ForegroundColor Yellow
        Write-Host "Run 'npm audit' for details"
        $FAILED++
    }
} else {
    Write-Host "⚠️  Could not parse npm audit results" -ForegroundColor Yellow
}
Write-Host ""

# Test 7: Admin Routes Protection
Write-Host "📋 Test 7: Admin Routes Protection"
$body = @{
    name = "Test Achievement"
} | ConvertTo-Json

try {
    $response = Invoke-WebRequest -Uri "$API_URL/achievements" `
        -Method POST `
        -ContentType "application/json" `
        -Body $body `
        -UseBasicParsing `
        -ErrorAction Stop
    
    Write-Host "❌ FAILED - Admin routes not properly protected (got $($response.StatusCode))" -ForegroundColor Red
    Write-Host "Remember to implement adminAuth middleware!" -ForegroundColor Yellow
    $FAILED++
} catch {
    $statusCode = $_.Exception.Response.StatusCode.value__
    if ($statusCode -eq 401 -or $statusCode -eq 403) {
        Write-Host "✅ PASSED - Admin routes protected (got $statusCode)" -ForegroundColor Green
        $PASSED++
    } else {
        Write-Host "⚠️  WARNING - Unexpected response: $statusCode" -ForegroundColor Yellow
        $FAILED++
    }
}
Write-Host ""

# Summary
Write-Host "========================================"
Write-Host "🏁 Security Test Results"
Write-Host "========================================"
Write-Host "Passed: $PASSED" -ForegroundColor Green
Write-Host "Failed: $FAILED" -ForegroundColor Red
Write-Host ""

$TOTAL = $PASSED + $FAILED
if ($TOTAL -gt 0) {
    $SCORE = [math]::Round(($PASSED * 100) / $TOTAL)
    Write-Host "Security Score: $SCORE%"
    Write-Host ""
    
    if ($SCORE -ge 80) {
        Write-Host "🎉 Great! Your application has good security measures." -ForegroundColor Green
    } elseif ($SCORE -ge 60) {
        Write-Host "⚠️  Acceptable, but improvements recommended." -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  CRITICAL: Multiple security issues detected!" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "📚 For detailed security documentation, see:"
Write-Host "   - SECURITY.md"
Write-Host "   - SECURITY_FIXES.md"
Write-Host "   - SECURITY_SUMMARY.md"
Write-Host ""

# Exit with error if any tests failed
if ($FAILED -gt 0) {
    exit 1
} else {
    exit 0
}
