# Cheesefinder - Task Automation Guide

This project uses [Task](https://taskfile.dev/) to automate common development tasks and make contributing easier.

## Quick Start

### First Time Setup
```bash
# Complete project setup (installs deps, sets up env, starts services)
task setup

# Start development environment
task dev
```

### Daily Development
```bash
# Start development environment
task start      # or task dev

# View logs
task logs

# Check service status
task status

# Stop services
task stop
```

## Available Tasks

Run `task --list` to see all available tasks, or `task info` for project information.

### 🚀 Setup & Development
- `task setup` - Complete first-time project setup
- `task dev` - Start development environment with Docker
- `task dev:local` - Start development with local Node.js
- `task build` - Build application for production

### 🐳 Docker Management
- `task docker:up` - Start Docker services
- `task docker:down` - Stop Docker services  
- `task docker:restart` - Restart Docker services
- `task build:docker` - Build Docker images

### 🗄️ Database Operations
- `task db:setup` - Complete database setup
- `task db:migrate` - Run database migrations
- `task db:shell` - Connect to database shell
- `task db:reset` - Reset database (⚠️ destructive)
- `task db:dump` - Create database backup

### 🧪 Testing & Quality
- `task test` - Run all tests (types, linting)
- `task test:types` - TypeScript type checking
- `task test:lint` - Code linting

### 📋 Monitoring & Debugging
- `task logs` - View application logs
- `task logs:db` - View database logs
- `task logs:all` - View all service logs
- `task status` - Show service health status
- `task shell` - Access application container shell

### 🚀 Production
- `task prod:start` - Start production environment
- `task prod:stop` - Stop production environment
- `task prod:logs` - View production logs

### 🧹 Maintenance
- `task clean` - Clean up development environment
- `task info` - Show project information

## Task Features

### Smart Dependencies
Tasks automatically handle dependencies. For example:
- `task dev` ensures Docker is running and database is ready
- `task db:migrate` ensures the database container is running
- `task setup` runs all necessary setup steps in order

### Environment Management
- Automatic `.env` file creation from template
- Environment variables are properly set for each task
- Different environments (dev/prod) are handled seamlessly

### Error Handling
- Database readiness checks
- Service health verification
- Graceful error messages

### Convenience Aliases
- `task start` → `task dev`
- `task stop` → `task docker:down`
- `task restart` → `task docker:restart`

## Installation

If Task is not installed:

```bash
# Install Task (Linux/macOS)
curl -sL https://taskfile.dev/install.sh | sh
sudo mv ./bin/task /usr/local/bin/

# Or using package managers
# macOS
brew install go-task

# Ubuntu/Debian
sudo snap install task --classic
```

## Examples

### Starting Development
```bash
# First time
task setup

# Daily development
task dev
# Application available at http://localhost:5000
# Database available at localhost:5432

# View logs
task logs
```

### Database Operations
```bash
# Run migrations
task db:migrate

# Connect to database
task db:shell

# Create backup
task db:dump

# Reset database (careful!)
task db:reset
```

### Production Testing
```bash
# Start production environment
task prod:start
# Available at http://localhost:5001

# View production logs
task prod:logs

# Stop production
task prod:stop
```

## Project Structure

The Taskfile automates tasks across these key areas:

```
📂 Cheesefinder/
├── 📁 client/          # React frontend
├── 📁 server/          # Express backend  
├── 📁 shared/          # Shared types/schema
├── 🐳 Dockerfile       # Container definition
├── 🐳 docker-compose.yml  # Service orchestration
├── ⚡ Taskfile.yml     # Task automation
└── 📋 package.json     # Node.js dependencies
```

## Benefits

✅ **Simplified onboarding** - Single command setup  
✅ **Consistent environment** - Same commands for all developers  
✅ **Docker abstraction** - No need to remember complex Docker commands  
✅ **Error prevention** - Built-in checks and dependencies  
✅ **Documentation** - Self-documenting with `task --list`  
✅ **Cross-platform** - Works on Linux, macOS, and Windows  

## Contributing

When adding new tasks:
1. Add them to the appropriate section in `Taskfile.yml`
2. Include a clear description
3. Handle dependencies appropriately
4. Update this documentation
5. Test on a clean environment

For more information, see [DOCKER_SETUP.md](DOCKER_SETUP.md) for Docker-specific details.