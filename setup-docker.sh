#!/bin/bash

# Cheesefinder Docker Development Setup Script
# This script helps you get started with the containerized development environment

set -e

echo "🧀 Cheesefinder Docker Setup"
echo "============================="

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Check if .env file exists, if not copy from example
if [ ! -f .env ]; then
    echo "📋 Creating .env file from .env.example..."
    cp .env.example .env
    echo "✅ .env file created. You may want to review and modify it."
else
    echo "✅ .env file already exists."
fi

echo ""
echo "🚀 Starting Docker services..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting for database to be ready..."
sleep 10

echo ""
echo "🗄️  Setting up database schema..."
docker-compose exec -T app-dev npm run db:push

echo ""
echo "🎉 Setup complete!"
echo ""
echo "🌐 Your application is now running at:"
echo "   Frontend/API: http://localhost:5000"
echo "   Database:     localhost:5432"
echo ""
echo "📝 Useful commands:"
echo "   docker-compose logs -f app-dev    # View application logs"
echo "   docker-compose logs -f postgres   # View database logs"
echo "   docker-compose down               # Stop all services"
echo "   docker-compose exec app-dev bash  # Access app container"
echo ""
echo "📚 For more information, see DOCKER_SETUP.md"