#!/bin/bash

# Script to install Task automation tool if not already installed

set -e

echo "🔧 Checking for Task automation tool..."

# Check if task is already installed
if command -v task &> /dev/null; then
    echo "✅ Task is already installed (version: $(task --version))"
    echo "🚀 Run 'task setup' to get started!"
    exit 0
fi

echo "📦 Installing Task automation tool..."

# Detect OS
OS="unknown"
if [[ "$OSTYPE" == "linux-gnu"* ]]; then
    OS="linux"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    OS="macos"
elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "win32" ]]; then
    OS="windows"
fi

# Install based on OS
case $OS in
    "linux")
        echo "🐧 Installing on Linux..."
        curl -sL https://taskfile.dev/install.sh | sh
        sudo mv ./bin/task /usr/local/bin/
        ;;
    "macos")
        echo "🍎 Installing on macOS..."
        if command -v brew &> /dev/null; then
            brew install go-task
        else
            echo "⚠️  Homebrew not found. Installing via script..."
            curl -sL https://taskfile.dev/install.sh | sh
            sudo mv ./bin/task /usr/local/bin/
        fi
        ;;
    "windows")
        echo "🪟 For Windows, please install Task manually:"
        echo "   1. Download from: https://github.com/go-task/task/releases"
        echo "   2. Or use Chocolatey: choco install go-task"
        echo "   3. Or use Scoop: scoop install task"
        exit 1
        ;;
    *)
        echo "❌ Unsupported OS: $OSTYPE"
        echo "📚 Manual installation instructions: https://taskfile.dev/installation/"
        exit 1
        ;;
esac

# Verify installation
if command -v task &> /dev/null; then
    echo "✅ Task installed successfully (version: $(task --version))"
    echo ""
    echo "🚀 Next steps:"
    echo "   1. Run 'task setup' for complete project setup"
    echo "   2. Run 'task dev' to start development"
    echo "   3. Run 'task --list' to see all available commands"
    echo "   4. Run 'task info' for project information"
else
    echo "❌ Task installation failed"
    echo "📚 Manual installation instructions: https://taskfile.dev/installation/"
    exit 1
fi