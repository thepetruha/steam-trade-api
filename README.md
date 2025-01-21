
# Documentation for Steam Trade API

## Overview

`steam-trade-api` is a robust platform designed for automating trades on the Steam marketplace. It combines several key technologies to provide a seamless experience, including **Redis** for caching, **PostgreSQL** for database management, and a **Node.js-based API** for the backend logic.

---

## Features

- 🚀 **Dockerized Setup**: Simplified deployment with `docker-compose`.
- 🛠️ **Scalable Architecture**: Built to handle high loads using Redis caching and PostgreSQL for reliable storage.
- 🔄 **Makefile Support**: Automates setup, build, and development tasks.
- 📦 **Modular Codebase**: Organized structure with separate directories for handlers, routes, and utilities.

---

## Prerequisites

Before getting started, ensure you have the following installed:

- **Docker** (latest version)
- **Node.js** (version 18 or higher)
- **Make** (optional, but recommended for easier management)

---

## Project Structure

```plaintext
├── dist/                          # Compiled files
├── media/                         # Media files
├── node_modules/                  # Node.js dependencies
├── src/                           # Source code
│   ├── configs/                   # Configuration files
│   ├── handlers/                  # Request handlers
│   ├── middleware/                # Express middleware
│   ├── migrations/                # Database migrations
│   ├── redis/                     # Redis-related logic
│   ├── routes/                    # API routes
│   ├── store/                     # Database stores
│   ├── utils/                     # Utility functions
│   └── main.ts                    # Entry point
├── .dockerignore                  # Docker ignore file
├── docker-compose.yaml            # Docker Compose configuration
├── Dockerfile                     # Dockerfile for Node.js app
├── Makefile                       # Automates commands
├── tsconfig.json                  # TypeScript configuration
└── package.json                   # Node.js dependencies and scripts
```

---

## Setup Instructions

### 1. Development Setup

To set up the project for development:

```bash
make full_setup_dev
```

This will:

- Build and start all services (Redis, PostgreSQL, and the Node.js app).
- Use the development environment variables from `.env.development`.

**Expected output**:

```plaintext
[+] Running 5/5
 ✔ Network steam-trade-api_default         Created
 ✔ Volume "steam-trade-api_postgres_data"  Created
 ✔ Container postgres_container            Started
 ✔ Container redis_container               Started
 ✔ Container node_app_container            Started
```

![alt text](https://github.com/thepetruha/steam-trade-api/blob/main/screenshorts/postman.png?raw=true)

---

### 2. Production Setup

For production deployment:

```bash
make full_setup_prod
```

This will build and start the services with production configurations from `.env.production`.

---

### 3. Reset Services

To completely reset and recreate the services:

- **Development**:

```bash
make resetup_dev
```

- **Production**:

```bash
make resetup_prod
```

---

## Running in Local Environment

For local development without Docker:

1. **Install dependencies**:

   ```bash
   npm install
   ```

2. **Start the development server**:

   ```bash
   make dev
   ```

---

## API Endpoints

The project generates API documentation automatically for use with Postman. After setup:

1. **Generated Postman Collection**:
   - **Path**: `postman_api.json`
   - **Base URL**: `http://localhost:${HTTP_SERVER_PORT}`

![alt text](https://github.com/thepetruha/steam-trade-api/blob/main/screenshorts/postman.png?raw=true)

---

## Migration Module

To illustrate the migration structure, here is an example diagram:

![Migrations](https://github.com/thepetruha/steam-trade-api/blob/main/screenshorts/migrations?raw=true)

### Description

The migration module includes:
- SQL scripts for creating and updating database tables.
- Tools to automatically execute migrations during application build or startup.

### Usage

1. **Location:** All migrations are stored in the `src/migrations` folder.
2. **Execution Command:** Migrations are automatically copied to `dist/migrations` during the build process.

---

## Commands and Scripts

### Makefile Commands

- **Build and Run**:

  ```bash
  make full_setup_dev
  ```

- **Rebuild Services**:

  ```bash
  make resetup_dev
  ```

- **Push Changes to Git**:

  ```bash
  make push "Commit Message"
  ```

### NPM Scripts

- **Build Project**:

  ```bash
  npm run build
  ```

- **Start Development Server**:

  ```bash
  npm run dev
  ```

---

## Services and Configurations

### Redis

- **Image**: `redis:latest`
- **Ports**: Exposed as `${REDIS_PORT}`.
- **Environment Variables**:
  - `REDIS_USER`
  - `REDIS_PASSWORD`

### PostgreSQL

- **Image**: `postgres:latest`
- **Ports**: Exposed as `${POSTGRES_PORT}`.
- **Environment Variables**:
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`

### Node.js Application

- **Ports**: Exposed as `${HTTP_SERVER_PORT}`.
- **Depends on**: Redis and PostgreSQL.

---

## Common Issues and Solutions

### **Invalid ELF Header**

This issue occurs when `bcrypt` is installed on macOS but run in a Linux environment. To fix:

1. **Remove bcrypt and install bcryptjs**:

   ```bash
   npm uninstall bcrypt
   npm install bcryptjs
   ```

2. **Update the Dockerfile** to replace `bcrypt` with `bcryptjs`.

---

## Additional Resources

- [Docker Documentation](https://www.docker.com/)
- [Node.js Documentation](https://nodejs.org/)
