#!/bin/bash

# Kill processes on common dev ports
# Usage: ./scripts/kill-dev-ports.sh

echo "Checking for processes on dev ports..."

# Port 3000 - Main dev server
if lsof -ti:3000 > /dev/null 2>&1; then
  echo "Killing process on port 3000..."
  lsof -ti:3000 | xargs kill -9
  echo "✓ Port 3000 freed"
else
  echo "✓ Port 3000 is free"
fi

# Port 42069 - TanStack DevTools
if lsof -ti:42069 > /dev/null 2>&1; then
  echo "Killing process on port 42069..."
  lsof -ti:42069 | xargs kill -9
  echo "✓ Port 42069 freed"
else
  echo "✓ Port 42069 is free"
fi

echo ""
echo "All dev ports are now free. You can run 'npm run dev' now."
