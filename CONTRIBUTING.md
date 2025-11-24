# Contributing to Cheesefinder

Thank you for your interest in contributing to Cheesefinder! This guide will help you get up and running quickly.

## Quick Start for New Contributors

### Prerequisites
- Docker and Docker Compose
- [Task](https://taskfile.dev/) (automation tool)

### Getting Started
1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Cheesefinder
   ```

2. **Complete setup**
   ```bash
   task setup
   ```
   This command will:
   - Install dependencies
   - Create environment files
   - Start Docker services
   - Set up the database

3. **Start development**
   ```bash
   task dev
   ```
   The application will be available at http://localhost:5000

4. **Verify everything works**
   ```bash
   task status
   ```

## Development Workflow

### Daily Development Commands
```bash
# Start working
task dev

# View logs while developing
task logs

# Run type checking
task test:types

# Stop services when done
task stop
```

### Database Operations
```bash
# Connect to database shell
task db:shell

# Run migrations after schema changes
task db:migrate

# Create database backup
task db:dump
```

### Docker Management
```bash
# Restart services
task restart

# Clean up containers and volumes
task clean

# Access container shell for debugging
task shell
```

## Project Structure

```
📁 Cheesefinder/
├── 📁 client/               # React frontend (TypeScript + Vite)
│   ├── src/components/      # React components
│   ├── src/pages/          # Application pages
│   └── src/hooks/          # Custom React hooks
├── 📁 server/              # Express backend (TypeScript)
│   ├── app.ts              # Express app configuration
│   ├── routes.ts           # API routes
│   └── db.ts               # Database connection
├── 📁 shared/              # Shared TypeScript types
│   └── schema.ts           # Database schema & validation
├── 🐳 Dockerfile           # Container definition
├── 🐳 docker-compose.yml   # Service orchestration
├── ⚡ Taskfile.yml         # Development automation
└── 📦 package.json         # Dependencies and scripts
```

## Technology Stack

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: Express + TypeScript
- **Database**: PostgreSQL + Drizzle ORM
- **UI Components**: Radix UI + shadcn/ui
- **Authentication**: Passport.js + OpenID Connect
- **Development**: Docker + Task automation

## Making Changes

### Frontend Development
- Components are in `client/src/components/`
- Pages are in `client/src/pages/`
- Use TypeScript and follow existing patterns
- UI components are from shadcn/ui (in `components/ui/`)

### Backend Development
- API routes are in `server/routes.ts`
- Database schema is in `shared/schema.ts`
- Use TypeScript and Drizzle ORM for database operations

### Database Changes
1. Modify schema in `shared/schema.ts`
2. Run `task db:migrate` to apply changes
3. Test your changes thoroughly

### Adding Dependencies
```bash
# Add runtime dependency
npm install <package-name>

# Add development dependency
npm install -D <package-name>

# Rebuild Docker containers after adding dependencies
task docker:restart
```

## Testing

```bash
# Run all tests
task test

# Type checking only
task test:types

# Lint code (when configured)
task test:lint
```

## Environment Variables

The `.env` file is created automatically during setup. Key variables:

- `DATABASE_URL` - PostgreSQL connection string
- `NODE_ENV` - Environment (development/production)
- `SESSION_SECRET` - Session encryption key
- `PORT` - Application port (default: 5000)

## Troubleshooting

### Common Issues

**Services won't start**
```bash
task clean    # Clean up everything
task setup    # Restart from scratch
```

**Database connection issues**
```bash
task logs:db  # Check database logs
task status   # Check service health
```

**Port conflicts**
```bash
task stop     # Stop all services
# Check what's using port 5000
sudo netstat -tlnp | grep 5000
```

**Container issues**
```bash
task logs:all # View all service logs
task shell    # Access container for debugging
```

### Getting Help

1. Check `task status` for service health
2. View logs with `task logs` or `task logs:db`
3. Run `task info` for project information
4. See all available commands with `task --list`

## Code Style

- Use TypeScript for all new code
- Follow existing naming conventions
- Use functional components for React
- Keep components small and focused
- Add proper TypeScript types for new APIs

## Pull Request Process

1. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Follow the project structure
   - Add/update tests as needed
   - Update documentation if required

3. **Test your changes**
   ```bash
   task test
   task dev     # Manual testing
   ```

4. **Commit and push**
   ```bash
   git add .
   git commit -m "Description of your changes"
   git push origin feature/your-feature-name
   ```

5. **Create Pull Request**
   - Provide clear description
   - Link any related issues
   - Include screenshots if UI changes

## Available Documentation

- `TASKFILE.md` - Detailed Task automation guide
- `DOCKER_SETUP.md` - Docker-specific setup and troubleshooting
- `design_guidelines.md` - UI/UX design guidelines

## Task Automation Benefits

The Taskfile provides:

✅ **One-command setup** - `task setup`  
✅ **Consistent environment** - Same commands for all developers  
✅ **Docker abstraction** - No need to remember complex Docker commands  
✅ **Built-in checks** - Automatic health checks and dependencies  
✅ **Self-documenting** - `task --list` shows all commands  

This makes contributing much easier, especially for new team members!

## Questions?

- Check the documentation files in the repository
- Run `task info` for project overview
- Run `task status` to check system health
- Look at existing code for patterns and examples