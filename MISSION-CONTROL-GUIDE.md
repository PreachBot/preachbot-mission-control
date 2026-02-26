# 🎯 Mission Control - User Guide

## ✨ What You Got

A beautiful, functional Kanban board for tracking all our projects and goals together!

### Features Built:
- ✅ **4 Columns:** Ideas → To Do → In Progress → Done
- ✅ **Drag & Drop:** Move cards between columns
- ✅ **Priority Levels:** Low, Medium, High (color-coded)
- ✅ **Tags:** Organize cards by project/theme
- ✅ **Auto-Save:** Everything saves to browser localStorage
- ✅ **Add/Delete:** Create new tasks, remove completed ones
- ✅ **Live Stats:** Footer shows card counts
- ✅ **Modern Design:** Purple gradient, glassmorphism effects

---

## 🚀 How to Use

### **Starting the Board:**
```bash
cd /Users/preachbot/.openclaw/workspace/second-brain
npm run dev
```
Then open: **http://localhost:3000**

### **Adding a Task:**
1. Click **"New Task"** button (top right)
2. Fill in:
   - Title (required)
   - Description
   - Column (where it should start)
   - Priority (low/medium/high)
   - Tags (comma-separated)
3. Click **"Add Task"**

### **Moving Tasks:**
- **Grab** any card by the grip icon (⋮⋮)
- **Drag** to a different column
- **Drop** to move it

### **Deleting Tasks:**
- Hover over a card
- Click the **trash icon** that appears

---

## 📋 Pre-Loaded Cards

Your board starts with 4 sample cards representing our current projects:
1. **Wine Brain Notion System** (Ideas)
2. **Deploy GeorgeSeverson.com** (To Do)
3. **Mission Control Dashboard** (In Progress) ← This one!
4. **GitHub Repositories Created** (Done)

Feel free to edit or delete these!

---

## 🎨 Design Details

**Color System:**
- **Purple/Blue Gradient Background** - Mission control vibe
- **Glassmorphism Cards** - Modern, clean aesthetic
- **Priority Colors:**
  - 🔵 Low = Blue
  - 🟡 Medium = Yellow
  - 🔴 High = Red

**Typography:**
- Inter font (clean, professional)
- Large headers, readable descriptions
- Small metadata (dates, tags)

---

## 💾 Data Persistence

All your data is saved automatically to **browser localStorage**.

**What this means:**
- ✅ Your cards survive page refreshes
- ✅ No database needed
- ❌ Data is local to this computer/browser
- ❌ Can't sync across devices (yet)

**Future upgrade:** We can add a backend later to sync across devices.

---

## 🔮 What's Next?

**Potential Enhancements:**
1. **Export/Import** - Save board as JSON file
2. **Due Dates** - Add deadlines to cards
3. **Subtasks** - Checklist within cards
4. **Filters** - View by priority, tag, or date
5. **Backend Sync** - Save to database, access anywhere
6. **Collaboration** - Real-time updates with team
7. **Analytics** - Track completion rates, velocity

---

## 🐛 Troubleshooting

**Board won't load?**
- Make sure dev server is running: `npm run dev`
- Check port 3000 isn't already in use

**Cards disappear?**
- LocalStorage was cleared
- Just re-add them (they'll persist going forward)

**Can't drag cards?**
- Make sure you're grabbing the grip icon (⋮⋮)
- Try refreshing the page

---

## 📚 Tech Stack

- **Next.js 15** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **@dnd-kit** - Drag & drop
- **Lucide React** - Icons

---

## 🎯 GitHub

**Repository:** https://github.com/PreachBot/mission-control

Clone it anywhere:
```bash
git clone https://github.com/PreachBot/mission-control.git
cd mission-control
npm install
npm run dev
```

---

**Built by PreachBot for Team George & Preach** 🤝
