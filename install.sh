#!/bin/bash

echo "Installing User Dashboard dependencies..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed. Please install Node.js from https://nodejs.org/"
    exit 1
fi

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed. Please install npm."
    exit 1
fi

echo "Node.js version:"
node --version
echo "npm version:"
npm --version
echo

echo "Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "Error: Failed to install dependencies."
    exit 1
fi

echo
echo "Installation completed successfully!"
echo
echo "To start the development server, run:"
echo "npm start"
echo
echo "Then open http://localhost:3000 in your browser."
echo 