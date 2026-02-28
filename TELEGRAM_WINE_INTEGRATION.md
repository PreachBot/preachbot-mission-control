# 🍷 Telegram → Wine Journal Integration

## How It Works

When you send me a wine bottle photo via Telegram, here's what happens automatically:

### 1. You Send a Photo
```
You: [uploads wine bottle photo]
     "Trying this at dinner tonight"
```

### 2. I Analyze It
- I receive the photo in our Telegram chat
- I use Claude Vision API to read the wine label
- Extract all details automatically:
  - Wine name
  - Producer/winery
  - Vintage year
  - Region & country
  - Grape varieties
  - Wine type (red/white/rosé/sparkling)
  - Style description
  - Estimated price range
  - Food pairing suggestions
  - Winery background

### 3. I Ask For Your Input
```
Me: 🧠 Found: Louis M. Martini Napa Valley Cabernet Sauvignon 2021
    Napa Valley, CA • $25-35 • Bold & Full-bodied
    
    How would you rate it? (1-5 stars)
    Any tasting notes?
    🤙 Would you buy it again?
```

### 4. You Reply
```
You: 5 stars. Bold tannins, dark fruit, perfect with steak. 🤙 yes
```

### 5. I Add It Automatically
- I parse your response
- Call the `/api/wine/add` endpoint
- Your wine is instantly added to your journal
- Visible immediately at https://your-app.vercel.app/wine

```
Me: ✅ Added to your Wine Journal!
    
    Louis M. Martini Napa Cab 2021 • ⭐⭐⭐⭐⭐ • 🤙
    Total wines: 7 | View: https://your-app.vercel.app/wine
```

---

## Alternative: Quick Add

If you just send a photo without text, I'll add it with defaults:

```
You: [photo only]
Me: 🧠 Analyzing...
    ✅ Added: Caymus Napa Valley Cabernet 2020
    Rating: 3★ (unrated - edit later)
    View at https://your-app.vercel.app/wine
```

You can edit the rating and notes later in the web app.

---

## Technical Details

### API Endpoint
```typescript
POST http://localhost:3000/api/wine/add
Content-Type: application/json

{
  "name": "Louis M. Martini Napa Valley Cabernet Sauvignon",
  "producer": "Louis M. Martini",
  "vintage": "2021",
  "region": "Napa Valley",
  "country": "USA",
  "grapes": ["Cabernet Sauvignon"],
  "type": "red",
  "style": "Bold & Full-bodied",
  "priceRange": "$25-35",
  "rating": 5,
  "wouldBuyAgain": true,
  "tastingNotes": "Bold tannins, dark fruit, perfect with steak.",
  "photo": "base64_encoded_image_data",
  "dateTasted": "2024-02-27"
}
```

### Storage
- Server-side: `data/wines.json` (persists across sessions)
- Client-side cache: `localStorage` (browser backup)
- Syncs automatically on page load

---

## Workflow Examples

### Example 1: At a Restaurant
```
You: [photo] "At Uchi, trying their wine pairing"
Me: 🧠 Found: Duckhorn Merlot 2019 • Napa Valley • $40-55
    Rate it?
You: 4 stars, smooth and elegant, great with the omakase
Me: ✅ Added! Total wines: 8
```

### Example 2: At Home
```
You: [photo]
Me: 🧠 Found: Caymus Cabernet 2020 • Napa • $75-95
    Rate it?
You: 5 stars 🤙 Would definitely buy again
Me: ✅ Added with 5★ + Would Buy Again badge!
```

### Example 3: Wine Tasting
```
You: [3 photos in a row]
Me: 🧠 Analyzing 3 wines...
    1. ✅ Added: Silver Oak Cabernet 2018 (unrated)
    2. ✅ Added: Stag's Leap Artemis 2020 (unrated)
    3. ✅ Added: Opus One 2019 (unrated)
    
    Reply with ratings when you taste them!
    e.g. "1: 4 stars, 2: 5 stars, 3: 3 stars"
```

---

## Commands (Future Enhancement)

Eventually, you'll be able to use commands like:

- `/wine list` - Show your last 5 wines
- `/wine search napa` - Find all Napa wines
- `/wine stats` - View your collection stats
- `/wine favorites` - Show 5-star wines

---

## Privacy & Security

- Photos are analyzed locally by Claude API
- Your wine data is stored only on your Vercel server
- I never share your wine data with anyone
- Photos are only used for label reading (not stored long-term)

---

## Ready to Test!

Send me a wine bottle photo anytime and I'll:
1. Analyze it automatically
2. Ask for your rating and notes
3. Add it to your wine journal instantly
4. You can view/edit it at https://your-app.vercel.app/wine

**Try it now!** 🍷📸
