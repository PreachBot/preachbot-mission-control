# 🍷 Wine Journal Setup

## What This Does

The Wine Journal is an AI-powered wine tracking system that:
- Reads wine bottle labels using Claude's vision AI
- Auto-extracts: name, producer, vintage, region, grapes, style, price
- Lets you add personal ratings, tasting notes, and photos
- Displays your collection as a beautiful searchable gallery
- Works on desktop and mobile

## 📱 Mobile Workflow (Telegram)

Since you're using OpenClaw with Telegram, here's the super easy workflow:

1. **Take a photo** of a wine bottle at dinner/winery
2. **Send it to this chat** (OpenClaw Telegram)
3. **I'll analyze it** with AI and auto-populate all the details
4. **You add your rating/notes** (or I can ask you)
5. **It's saved** to your wine journal automatically

Example conversation:
```
You: [photo of wine bottle]
Me: 🧠 Analyzing... Found: Louis M. Martini Napa Valley Cabernet Sauvignon 2021
     Structured, full-bodied red from Napa Valley, CA. $25-35 range.
     How would you rate it? Any tasting notes?
You: 5 stars. Bold tannins, dark fruit, perfect with steak
Me: ✅ Added to your Wine Journal! 
     Total wines: 15 | View at http://localhost:3000/wine
```

## 🖥️ Desktop App

Access the Wine Journal at:
**http://localhost:3000/wine**

Features:
- 📷 Upload photos directly
- 🔍 Search by name, producer, region, grape
- 🎯 Filter by type (red/white/rosé/sparkling)
- ⭐ Filter by rating (5-star, 4+, 3+)
- ❤️ Mark favorites
- 📊 View stats (total wines, avg rating, favorites)
- 🎨 Beautiful card-based gallery

## ⚙️ Setup Required

### 1. Add Anthropic API Key

Open `.env.local` in the project root and add your API key:

```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key from: https://console.anthropic.com/settings/keys

This is the same API key that OpenClaw uses. You can reuse it.

### 2. Start the Dev Server

```bash
cd /Users/preachbot/.openclaw/workspace/second-brain
npm run dev
```

Then open: http://localhost:3000/wine

## 🚀 Deploy to Vercel

When ready for mobile access from anywhere:

1. Push to GitHub (already done)
2. Connect GitHub repo to Vercel
3. Add `ANTHROPIC_API_KEY` to Vercel environment variables
4. Deploy!

Your wine journal will be live at `https://your-app.vercel.app/wine`

## 📸 AI Label Reading

The AI vision system extracts:

**From the label:**
- Wine name
- Producer/winery
- Vintage year
- Region & country
- Grape varieties

**AI-enriched data:**
- Wine type (red/white/rosé/sparkling)
- Style description (bold, elegant, crisp, etc.)
- Estimated price range
- Food pairing suggestions
- Brief winery description

**You add:**
- Personal rating (1-5 stars)
- Tasting notes
- Where you had it
- Date tasted
- ❤️ Favorite status

## 💾 Data Storage

Currently uses localStorage (browser storage):
- Simple and instant
- No backend needed
- Data persists on your device

**Future upgrade:** Add database backend so data syncs across all your devices.

## 🎯 Next Steps

1. Add your Anthropic API key to `.env.local`
2. Start the dev server: `npm run dev`
3. Open http://localhost:3000/wine
4. Add your first wine!
5. Or send me a wine photo and I'll add it for you

---

Cheers! 🍷
