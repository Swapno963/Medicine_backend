Register a User:
POST /api/auth/register
Body: { "username": "testuser", "email": "swapno@gmail.com", "password": "password123" }

Login:
POST /api/auth/login
Body: { "username": "testuser", "password": "password123" }

Refresh Token:
POST /api/auth/refresh-token
Body: { "token": "your_refresh_token" }"

Verify Email:
POST /api/auth/erify-email
