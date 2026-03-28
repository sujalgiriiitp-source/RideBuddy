#!/bin/bash

# RideBuddy Auth Routes Test Script
# Tests CORS and auth endpoints for proper configuration

API_URL="http://localhost:5001"
ORIGIN="http://localhost:5173"

echo "================================"
echo "RideBuddy Auth Routes Diagnostic"
echo "================================\n"

# Test 1: Health check
echo "Test 1: Health Check"
echo "-------------------"
curl -s -X GET "$API_URL/api/health" \
  -H "Origin: $ORIGIN" | jq '.' 2>/dev/null || curl -s -X GET "$API_URL/api/health"
echo "\n"

# Test 2: Preflight OPTIONS request
echo "Test 2: Preflight OPTIONS Request"
echo "-----------------------------------"
curl -s -i -X OPTIONS "$API_URL/api/auth/login" \
  -H "Origin: $ORIGIN" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" | grep -E "HTTP|Access-Control"
echo "\n"

# Test 3: Register endpoint (will fail without valid data but should not be CORS blocked)
echo "Test 3: Register Endpoint - CORS Headers Check"
echo "----------------------------------------------"
curl -s -i -X POST "$API_URL/api/auth/register" \
  -H "Content-Type: application/json" \
  -H "Origin: $ORIGIN" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}' \
  | grep -E "HTTP|Access-Control|Content-Type" | head -10
echo "\n"

# Test 4: Login endpoint
echo "Test 4: Login Endpoint - CORS Headers Check"
echo "-------------------------------------------"
curl -s -i -X POST "$API_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -H "Origin: $ORIGIN" \
  -d '{"email":"test@test.com","password":"password123"}' \
  | grep -E "HTTP|Access-Control|Content-Type" | head -10
echo "\n"

# Test 5: Production origin
echo "Test 5: Production Origin (Vercel) - CORS Check"
echo "-----------------------------------------------"
curl -s -i -X OPTIONS "$API_URL/api/auth/login" \
  -H "Origin: https://ride-buddy-liart.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" \
  | grep -E "HTTP|Access-Control|Access-Control-Allow-Origin"
echo "\n"

# Test 6: Rejected origin
echo "Test 6: Rejected Origin (Invalid) - Should Fail"
echo "-----------------------------------------------"
curl -s -i -X OPTIONS "$API_URL/api/auth/login" \
  -H "Origin: https://malicious-site.com" \
  -H "Access-Control-Request-Method: POST" \
  | grep -E "HTTP|Access-Control|Access-Control-Allow-Origin"
echo "\n"

echo "================================"
echo "Diagnostic Complete!"
echo "================================"
echo ""
echo "✅ All tests passed = Auth routes are properly exposed"
echo "❌ Any CORS errors = Check middleware configuration"
