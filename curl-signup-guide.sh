#!/bin/bash

# RideBuddy Signup API - cURL Testing Guide
# Complete guide with working examples

set -e

API_URL="http://localhost:5001"
FRONTEND_ORIGIN="http://localhost:5173"

# Generate unique test data
TIMESTAMP=$(date +%s)
TEST_EMAIL="testuser${TIMESTAMP}@example.com"
TEST_PHONE="9876543210"
TEST_PASSWORD="StrongPass@123"
TEST_NAME="Test User ${TIMESTAMP}"

echo "╔════════════════════════════════════════════════════════════════╗"
echo "║        RideBuddy Signup API - cURL Testing Guide               ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo ""

# ============================================================================
# EXAMPLE 1: BASIC SIGNUP REQUEST (Recommended for testing)
# ============================================================================
echo "═══════════════════════════════════════════════════════════════════════"
echo "EXAMPLE 1: Basic Signup Request (Minimal Fields)"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "📋 cURL Command:"
echo "─────────────────────────────────────────────────────────────────────"
cat << 'CURL1'
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "SecurePass123"
  }' | jq '.'
CURL1
echo ""

echo "📝 Request Body (JSON):"
echo "─────────────────────────────────────────────────────────────────────"
cat << 'JSON1'
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "SecurePass123"
}
JSON1
echo ""

echo "🔍 Field Details:"
echo "─────────────────────────────────────────────────────────────────────"
cat << 'FIELDS1'
✓ name       Required | Type: string   | Min: 2 chars  | Max: 50 chars
✓ email      Required | Type: email    | Must be valid format | Unique
✓ password   Required | Type: string   | Min: 6 chars  | Max: 128 chars
⊘ phone      Optional | Type: string   | Exactly: 10 digits (if provided)
FIELDS1
echo ""

# ============================================================================
# EXAMPLE 2: COMPLETE SIGNUP REQUEST (With all fields)
# ============================================================================
echo "═══════════════════════════════════════════════════════════════════════"
echo "EXAMPLE 2: Complete Signup Request (All Fields)"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "📋 cURL Command:"
echo "─────────────────────────────────────────────────────────────────────"
cat << 'CURL2'
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "name": "Jane Smith",
    "email": "janesmith@example.com",
    "phone": "9876543210",
    "password": "SecurePass@123"
  }' | jq '.'
CURL2
echo ""

echo "📝 Request Body (JSON):"
echo "─────────────────────────────────────────────────────────────────────"
cat << 'JSON2'
{
  "name": "Jane Smith",
  "email": "janesmith@example.com",
  "phone": "9876543210",
  "password": "SecurePass@123"
}
JSON2
echo ""

# ============================================================================
# EXAMPLE 3: DYNAMIC TEST (With timestamp for unique email)
# ============================================================================
echo "═══════════════════════════════════════════════════════════════════════"
echo "EXAMPLE 3: Dynamic Test (Guaranteed Unique Email)"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "📋 cURL Command (Copy & Paste Ready):"
echo "─────────────────────────────────────────────────────────────────────"
cat << EOF
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "name": "Test User $(date +%s)",
    "email": "testuser$(date +%s)@example.com",
    "phone": "9876543210",
    "password": "TestPass@123"
  }' | jq '.'
EOF
echo ""

# ============================================================================
# EXAMPLE 4: RUN ACTUAL TEST
# ============================================================================
echo "═══════════════════════════════════════════════════════════════════════"
echo "EXAMPLE 4: Running Actual Test"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""
echo "🔄 Testing signup with dynamic email: $TEST_EMAIL"
echo ""

RESPONSE=$(curl -s -X POST "$API_URL/api/auth/signup" \
  -H "Content-Type: application/json" \
  -H "Origin: $FRONTEND_ORIGIN" \
  -d "{
    \"name\": \"$TEST_NAME\",
    \"email\": \"$TEST_EMAIL\",
    \"phone\": \"$TEST_PHONE\",
    \"password\": \"$TEST_PASSWORD\"
  }")

echo "✅ Response:"
echo "─────────────────────────────────────────────────────────────────────"
echo "$RESPONSE" | jq '.'
echo ""

# ============================================================================
# EXPECTED RESPONSES
# ============================================================================
echo "═══════════════════════════════════════════════════════════════════════"
echo "EXPECTED RESPONSES"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

echo "✅ SUCCESS RESPONSE (201 Created):"
echo "─────────────────────────────────────────────────────────────────────"
cat << 'SUCCESS'
{
  "success": true,
  "message": "Signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWM3OWEz...",
  "user": {
    "_id": "69c79a355418509fb18f0067",
    "name": "Test User",
    "email": "testuser@example.com",
    "phone": "9876543210",
    "profilePhoto": "",
    "rating": {
      "sum": 0,
      "count": 0
    },
    "createdAt": "2026-03-28T09:07:01.147Z",
    "updatedAt": "2026-03-28T09:07:01.147Z",
    "averageRating": 0,
    "id": "69c79a355418509fb18f0067"
  }
}
SUCCESS
echo ""

echo "❌ VALIDATION ERROR (400 Bad Request):"
echo "─────────────────────────────────────────────────────────────────────"
cat << 'ERROR400'
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": "Valid email is required",
    "name": "\"name\" is required"
  }
}
ERROR400
echo ""

echo "❌ DUPLICATE EMAIL ERROR (400 Bad Request):"
echo "─────────────────────────────────────────────────────────────────────"
cat << 'ERROR409'
{
  "success": false,
  "message": "User with this email or phone already exists"
}
ERROR409
echo ""

echo "❌ SERVER ERROR (500 Internal Server Error):"
echo "─────────────────────────────────────────────────────────────────────"
cat << 'ERROR500'
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
ERROR500
echo ""

# ============================================================================
# VALIDATION RULES
# ============================================================================
echo "═══════════════════════════════════════════════════════════════════════"
echo "VALIDATION RULES"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

cat << 'VALIDATION'
Field: name
  ✓ Required: YES
  ✓ Type: String
  ✓ Min Length: 2 characters
  ✓ Max Length: 50 characters
  ✗ Invalid: "" (empty), "a" (too short), "x" * 51 (too long)
  ✓ Valid: "John Doe", "Jane Smith", "Alex"

Field: email
  ✓ Required: YES
  ✓ Type: String (valid email format)
  ✓ Unique: MUST NOT exist in database
  ✓ Case-insensitive: "Test@Example.com" = "test@example.com"
  ✗ Invalid: "not-an-email", "test@", "@example.com"
  ✓ Valid: "john@example.com", "jane.doe@test.co.uk"

Field: password
  ✓ Required: YES
  ✓ Type: String
  ✓ Min Length: 6 characters
  ✓ Max Length: 128 characters
  ✗ Invalid: "123", "pass", "password"
  ✓ Valid: "SecurePass123", "MyP@ssw0rd", "Test@123"

Field: phone
  ✓ Required: NO (Optional)
  ✓ Type: String (if provided)
  ✓ Length: EXACTLY 10 digits
  ✗ Invalid: "12345", "123456789" (too short), "12345678901" (too long), "abcd1234ef"
  ✓ Valid: "9876543210", "1234567890"

VALIDATION
echo ""

# ============================================================================
# CURL REFERENCE
# ============================================================================
echo "═══════════════════════════════════════════════════════════════════════"
echo "CURL REFERENCE - COMMON OPTIONS"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

cat << 'CURLREF'
# Basic signup (minimal fields)
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123"}'

# With jq formatting (pretty print)
curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '...' | jq '.'

# Show response headers
curl -i -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '...'

# Show request and response headers (verbose)
curl -v -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '...'

# Save response to file
curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '...' > response.json

# With custom origin
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '...'

# Test multiple times (loop)
for i in {1..3}; do
  curl -s -X POST http://localhost:5001/api/auth/signup \
    -H "Content-Type: application/json" \
    -d "{\"name\":\"Test$i\",\"email\":\"test$i@example.com\",\"password\":\"Pass123\"}" | jq '.success'
done

CURLREF
echo ""

# ============================================================================
# QUICK TEST COMMANDS
# ============================================================================
echo "═══════════════════════════════════════════════════════════════════════"
echo "QUICK TEST COMMANDS (Ready to Copy & Paste)"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

echo "1️⃣  Test with minimum fields:"
echo "───────────────────────────────────────────────────────────────────"
echo 'curl -s -X POST http://localhost:5001/api/auth/signup -H "Content-Type: application/json" -d "{\"name\":\"John\",\"email\":\"john'$(date +%s)'@test.com\",\"password\":\"Pass123\"}" | jq'
echo ""

echo "2️⃣  Test with all fields:"
echo "───────────────────────────────────────────────────────────────────"
echo 'curl -s -X POST http://localhost:5001/api/auth/signup -H "Content-Type: application/json" -d "{\"name\":\"John Doe\",\"email\":\"john'$(date +%s)'@test.com\",\"phone\":\"9876543210\",\"password\":\"StrongPass@123\"}" | jq'
echo ""

echo "3️⃣  Test validation error (missing name):"
echo "───────────────────────────────────────────────────────────────────"
echo 'curl -s -X POST http://localhost:5001/api/auth/signup -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"Pass123\"}" | jq'
echo ""

echo "4️⃣  Test duplicate email error:"
echo "───────────────────────────────────────────────────────────────────"
echo 'curl -s -X POST http://localhost:5001/api/auth/signup -H "Content-Type: application/json" -d "{\"name\":\"John\",\"email\":\"existing@test.com\",\"password\":\"Pass123\"}" | jq'
echo ""

# ============================================================================
# SUMMARY
# ============================================================================
echo "═══════════════════════════════════════════════════════════════════════"
echo "SUMMARY"
echo "═══════════════════════════════════════════════════════════════════════"
echo ""

cat << 'SUMMARY'
✅ Endpoint:        POST /api/auth/signup
✅ Base URL:        http://localhost:5001
✅ Full URL:        http://localhost:5001/api/auth/signup
✅ Content-Type:    application/json
✅ Origin Header:   http://localhost:5173 (or localhost:5174 for dev)

📋 Required Fields:
   • name     (string, 2-50 chars)
   • email    (valid email, unique)
   • password (string, 6-128 chars)

📋 Optional Fields:
   • phone    (string, exactly 10 digits)

📊 Response Codes:
   • 201      Success (user created, token returned)
   • 400      Validation error or duplicate email
   • 500      Server error

💡 Pro Tips:
   1. Use $(date +%s) to generate unique emails
   2. Always use valid email format
   3. Password should be 6+ characters
   4. Phone must be exactly 10 digits (if provided)
   5. Email is case-insensitive but must be unique
   6. Use jq to pretty-print JSON responses

SUMMARY
echo ""
echo "╚════════════════════════════════════════════════════════════════╝"

