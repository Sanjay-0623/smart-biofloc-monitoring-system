# Quick Start Guide - Get Running in 5 Minutes

This is the fastest way to get your Smart Biofloc System running in Visual Studio Code.

## Step 1: Create .env.local File (2 minutes)

1. In VS Code, right-click the root folder → New File
2. Name it `.env.local` (with the dot at the start)
3. Copy and paste this content:

\`\`\`env
DATABASE_URL=your_database_url_here
NEXTAUTH_SECRET=69eb683c8ad60e1875096a451cd23f58
NEXTAUTH_URL=http://localhost:3000
\`\`\`

4. Replace `your_database_url_here` with your actual database URL

### Where to Get DATABASE_URL:

**Option A: Neon (Recommended)**
1. Go to https://console.neon.tech
2. Create free account (no credit card needed)
3. Create new project
4. Copy the connection string (starts with `postgresql://`)
5. Paste it in your `.env.local` file

**Option B: Supabase**
1. Go to https://supabase.com/dashboard
2. Create free account
3. Create new project
4. Go to Settings → Database
5. Copy "Connection string" under "Connection pooling"
6. Paste it in your `.env.local` file

**Example .env.local:**
\`\`\`env
DATABASE_URL=postgresql://username:password@ep-cool-darkness-123456.us-east-2.aws.neon.tech/neondb
NEXTAUTH_SECRET=69eb683c8ad60e1875096a451cd23f58
NEXTAUTH_URL=http://localhost:3000
\`\`\`

## Step 2: Install Dependencies (1 minute)

Open terminal in VS Code (Ctrl+\` or View → Terminal) and run:

\`\`\`bash
npm install
\`\`\`

Wait for installation to complete.

## Step 3: Start the Server (1 minute)

In the same terminal, run:

\`\`\`bash
npm run dev
\`\`\`

You should see:
\`\`\`
✓ Ready in 2.5s
○ Local:   http://localhost:3000
\`\`\`

## Step 4: Open and Test (1 minute)

1. Open browser to http://localhost:3000
2. Click "Create one now" to sign up
3. Enter your details:
   - Full Name: Your Name
   - Email: test@example.com
   - Password: password123 (or any password)
4. Click "Create Account"
5. You'll be redirected to login - enter the same credentials
6. Success! You're now in the dashboard

## Troubleshooting

### "An error occurred" on signup/login

**Fix:** Database not connected

1. Check if `.env.local` file exists
2. Verify DATABASE_URL is correct (no quotes, no spaces)
3. Visit http://localhost:3000/api/auth/init-db in browser
4. Refresh and try again

### "Cannot connect to server"

**Fix:** Dev server not running

1. Check terminal - should show "Ready" message
2. If not running: `npm run dev`
3. If port 3000 is busy: Change to 3001 in terminal

### "DATABASE_URL environment variable is not set"

**Fix:** Missing .env.local file

1. Create `.env.local` in root folder (same level as package.json)
2. Add DATABASE_URL as shown in Step 1
3. Stop server (Ctrl+C) and restart (`npm run dev`)

### Still having issues?

1. Open terminal and look for `[v0]` messages
2. Check browser console (F12) for errors
3. Verify Node.js version: `node -v` (should be v18 or higher)
4. Read VSCODE_SETUP_GUIDE.md for detailed help

## Next Steps

### Hardware Setup (ESP32)
- Open `ESP32_SETUP_GUIDE.md` for sensor setup
- Upload `esp32_biofloc_monitor.ino` to your ESP32
- Connect sensors and start monitoring

### Admin Access
Default user role is "user". To make yourself admin:
1. Use PostgreSQL extension in VS Code
2. Or use Neon/Supabase dashboard
3. Run: `UPDATE profiles SET role='admin' WHERE email='your@email.com'`

### Learn More
- `README.md` - Complete project documentation
- `VSCODE_SETUP_GUIDE.md` - Detailed VS Code setup
- `DATABASE_SETUP_GUIDE.md` - Database configuration
- `ESP32_SETUP_GUIDE.md` - Hardware setup

## Success Checklist

- [ ] `.env.local` file created with DATABASE_URL
- [ ] `npm install` completed without errors
- [ ] `npm run dev` shows "Ready" message
- [ ] http://localhost:3000 loads in browser
- [ ] Created account successfully
- [ ] Logged in and see dashboard
- [ ] Can navigate between pages

**You're all set! Start monitoring your biofloc system.**
\`\`\`

```gitignore file="" isHidden
