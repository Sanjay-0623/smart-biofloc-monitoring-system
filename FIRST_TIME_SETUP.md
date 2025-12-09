# First Time Setup - Complete Walkthrough

Welcome! This guide will walk you through setting up the Smart Biofloc Monitoring System in Visual Studio Code from scratch.

## Prerequisites

Before starting, make sure you have:

- [ ] **Node.js installed** (v18 or higher)
  - Check: Open terminal and run `node -v`
  - Download from: https://nodejs.org
  
- [ ] **Visual Studio Code installed**
  - Download from: https://code.visualstudio.com
  
- [ ] **Git installed** (optional, for version control)
  - Check: `git --version`
  - Download from: https://git-scm.com

## Step-by-Step Setup

### 1. Open Project in VS Code

1. Download and extract the project ZIP file
2. Open Visual Studio Code
3. Go to **File → Open Folder**
4. Select the extracted project folder
5. Click "Yes, I trust the authors" if prompted

### 2. Install Recommended Extensions

When you open the project, VS Code may show a popup asking to install recommended extensions. Click **Install All**.

Or manually install:
1. Click Extensions icon in sidebar (or press Ctrl+Shift+X)
2. Search and install:
   - **Tailwind CSS IntelliSense** by Tailwind Labs
   - **Prettier - Code formatter** by Prettier
   - **ESLint** by Microsoft
   - **PostgreSQL** by Chris Kolkman (for database management)

### 3. Set Up Database

You need a PostgreSQL database. Choose one option:

#### Option A: Neon (Recommended - Free, No Credit Card)

1. Go to https://console.neon.tech
2. Click "Sign Up" (can use GitHub)
3. Click "Create Project"
4. Project name: "biofloc-system"
5. Click "Create Project"
6. **Copy the connection string** (looks like: `postgresql://username:password@...`)
7. Keep this tab open - you'll need it in Step 4

#### Option B: Supabase (Alternative - Also Free)

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details and wait for setup (~2 minutes)
4. Go to **Settings → Database**
5. Find "Connection string" under "Connection pooling"
6. **Copy the connection string**

### 4. Create Environment File

1. In VS Code, right-click in the file explorer (left sidebar)
2. Select **New File**
3. Name it exactly: `.env.local` (with the dot!)
4. Paste this content:

\`\`\`env
# Database Connection
DATABASE_URL=paste_your_connection_string_here

# Authentication
NEXTAUTH_SECRET=69eb683c8ad60e1875096a451cd23f58
NEXTAUTH_URL=http://localhost:3000
\`\`\`

5. Replace `paste_your_connection_string_here` with the connection string you copied
6. Save the file (Ctrl+S)

**Important:** 
- NO quotes around the values
- NO spaces before or after the `=` sign
- The file should be at the root level (same folder as package.json)

### 5. Install Dependencies

1. Open terminal in VS Code:
   - **Menu:** Terminal → New Terminal
   - **Shortcut:** Ctrl+\` (backtick)
   
2. Make sure you're in the project folder:
   \`\`\`bash
   pwd
   # Should show your project path
   \`\`\`

3. Install packages:
   \`\`\`bash
   npm install
   \`\`\`

4. Wait 1-3 minutes for installation
5. You should see "added XXX packages" message

### 6. Start Development Server

1. In the same terminal, run:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Wait for the server to start
3. You should see:
   \`\`\`
   ✓ Ready in 2.5s
   ○ Local:   http://localhost:3000
   \`\`\`

4. The terminal should stay open and running

### 7. Open in Browser

1. Open your web browser
2. Go to: http://localhost:3000
3. You should see the Smart Biofloc System homepage

### 8. Create Your First Account

1. Click **"Create one now"** or **"Get Started"**
2. Fill in the signup form:
   - **Full Name:** Your Name
   - **Email:** your@email.com
   - **Password:** At least 6 characters
   - **Confirm Password:** Same as above
3. Click **"Create Account"**
4. Wait a moment - the database will auto-initialize
5. You'll be redirected to the login page

### 9. Login

1. Enter the same email and password
2. Click **"Sign In"**
3. You should now see your dashboard!

### 10. Verify Everything Works

Check these pages by clicking the navigation:

- [ ] **Dashboard** - Should show "Welcome" message
- [ ] **Disease Detection** - Upload form visible
- [ ] **User Dashboard** - Shows monitoring interface

## Common Issues & Solutions

### Issue: "Cannot find module" errors in terminal

**Solution:**
\`\`\`bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Issue: "Port 3000 is already in use"

**Solution:**
\`\`\`bash
# Use a different port
npm run dev -- -p 3001
# Then open http://localhost:3001
\`\`\`

### Issue: "An error occurred" on signup/login

**Solution:**
1. Check if `.env.local` exists and has DATABASE_URL
2. Visit http://localhost:3000/api/auth/init-db
3. Check terminal for error messages with `[v0]` prefix
4. Verify database connection string is correct

### Issue: Changes not appearing in browser

**Solution:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Restart dev server: Ctrl+C in terminal, then `npm run dev`

### Issue: TypeScript errors in VS Code

**Solution:**
1. Reload VS Code: Ctrl+Shift+P → "Reload Window"
2. Rebuild TypeScript: Ctrl+Shift+P → "TypeScript: Restart TS Server"

## Next Steps

### Make Yourself Admin

1. Install PostgreSQL extension in VS Code
2. Connect to your database using the DATABASE_URL
3. Run this query:
   \`\`\`sql
   UPDATE profiles SET role='admin' WHERE email='your@email.com';
   \`\`\`
4. Logout and login again
5. You'll now have admin access

### Hardware Setup (ESP32)

1. Read `ESP32_SETUP_GUIDE.md`
2. Connect sensors to ESP32
3. Upload `esp32_biofloc_monitor.ino`
4. Configure WiFi and server URL
5. Start receiving real sensor data

### Customize Your System

- Modify `app/globals.css` for styling
- Update `app/page.tsx` for homepage content
- Add new features in `app/` directory
- Customize dashboard in `app/user/dashboard/page.tsx`

## Getting Help

If you're stuck:

1. **Check terminal logs** - Look for `[v0]` messages
2. **Check browser console** - Press F12, go to Console tab
3. **Read documentation:**
   - `QUICK_START.md` - Fast setup guide
   - `VSCODE_SETUP_GUIDE.md` - Detailed VS Code instructions
   - `DATABASE_SETUP_GUIDE.md` - Database help
   - `AUTHENTICATION_TROUBLESHOOTING.md` - Login issues
4. **Verify setup:**
   - Node.js version: `node -v` (should be v18+)
   - npm version: `npm -v` (should be v9+)
   - Project files: Check package.json exists
   - Environment: Check .env.local exists

## Success!

If you've completed all steps and can login to the dashboard, congratulations! Your Smart Biofloc Monitoring System is ready to use.

**Happy monitoring!** 🐟
\`\`\`
