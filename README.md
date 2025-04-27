# 🚀 Back-End Task

A NestJS-based backend project with MongoDB, JWT Authentication, Email Verification, Docker, and Swagger API Documentation.

---

## 📦 Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/BE_task.git
cd BE_task
```

### 2. Copy environment variables file

```bash
cp .env.sample .env
```

Edit `.env` to configure your MongoDB URI, Mail settings, JWT secret, etc.

### 3. Install dependencies

```bash
npm install
```

---

## 🐳 Run the project with Docker

> Make sure Docker and Docker Compose are installed.

### Development Mode

```bash
docker-compose -f docker-compose.dev.yml up --build
```

### Production Mode

```bash
docker-compose up --build
```

---

## 🧪 Running Tests

Run unit tests:

```bash
npm run test
```

Watch tests during development:

```bash
npm run test:watch
```

Generate test coverage report:

```bash
npm run test:cov
```

---

## 📚 API Documentation (Swagger)

Swagger UI is available at:

```
http://localhost:3000/api
```

- View all API endpoints
- Authorize requests using JWT tokens
- Test APIs directly from your browser

---

## 🛠️ Environment Variables Overview (.env)

| Variable | Description |
|:---------|:------------|
| `MONGO_URI` | MongoDB connection string |
| `MAIL_HOST` | SMTP server hostname |
| `MAIL_PORT` | SMTP server port |
| `MAIL_USER` | SMTP username |
| `MAIL_PASS` | SMTP password |
| `FRONTEND_URL` | Frontend URL for verification link |
| `JWT_SECRET` | Secret key for signing JWT tokens |

---

## 📦 Project Structure

```bash
src/
  auth/
    strategies/
      jwt.strategy.ts      # JWT Authentication strategy
  email/
    email.service.ts       # Email service (sending verification emails)
    email.service.spec.ts  # Unit tests for email service
  templates/
    verificationTemplate.ts # Email HTML template (TypeScript based)
  user/
    dto/
      login.dto.ts         # Login DTO for request validation
      signup.dto.ts        # Signup DTO for request validation
    schemas/
      user.schema.ts       # Mongoose schema for User
    user.controller.ts     # User routes (signup, login, profile)
    user.controller.spec.ts # User controller tests
    user.module.ts         # User feature module
    user.service.ts        # Business logic for User
    user.service.spec.ts   # User service unit tests
  app.module.ts            # Main application module
  main.ts                  # Application bootstrap
.env                        # Environment variables
.env.sample                 # Example env variables (setup template)
docker-compose.dev.yml      # Docker Compose for development
docker-compose.prod.yml     # Docker Compose for production
README.md                   # Project documentation
test/                       # Additional tests folder (optional)
```

---

## ✨ Tech Stack

- [NestJS](https://nestjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Mongoose](https://mongoosejs.com/)
- [Docker](https://www.docker.com/)
- [Swagger (OpenAPI)](https://swagger.io/)
- [Jest](https://jestjs.io/)

---

## ❤️ Contribution

Feel free to submit issues or pull requests. Let's build and improve together!

---

# 🔥 Happy coding!

