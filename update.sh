#!/bin/bash
# update.sh - Automates the pull, build, and deploy process

echo "==> Putting site into maintenance mode..."
touch .maintenance
echo "Maintenance mode active."

echo "==> Pulling latest changes from git..."
git pull origin main

echo "==> Installing any new dependencies..."
npm install

echo "==> Building frontend and backend..."
npm run build

# If using PM2 (recommended for LXC node apps), you can restart it here.
# Assuming the app is named "portfolio" in pm2:
# pm2 restart portfolio

# Alternatively, if you run this with systemd, uncomment the next line:
# sudo systemctl restart portfolio

echo "==> Restarting services. You may need to restart the node server manually if not using PM2/systemd."
# You could potentially kill and restart it, but PM2 is better.

echo "==> Removing maintenance mode..."
rm .maintenance
echo "Site is back online!"
