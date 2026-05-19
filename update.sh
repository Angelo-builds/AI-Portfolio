#!/bin/bash
# update.sh - Automates the pull, build, and deploy process

echo "==> Putting site into maintenance mode..."
touch .maintenance
echo "Maintenance mode active."

echo "==> Pulling latest changes from git..."
git pull origin main

echo "==> Installing dependencies..."
npm ci || npm install

echo "==> Building frontend and backend..."
npm run build

echo "==> Restarting node server via PM2..."
# Try to restart pm2 if it exists, otherwise echo instructions
if command -v pm2 &> /dev/null
then
    echo "PM2 found, attempting to restart services..."
    # Assuming 'portfolio' might be the pm2 name, or we can use 'all' if only one app
    pm2 restart all || echo "Could not restart PM2 automatically, please do so manually."
else
    echo "==> Note: PM2 not found. Run the app using 'npm start' with NODE_ENV=production."
fi

echo "==> Removing maintenance mode..."
rm -f .maintenance
echo "Site is back online!"
