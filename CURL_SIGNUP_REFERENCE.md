# Signup API cURL Commands - Quick Reference

## ✅ Simple Working Command

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -H "Origin: http://localhost:5173" \
  -d '{
    "name": "John Doe",
    "email": "johndoe@example.com",
    "password": "SecurePass123"
  }' | jq '.'
```

---

## 📋 Request Details

### Endpoint
- **Method:** `POST`
- **URL:** `http://localhost:5001/api/auth/signup`
- **Content-Type:** `application/json`

### Headers Required
```
Content-Type: application/json
Origin: http://localhost:5173
```

### Request Body (JSON)
```json
{
  "name": "John Doe",
  "email": "johndoe@example.com",
  "password": "SecurePass123",
  "phone": "9876543210"  // Optional
}
```

---

## 📊 Field Validation Rules

| Field | Required | Type | Min | Max | Notes |
|-------|----------|------|-----|-----|-------|
| name | Yes | string | 2 | 50 | Alphanumeric + spaces |
| email | Yes | email | - | - | Must be unique, valid format |
| password | Yes | string | 6 | 128 | Can include special chars |
| phone | No | string | 10 | 10 | Exactly 10 digits (if provided) |

---

## ✅ Success Response (201 Created)

```json
{
  "success": true,
  "message": "Signup successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "69c79a355418509fb18f0067",
    "name": "John Doe",
    "email": "johndoe@example.com",
    "phone": "9876543210",
    "profilePhoto": "",
    "rating": { "sum": 0, "count": 0 },
    "createdAt": "2026-03-28T09:07:01.147Z",
    "updatedAt": "2026-03-28T09:07:01.147Z",
    "averageRating": 0
  }
}
```

---

## ❌ Error Responses

### Validation Error (400 Bad Request)
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "name": "\"name\" is required",
    "email": "Valid email is required"
  }
}
```

### Duplicate Email (400 Bad Request)
```json
{
  "success": false,
  "message": "User with this email or phone already exists"
}
```

### Server Error (500)
```json
{
  "success": false,
  "statusCode": 500,
  "message": "Internal Server Error"
}
```

---

## 🚀 One-Liners (Copy & Paste Ready)

### 1. Minimal Fields
```bash
curl -s -X POST http://localhost:5001/api/auth/signup -H "Content-Type: application/json" -d '{"name":"John","email":"john@test.com","password":"Pass123"}' | jq
```

### 2. All Fields
```bash
curl -s -X POST http://localhost:5001/api/auth/signup -H "Content-Type: application/json" -d '{"name":"John Doe","email":"john@test.com","phone":"9876543210","password":"StrongPass@123"}' | jq
```

### 3. Unique Email (Timestamp)
```bash
curl -s -X POST http://localhost:5001/api/auth/signup -H "Content-Type: application/json" -d "{\"name\":\"Test User\",\"email\":\"test$(date +%s)@example.com\",\"password\":\"Pass123\"}" | jq
```

### 4. With Verbose Output
```bash
curl -v -X POST http://localhost:5001/api/auth/signup -H "Content-Type: application/json" -d '{"name":"John","email":"john@test.com","password":"Pass123"}'
```

### 5. Show Headers Only
```bash
curl -i -X POST http://localhost:5001/api/auth/signup -H "Content-Type: application/json" -d '{"name":"John","email":"john@test.com","password":"Pass123"}'
```

---

## 🔍 How to Test

### Step 1: Basic Test
```bash
curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "password": "Test@123"
  }' | jq '.'
```

### Step 2: With All Fields
```bash
curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "9876543210",
    "password": "Test@123"
  }' | jq '.'
```

### Step 3: Test Validation (Missing Field)
```bash
curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test@123"
  }' | jq '.'
```

Expected: `"Validation failed"` with `"name" is required`

### Step 4: Test Duplicate Email
```bash
# First signup
curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123"}' | jq '.token'

# Try same email again
curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123"}' | jq '.'
```

Expected: `"User with this email or phone already exists"`

---

## 💡 Pro Tips

1. **Always use unique email** - Use timestamp or incrementing number:
   ```bash
   email: "user$(date +%s)@example.com"
   ```

2. **Pretty print JSON** - Use `jq` after curl:
   ```bash
   curl -s ... | jq '.'
   ```

3. **Extract specific fields**:
   ```bash
   curl -s ... | jq '.token'        # Just token
   curl -s ... | jq '.user.email'   # Just email
   curl -s ... | jq '.message'      # Just message
   ```

4. **Check status code**:
   ```bash
   curl -s -w "\nStatus: %{http_code}\n" -X POST ...
   ```

5. **Save to file**:
   ```bash
   curl -s ... > response.json
   ```

6. **Test in loop**:
   ```bash
   for i in {1..5}; do
     curl -s -X POST http://localhost:5001/api/auth/signup \
       -H "Content-Type: application/json" \
       -d "{\"name\":\"User$i\",\"email\":\"user$i@test.com\",\"password\":\"Pass123\"}" | jq '.success'
   done
   ```

---

## 🐛 Debugging

### See Full Request & Response Headers
```bash
curl -v -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123"}'
```

### Show Response Headers Only
```bash
curl -i -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123"}'
```

### Check Response Status Code
```bash
curl -s -o /dev/null -w "%{http_code}" -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123"}'
```

### Save Response to File
```bash
curl -s -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"John","email":"john@test.com","password":"Pass123"}' > signup_response.json

cat signup_response.json | jq '.'
```

---

## ✨ Complete Example Flow

```bash
#!/bin/bash

API_URL="http://localhost:5001/api/auth/signup"
EMAIL="user$(date +%s)@example.com"

# Signup
echo "Creating account..."
RESPONSE=$(curl -s -X POST "$API_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"name\": \"John Doe\",
    \"email\": \"$EMAIL\",
    \"phone\": \"9876543210\",
    \"password\": \"StrongPass@123\"
  }")

echo "Response:"
echo "$RESPONSE" | jq '.'

# Extract token
TOKEN=$(echo "$RESPONSE" | jq -r '.token')
echo ""
echo "Token: $TOKEN"

# Use token for authenticated requests
echo ""
echo "Using token for authenticated request..."
curl -s -X GET http://localhost:5001/api/users/me \
  -H "Authorization: Bearer $TOKEN" | jq '.'
```

---

*Last Updated: March 28, 2026*
*Backend: Running on localhost:5001*
*All tests verified ✅*
