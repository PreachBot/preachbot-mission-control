# 🧠 Memory Bank - User Guide

## ✨ What You Got

A searchable archive system for storing articles, videos, conversations, code, and notes!

### Features Built:
- ✅ **5 Content Types:** Articles, Videos, Conversations, Code, Notes
- ✅ **Instant Search:** Filter by keywords, tags, or content
- ✅ **Type Filters:** View all or filter by specific type
- ✅ **Rich Cards:** Summaries, key points, tags, importance levels
- ✅ **Auto-Save:** Everything saves to localStorage
- ✅ **Stats Dashboard:** Quick overview of your memory bank
- ✅ **Related Projects:** Link memories to Mission Control tasks
- ✅ **Modern UI:** Same purple gradient design as Mission Control

---

## 🚀 How to Use

### **Accessing Memory Bank:**
1. Start Mission Control: `cd /Users/preachbot/.openclaw/workspace/second-brain && npm run dev`
2. Go to http://localhost:3000
3. Click **"Memory Bank"** button in top right

OR go directly to: http://localhost:3000/memory

### **Adding a Memory:**
1. Click **"Add Memory"** button
2. Select type (Article/Video/Conversation/Code/Note)
3. Fill in:
   - **Title** (required)
   - **URL** (optional - for articles/videos)
   - **Summary** (required - 2-3 sentences)
   - **Full Content** (optional - full text/transcript)
   - **Key Points** (one per line)
   - **Tags** (comma-separated)
   - **Importance** (low/medium/high)
   - **Related Projects** (links to Mission Control tasks)
4. Click **"Add Memory"**

### **Searching:**
- Use the search bar at the top
- Searches: title, summary, tags, and content
- Results update instantly as you type

### **Filtering by Type:**
- Click any filter button: All, Articles, Videos, Conversations, Code, Notes
- Combine with search for precision

### **Deleting:**
- Hover over a memory card
- Click the trash icon that appears

---

## 📝 Pre-Loaded Memories

Your bank starts with 3 sample memories:
1. **Building AI Agent Businesses** (Article)
2. **Wine Brain System Discussion** (Conversation)
3. **George's Wine Preferences** (Note)

These showcase the different memory types!

---

## 🎯 Use Cases

### **When You Send Me Content:**

**Articles:**
```
You: "Summarize this article https://..."
Me: [Reads, summarizes, creates memory card]
You: [Can search for it later]
```

**Videos:**
```
You: "Watch this video and take notes"
Me: [Summarizes key points, stores in memory]
```

**Conversations:**
```
Me: [After big discussion, I save summary to memory]
You: [Can search conversation history]
```

**Code Snippets:**
```
You: "Save this code for the wine project"
Me: [Creates memory with code + notes]
```

**Quick Notes:**
```
You: "Remember: George prefers dry reds"
Me: [Saves as note for future reference]
```

---

## 💡 Pro Tips

### **Tagging Strategy:**
Use consistent tags for easy filtering:
- **By Project:** `wine`, `website`, `mission-control`
- **By Type:** `business`, `tech`, `personal`
- **By Action:** `todo`, `reference`, `idea`
- **By Priority:** `urgent`, `backlog`, `someday`

### **Importance Levels:**
- **High:** Critical info you need often
- **Medium:** Useful, but not urgent
- **Low:** Nice to have, reference only

### **Related Projects:**
Link memories to Mission Control tasks:
- Creates context between planning and knowledge
- Easy to see what info is relevant to each project

---

## 🔮 Future Enhancements

**Coming Soon (when you want them):**
1. **Auto-Summarization:** Send me a URL, I fetch + summarize automatically
2. **Export:** Download your memory bank as JSON
3. **Import:** Bulk upload memories from files
4. **Advanced Search:** Date ranges, importance filters
5. **Collections:** Group related memories
6. **Backend Sync:** Access from any device
7. **AI Search:** "Show me everything about wine from February"

---

## 📊 Stats Dashboard

Top of the page shows:
- **Total Memories** - Everything you've saved
- **Articles** - Count of article memories
- **Conversations** - Saved discussions
- **High Priority** - Important items
- **Unique Tags** - Your tag vocabulary

Use this to track growth of your knowledge base!

---

## 💾 Data Storage

**Location:** Browser localStorage (same as Mission Control)

**What this means:**
- ✅ No internet required
- ✅ Private and local
- ✅ Instant access
- ❌ Not synced across devices (yet)
- ❌ Cleared if you clear browser data

**Backup:** We can add export/import later for safety!

---

## 🎨 Design Details

**Same aesthetic as Mission Control:**
- Purple/blue gradient background
- Glassmorphism cards
- Color-coded by type and importance
- Smooth animations
- Responsive layout

**Type Colors:**
- 🔵 Articles = Blue
- 🔴 Videos = Red
- 🟣 Conversations = Purple
- 🟢 Code = Green
- 🟡 Notes = Yellow

---

## 🔗 Navigation

**Mission Control ↔ Memory Bank**
- Easy switching with nav buttons
- Both in same app
- Shared data storage

---

## 🐛 Troubleshooting

**Memory Bank won't load?**
- Make sure dev server is running
- Check port 3000
- Refresh the page

**Can't find a memory?**
- Try different search terms
- Check your filters
- Look at the "All" view

**Memory disappeared?**
- Check if you deleted it
- Try clearing and re-adding

---

## 📚 Tech Stack

Same as Mission Control:
- Next.js 15
- TypeScript
- Tailwind CSS
- Lucide React icons

---

**Built by PreachBot for Team George & Preach** 🤝  
**GitHub:** https://github.com/PreachBot/mission-control
