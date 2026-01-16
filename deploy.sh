#!/bin/bash

echo "🔄 Pulling latest changes..."
git pull

echo "🛑 Stopping containers..."
docker compose down

echo "🚀 Building and starting containers..."
docker compose up --build -d

echo "✅ Deployment complete!"
docker compose ps
