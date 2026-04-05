#!/bin/bash
# EduBridge - Ollama Setup Script
# One-command setup for running EduBridge offline with Gemma 4

set -e

echo "================================================="
echo "  EduBridge - Ollama Setup"
echo "  Setting up Gemma 4 for offline AI tutoring"
echo "================================================="
echo ""

# Check if Ollama is installed
if ! command -v ollama &> /dev/null; then
    echo "Ollama is not installed. Installing..."
    if [[ "$OSTYPE" == "darwin"* ]]; then
        echo "Please install Ollama from https://ollama.com/download"
        echo "After installing, run this script again."
        exit 1
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        curl -fsSL https://ollama.com/install.sh | sh
    else
        echo "Please install Ollama from https://ollama.com/download"
        exit 1
    fi
fi

echo "Ollama is installed."
echo ""

# Check if Ollama is running
if ! curl -s http://127.0.0.1:11434/api/tags > /dev/null 2>&1; then
    echo "Starting Ollama..."
    ollama serve &
    sleep 3
fi

echo "Ollama is running."
echo ""

# Pull Gemma 4 model
echo "Pulling Gemma 4 model (this may take a few minutes on first run)..."
ollama pull gemma4
echo ""

echo "================================================="
echo "  Setup Complete!"
echo ""
echo "  Gemma 4 is ready for EduBridge."
echo "  Start the app with: npm run dev"
echo "  Open: http://localhost:3000"
echo "================================================="
