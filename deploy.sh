#!/bin/bash

# Exit on any error
set -e

echo "🚀 Starting deployment to GitHub Pages..."

# Build the site
echo "📦 Building Hugo site..."
hugo --minify

# Add all changes to git
echo "📝 Adding changes to git..."
git add .

# Commit changes
echo "💾 Committing changes..."
git commit -m "Deploy: $(date)"

# Push to origin
echo "⬆️ Pushing to GitHub..."
git push origin main

# Deploy to GitHub Pages
echo "🌐 Deploying to GitHub Pages..."
cd public
git add .
git commit -m "Deploy: $(date)" || true
git push origin main

echo "✅ Deployment completed successfully!"
echo "🔗 Your site should be available at: https://minhoshin.github.io"
