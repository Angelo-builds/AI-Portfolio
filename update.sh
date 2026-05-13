#!/bin/bash
# update.sh - Automates the pull, build, and deploy process

echo "==> Putting site into maintenance mode..."
touch .maintenance
echo "Maintenance mode active."

echo "==> Pulling latest changes from git..."
git pull origin main

echo "==> Installing dependencies..."
npm install

echo "==> Building frontend and backend..."
npm run build

# To ensure the server runs in production mode, set NODE_ENV=production
# Assuming you use pm2:
# pm2 start ecosystem.config.js OR
# pm2 restart portfolio
echo "==> Restarting services. You may need to restart the node server manually if not using PM2."
echo "==> Note: Run the app using 'npm start' with NODE_ENV=production or PM2."

echo "==> Removing maintenance mode..."
rm -f .maintenance
echo "Site is back online!"
