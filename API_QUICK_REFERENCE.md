# RideBuddy API - Quick Reference Guide

## Base URL
```
http://localhost:5001/api
```

## Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

---

## Authentication Endpoints

### Register/Signup
**POST** `/auth/register` or `/auth/signup`
- **Validation**: Name (2-50), Email (required), Password (6+ chars), Phone (optional)
- **Response**: User object + JWT token

```bash
curl -X POST http://localhost:5001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "securepass123"}'
```

### Login
**POST** `/auth/login`
- **Validation**: Email (required), Password (required)
- **Response**: User object + JWT token

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "securepass123"}'
```

### Logout
**POST** `/auth/logout` (Protected)
- **Response**: Success message

---

## Ride Endpoints

### List Rides (with Pagination & Filters)
**GET** `/rides?page=1&limit=10&from=Patna&to=Delhi&vehicle=Car&date=2026-04-15`

**Query Parameters** (all optional):
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 50)
- `from`: Origin city (case-insensitive)
- `to`: Destination city (case-insensitive)
- `vehicle`: Bike or Car
- `date`: ISO date format (YYYY-MM-DD)

**Response**:
```json
{
  "success": true,
  "rides": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 42,
    "pages": 5
  }
}
```

### Create Ride (Protected)
**POST** `/rides`

**Request Body**:
- `from`: Location (2+ chars, required)
- `to`: Location (2+ chars, required)
- `date`: ISO date (required)
- `seats`: 1-6 (required)
- `time`: HH:MM format (optional, defaults to 09:00)
- `vehicle`: Bike or Car (optional, defaults to Car)
- `notes`: Max 300 chars (optional)

**Response**: Created ride object

```bash
curl -X POST http://localhost:5001/api/rides \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "from": "Patna",
    "to": "Delhi",
    "date": "2026-04-15",
    "seats": 4,
    "vehicle": "Car"
  }'
```

### Get Ride By ID
**GET** `/rides/:id`

**Response**: Ride object with creator details

```bash
curl http://localhost:5001/api/rides/69c70376bff975aa645e50e2
```

### Join Ride (Protected)
**POST** `/rides/:id/join`

**Response**: Updated ride with passenger added

```bash
curl -X POST http://localhost:5001/api/rides/69c70376bff975aa645e50e2/join \
  -H "Authorization: Bearer $TOKEN"
```

### Get My Posted Rides (Protected)
**GET** `/rides/mine/posted`

**Response**: Array of rides created by current user

### Get My Joined Rides (Protected)
**GET** `/rides/mine/joined`

**Response**: Array of rides user has joined

### Update Join Request Status (Protected)
**PATCH** `/rides/interests/:interestId`

**Request Body**:
- `status`: "accepted" or "rejected"

---

## User Endpoints

### Get My Profile (Protected)
**GET** `/users/profile` or `/users/me`

**Response**: Full user profile with rides posted and joined

### Update Profile Photo (Protected)
**PATCH** `/users/me/photo`

**Request Body**:
- `profilePhoto`: Valid image URL (optional)

### Rate User (Protected)
**POST** `/users/:id/rate`

**Request Body**:
- `rating`: 1-5 (required)

```bash
curl -X POST http://localhost:5001/api/users/69c70350bff975aa645e50db/rate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{"rating": 5}'
```

---

## Health Check

### Server Status
**GET** `/health`

**Response**: 
```json
{
  "success": true,
  "message": "RideBuddy API is live"
}
```

---

## Error Responses

All errors follow this format:
```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": {
    "email": "\"email\" must be a valid email",
    "password": "\"password\" length must be at least 6 characters long"
  }
}
```

### Common HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation error)
- `401`: Unauthorized (invalid/missing token)
- `404`: Not Found
- `429`: Too Many Requests (rate limited)
- `500`: Server Error

---

## Rate Limiting

- **General**: 100 requests per 15 minutes per IP
- **Auth endpoints**: 10 requests per 15 minutes (stricter)
- **Response header**: `RateLimit-Limit`, `RateLimit-Remaining`

---

## Token Example

JWT tokens are valid for 7 days. Include in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2OWM3MDM1MGJmZjk3NWFhNjQ1ZTUwZGIiLCJpYXQiOjE3NzQ2NTAwMjEsImV4cCI6MTc3NTI1NDgyMX0.xxxx
```

---

## Environment Variables (Development)

```bash
# Optional - set to override defaults
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/ridebuddy
CLIENT_URL=http://localhost:5173
JWT_SECRET=your_jwt_secret_key
```

---

## Development Commands

```bash
# Install dependencies
npm install

# Start server (with nodemon hot reload)
npm start

# Start in production mode
NODE_ENV=production npm start
```

---

## Features Implemented

✅ **Validation**: Joi schema validation on all endpoints
✅ **Security**: Helmet headers + rate limiting
✅ **Logging**: Winston structured logging
✅ **Error Handling**: Centralized error handler with detailed messages
✅ **Pagination**: Fully implemented with total count
✅ **Database**: Optimized indexes for fast queries
✅ **Graceful Shutdown**: SIGTERM/SIGINT handlers
✅ **Authentication**: JWT with 7-day expiry
✅ **Authorization**: Protected routes with auth middleware

---

## Next Steps

1. **Frontend Integration**: Connect React client to these endpoints
2. **Testing**: Add comprehensive test suite
3. **Documentation**: Swagger/OpenAPI docs
4. **Monitoring**: Add APM and error tracking
5. **CI/CD**: Setup automated testing and deployment
