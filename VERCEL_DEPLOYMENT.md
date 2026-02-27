# 🚀 Vercel Deployment Guide

## Quick Deploy (5 minutes)

### 1. Go to Vercel
Visit: https://vercel.com/new

### 2. Import GitHub Repository
- Click "Import Project"
- Select: **PreachBot/preachbot-mission-control**
- Click "Import"

### 3. Configure Environment Variables
Before deploying, add your API key:

**Key:** `ANTHROPIC_API_KEY`  
**Value:** Your Anthropic API key (starts with `sk-ant-api03-...`)

*(Get it from: https://console.anthropic.com/settings/keys or use the one from .env.local)*

### 4. Deploy!
Click "Deploy" and wait ~2 minutes.

### 5. Your Live URLs
After deployment:
- **Mission Control:** `https://your-app.vercel.app`
- **Memory Bank:** `https://your-app.vercel.app/memory`
- **Wine Journal:** `https://your-app.vercel.app/wine`
- **Seed Wines:** `https://your-app.vercel.app/wine/seed` (visit once to add your 6 wines)

---

## First-Time Setup After Deploy

1. Visit: `https://your-app.vercel.app/wine/seed`
2. This adds your 6 favorite wines automatically
3. Then go to: `https://your-app.vercel.app/wine`
4. Your collection is ready! 🍷

---

## Mobile Access

Once deployed, you can:
- Add wines from your phone
- Browse your collection anywhere
- Send wine photos via Telegram (PreachBot will analyze them)

---

## Future Updates

Every time you push to GitHub `main` branch, Vercel auto-deploys the latest version.

No manual steps needed after initial setup!
