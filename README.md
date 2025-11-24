# 🧀 Cheesefinder

A modern full-stack web application for cheese enthusiasts, built with React, Express, and PostgreSQL.

## Quick Start

### New Contributors & Developers

1. **Install Task automation tool**
   ```bash
   # Run our installer (Linux/macOS)
   ./install-task.sh
   
   # Or install manually
   curl -sL https://taskfile.dev/install.sh | sh
   sudo mv ./bin/task /usr/local/bin/
   ```

2. **Complete project setup**
   ```bash
   task setup
   ```

3. **Start development**
   ```bash
   task dev
   ```

4. **Open your browser**
   - Application: http://localhost:5000
   - Database: localhost:5432

That's it! 🎉

## What You Get

- ⚡ **One-command setup** - `task setup` handles everything
- 🐳 **Containerized development** - Consistent environment across machines
- 🔄 **Hot reloading** - Frontend and backend automatically reload on changes
- 🗄️ **PostgreSQL database** - Production-ready database setup
- 🎨 **Modern UI** - React + TypeScript + Tailwind + shadcn/ui components
- 🔧 **Type safety** - Full TypeScript across frontend and backend
- 📋 **Task automation** - 30+ predefined tasks for common operations

## Technology Stack

**Frontend**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- shadcn/ui + Radix UI (components)
- Wouter (routing)
- TanStack Query (data fetching)

**Backend**
- Express + TypeScript
- Drizzle ORM (database)
- Passport.js (authentication)
- Express Session (session management)

**Database**
- PostgreSQL 15
- Drizzle migrations
- Connection pooling

**Development**
- Docker + Docker Compose
- Task automation
- Hot reloading
- TypeScript everywhere
- ESLint ready (setup needed)

## Common Commands

```bash
# Development
task dev          # Start development environment
task logs         # View application logs
task status       # Check service health
task stop         # Stop all services

# Database
task db:shell     # Connect to database
task db:migrate   # Run migrations
task db:reset     # Reset database (destructive)

# Production
task prod:start   # Test production build
task build        # Build for production

# Utilities
task clean        # Clean up containers/volumes
task shell        # Access app container
task info         # Show project information
task --list       # Show all available commands
```

## Project Structure

```
📁 Cheesefinder/
├── 📁 client/               # React frontend
│   ├── src/components/      # Reusable components
│   ├── src/pages/          # Application pages
│   └── src/hooks/          # Custom React hooks
├── 📁 server/              # Express backend
│   ├── routes.ts           # API endpoints
│   ├── db.ts               # Database connection
│   └── auth/               # Authentication logic
├── 📁 shared/              # Shared TypeScript types
│   └── schema.ts           # Database schema & validation
├── 🐳 Dockerfile           # Multi-stage container setup
├── 🐳 docker-compose.yml   # Development services
├── ⚡ Taskfile.yml         # Automation commands
└── 📦 package.json         # Node.js dependencies
```

## Features

- 🔐 **Authentication** - OAuth integration with Replit
- 📝 **Questionnaires** - Dynamic form builder and processor
- 📊 **Dashboard** - User analytics and insights
- 🎨 **Theming** - Dark/light mode support
- 📱 **Responsive** - Mobile-first design
- ⚡ **Real-time** - WebSocket support ready
- 🛡️ **Type Safe** - Full TypeScript coverage

## Documentation

- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Complete contributor guide
- **[TASKFILE.md](TASKFILE.md)** - Task automation documentation  
- **[DOCKER_SETUP.md](DOCKER_SETUP.md)** - Docker-specific setup guide
- **[design_guidelines.md](design_guidelines.md)** - UI/UX guidelines

## Development Workflow

### First Time Setup
```bash
git clone <repository-url>
cd Cheesefinder
./install-task.sh  # Install Task if needed
task setup         # Complete project setup
task dev           # Start development
```

### Daily Development
```bash
task dev           # Start services
# Make your changes...
task test:types    # Check TypeScript
task logs          # Monitor logs
task stop          # Stop when done
```

### Database Changes
```bash
# Edit shared/schema.ts
task db:migrate    # Apply changes
task db:shell      # Verify in database
```

### Production Testing
```bash
task prod:start    # Test production build
task prod:logs     # Check production logs
task prod:stop     # Clean up
```

## Why Task Automation?

Before Taskfile:
```bash
# Complex Docker commands
docker-compose up -d --build
docker-compose exec app-dev npm run db:push
docker-compose logs -f app-dev

# Manual environment setup
cp .env.example .env
npm install
# ... multiple steps
```

With Taskfile:
```bash
task setup  # Everything handled automatically
task dev    # Start development
task logs   # View logs
```

**Benefits:**
- ✅ Consistent commands across all machines
- ✅ Self-documenting with `task --list`
- ✅ Handles dependencies automatically
- ✅ Error checking and validation
- ✅ New developer onboarding in minutes
- ✅ Works on Linux, macOS, and Windows

## Getting Help

🔍 **Quick Diagnostics**
```bash
task status     # Check all services
task info       # Project overview
task --list     # All available commands
```

🐛 **Troubleshooting**
```bash
task logs       # Application logs
task logs:db    # Database logs  
task clean      # Nuclear option - clean everything
task setup      # Start fresh
```

📚 **Documentation**
- Read the docs in this repository
- Check existing code for patterns
- Ask questions in issues/discussions

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for:
- Complete setup guide
- Development workflow
- Code style guidelines
- Pull request process

## License

MIT License - see LICENSE file for details

---

**Ready to contribute?** Just run `task setup` and you're ready to go! 🚀