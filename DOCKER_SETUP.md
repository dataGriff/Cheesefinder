# Cheesefinder - Docker Setup

This document explains how to run the Cheesefinder application using Docker for local development.

## Prerequisites

- Docker Desktop or Docker Engine
- Docker Compose

## Quick Start

### Development Mode

1. **Clone and setup**:
   ```bash
   # Copy environment variables
   cp .env.example .env
   
   # Build and start services
   docker-compose up --build
   ```

2. **Initialize the database**:
   ```bash
   # Run database migrations (in a new terminal)
   docker-compose exec app-dev npm run db:push
   ```

3. **Access the application**:
   - Frontend/API: http://localhost:5000
   - PostgreSQL: localhost:5432

### Production Mode

To run the production version:

```bash
docker-compose --profile production up app-prod postgres --build
```

Access at: http://localhost:5001

## Available Commands

### Development

```bash
# Start development environment
docker-compose up

# Start with build
docker-compose up --build

# Run in background
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f app-dev

# Execute commands in the running container
docker-compose exec app-dev npm run db:push
docker-compose exec app-dev npm run check
```

### Production Testing

```bash
# Build and run production version
docker-compose --profile production up --build

# Stop production services
docker-compose --profile production down
```

## Services

### PostgreSQL Database
- **Container**: `cheesefinder-db`
- **Port**: 5432
- **Credentials**:
  - Username: `cheesefinder_user`
  - Password: `cheesefinder_password`
  - Database: `cheesefinder_db`

### Application (Development)
- **Container**: `cheesefinder-app-dev`
- **Port**: 5000
- **Features**: Hot reloading, development tools

### Application (Production)
- **Container**: `cheesefinder-app-prod` 
- **Port**: 5001
- **Features**: Optimized build, production ready

## Environment Variables

Copy `.env.example` to `.env` and modify as needed:

```bash
cp .env.example .env
```

Key variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NODE_ENV`: Environment mode (development/production)
- `PORT`: Application port

## Database Management

### Run Migrations
```bash
docker-compose exec app-dev npm run db:push
```

### Connect to Database
```bash
# Using docker-compose
docker-compose exec postgres psql -U cheesefinder_user -d cheesefinder_db

# Using external client
psql postgres://cheesefinder_user:cheesefinder_password@localhost:5432/cheesefinder_db
```

## Troubleshooting

### Container Issues
```bash
# View logs
docker-compose logs app-dev
docker-compose logs postgres

# Rebuild containers
docker-compose down
docker-compose up --build

# Clean everything and restart
docker-compose down -v
docker-compose up --build
```

### Database Issues
```bash
# Reset database
docker-compose down -v
docker-compose up postgres
docker-compose exec app-dev npm run db:push
```

### Permission Issues
If you encounter permission issues on Linux:
```bash
sudo chown -R $USER:$USER .
```

## Architecture

The containerized setup includes:

1. **Multi-stage Dockerfile**:
   - Development stage with hot reloading
   - Builder stage for optimized builds
   - Production stage with minimal footprint

2. **Docker Compose**:
   - PostgreSQL database service
   - Development application service
   - Production application service (optional)

3. **Volume Management**:
   - Persistent database storage
   - Source code mounting for development
   - Node modules optimization

4. **Health Checks**:
   - Database connectivity verification
   - Service dependency management

## Production Deployment

For production deployment, consider:

1. **Environment Variables**: Use secure secret management
2. **Database**: Use managed PostgreSQL service
3. **Reverse Proxy**: Add Nginx for static file serving
4. **SSL/TLS**: Configure HTTPS certificates
5. **Monitoring**: Add health checks and logging