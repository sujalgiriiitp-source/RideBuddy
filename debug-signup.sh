#!/bin/bash

# RideBuddy Signup API Debug Script
# Tests signup API from frontend perspective

echo "================================"
echo "RideBuddy Signup API Debug"
echo "================================\n"

API_URL="http://localhost:5001"
FRONTEND_ORIGIN="http://localhost:5174"
UNIQUE_EMAIL="debugsignup$(date +%s)@test.com"

echo "Test Environment:"
echo "- Backend URL: $API_URL"
echo "- Frontend Origin: $FRONTEND_ORIGIN"
echo "- Test Email: $UNIQUE_EMAIL"
echo ""

# Test 1: Check health
echo "Test 1: Backend Health Check"
echo "----------------------------"
HEALTH=$(curl -s "$API_URL/api/health")
if echo "$HEALTH" | jq -e '.success' > /dev/null 2>&1; then
  echo "✅ Backend is running"
  echo "$HEALTH" | jq '.'
else
  echo "❌ Backend is NOT responding"
  exit 1
fi
echo ""

# Test 2: Test CORS preflight
echo "Test 2: CORS Preflight (OPTIONS)"
echo "--------------------------------"
PREFLIGHT=$(curl -s -i -X OPTIONS "$API_URL/api/auth/signup" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type, Authorization" 2>&1 | grep -E "HTTP|Access-Control")

if echo "$PREFLIGHT" | grep -q "Access-Control-Allow-Origin"; then
  echo "✅ CORS preflight successful"
  echo "$PREFLIGHT"
else
  echo "❌ CORS preflight failed"
  echo "$PREFLIGHT"
fi
echo ""

# Test 3: Test signup with all response headers
echo "Test 3: Signup Request - Full Response"
echo "-------------------------------------"
SIGNUP_RESPONSE=$(curl -s -i -X POST "$API_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -d "{
    \"name\": \"Debug Test User\",
    \"email\": \"$UNIQUE_EMAIL\",
    \"password\": \"password123\"
  }" 2>&1)

echo "$SIGNUP_RESPONSE" | head -20
echo ""

# Extract and parse JSON body
SIGNUP_JSON=$(echo "$SIGNUP_RESPONSE" | tail -1)
echo "Response Body:"
echo "$SIGNUP_JSON" | jq '.' 2>/dev/null || echo "$SIGNUP_JSON"
echo ""

# Test 4: Validation errors
echo "Test 4: Validation Errors - Missing Fields"
echo "----------------------------------------"
VALIDATION_TEST=$(curl -s -X POST "$API_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -d '{
    "email": "test@example.com"
  }')

echo "Response:"
echo "$VALIDATION_TEST" | jq '.'
echo ""

# Test 5: Invalid email format
echo "Test 5: Validation - Invalid Email"
echo "-----------------------------------"
INVALID_EMAIL=$(curl -s -X POST "$API_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -d '{
    "name": "Test",
    "email": "invalid-email",
    "password": "password123"
  }')

echo "Response:"
echo "$INVALID_EMAIL" | jq '.'
echo ""

# Test 6: Check CORS headers in successful response
echo "Test 6: CORS Response Headers"
echo "-----------------------------"
CORS_HEADERS=$(curl -s -i -X POST "$API_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -d "{
    \"name\": \"CORS Test\",
    \"email\": \"corstest$(date +%s)@test.com\",
    \"password\": \"password123\"
  }" 2>&1 | grep -E "Access-Control|Content-Type|HTTP")

echo "$CORS_HEADERS"
echo ""

# Test 7: Test with different frontend origin
echo "Test 7: Vercel Production Origin"
echo "--------------------------------"
VERCEL_TEST=$(curl -s -i -X OPTIONS "$API_URL/api/auth/signup" \
  -H "Origin: https://ride-buddy-liart.vercel.app" \
  -H "Access-Control-Request-Method: POST" \
  -H "Access-Control-Request-Headers: Content-Type" 2>&1 | grep -E "HTTP|Access-Control-Allow-Origin")

if echo "$VERCEL_TEST" | grep -q "ride-buddy-liart.vercel.app"; then
  echo "✅ Vercel origin allowed"
  echo "$VERCEL_TEST"
else
  echo "⚠️ Vercel origin check:"
  echo "$VERCEL_TEST"
fi
echo ""

echo "================================"
echo "Debug Complete!"
echo "================================"
echo ""
echo "Summary:"
echo "- If Test 1 ✅: Backend is running"
echo "- If Test 2 ✅: CORS is configured correctly"
echo "- If Test 3 ✅: Signup API works from curl"
echo "- If Tests 4-5: Validation is working"
echo "- If Test 6 ✅: Response includes CORS headers"
echo ""
echo "If backend signup works but frontend fails:"
echo "1. Check browser console for error message"
echo "2. Check Network tab in DevTools for actual response"
echo "3. Verify VITE_API_URL environment variable is set"
echo "4. Check that withCredentials: true is set in Axios"
echo "5. Verify email is unique (not already registered)"
