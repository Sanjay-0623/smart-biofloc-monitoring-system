# Visual Studio Code Setup Guide

## Quick Start - 3 Steps to Run Locally

### Step 1: Install Dependencies

Open terminal in VS Code and run:
\`\`\`bash
npm install
\`\`\`

### Step 2: Create Environment Variables File

Create a file named `.env.local` in the root directory (same folder as package.json) with this content:

\`\`\`env
# Copy these from your Vercel project's environment variables
DATABASE_URL=your_neon_or_supabase_database_url
POSTGRES_URL=your_database_url
NEXTAUTH_SECRET=69eb683c8ad60e1875096a451cd23f58
NEXTAUTH_URL=http://localhost:3000
\`\`\`

**Where to find DATABASE_URL:**

**Option A: From Vercel Project**
1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Copy the `DATABASE_URL` or `POSTGRES_URL` value

**Option B: From Neon Dashboard**
1. Go to https://console.neon.tech
2. Select your project
3. Go to Dashboard → Connection Details
4. Copy the connection string (starts with `postgresql://`)

**Option C: From Supabase Dashboard**
1. Go to https://supabase.com/dashboard
2. Select your project
3. Go to Settings → Database
4. Copy the Connection string (Transaction pooling)

### Step 3: Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

Your app will be available at: http://localhost:3000

---

## Troubleshooting Common Errors

### Error: "An error occurred. Please try again." on Login

**Cause:** Database not connected or not initialized

**Solution:**
1. Check if `.env.local` file exists in root folder
2. Verify `DATABASE_URL` is correct
3. Initialize database by visiting: http://localhost:3000/api/auth/init-db
4. Check terminal for error messages (look for `[v0]` logs)

### Error: "DATABASE_URL environment variable is not set"

**Cause:** Missing `.env.local` file or incorrect variable name

**Solution:**
1. Create `.env.local` file in root directory
2. Add `DATABASE_URL=your_connection_string`
3. Restart the dev server (Ctrl+C, then `npm run dev`)

### Error: "ECONNREFUSED" or "Connection timeout"

**Cause:** Database server not reachable

**Solution:**
1. Check internet connection
2. Verify database URL is correct
3. Check if Neon/Supabase project is active
4. Try pinging the database host

### Error: "relation 'profiles' does not exist"

**Cause:** Database tables not created

**Solution:**
1. Visit: http://localhost:3000/api/auth/init-db
2. Or run SQL scripts manually in Neon/Supabase console
3. Check terminal for "Database initialized successfully!"

---

## First Time Setup Checklist

- [ ] Node.js installed (v18 or higher)
- [ ] VS Code installed
- [ ] Project downloaded and extracted
- [ ] `.env.local` file created with DATABASE_URL
- [ ] `npm install` completed successfully
- [ ] `npm run dev` running without errors
- [ ] http://localhost:3000 opens in browser
- [ ] Create first account on signup page
- [ ] Database auto-initializes on first signup

---

## Testing the Setup

1. Open browser to http://localhost:3000
2. Click "Create one now" to sign up
3. Fill in email, password, and name
4. Submit form
5. Should redirect to /user/dashboard
6. Check terminal logs for `[v0]` messages

---

## Useful Commands

\`\`\`bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint
\`\`\`

---

## VS Code Recommended Extensions

1. **ES7+ React/Redux/React-Native snippets**
2. **Tailwind CSS IntelliSense**
3. **Prettier - Code formatter**
4. **PostgreSQL** (for database management)

---

## Database Management in VS Code

### Option 1: PostgreSQL Extension

1. Install "PostgreSQL" extension by Chris Kolkman
2. Click the PostgreSQL icon in sidebar
3. Click "+" to add connection
4. Enter your DATABASE_URL details:
   - Host: (from your connection string)
   - User: (from your connection string)
   - Password: (from your connection string)
   - Port: 5432
   - Database: (from your connection string)
   - SSL: enabled

### Option 2: Use Web Dashboard

- **Neon:** https://console.neon.tech
- **Supabase:** https://supabase.com/dashboard

---

## Environment Variables Reference

| Variable | Required | Example | Description |
|----------|----------|---------|-------------|
| DATABASE_URL | Yes | postgresql://user:pass@host/db | Main database connection |
| POSTGRES_URL | Optional | Same as DATABASE_URL | Alternative name |
| NEXTAUTH_SECRET | Yes | 69eb683c8ad... | Auth encryption key |
| NEXTAUTH_URL | Yes | http://localhost:3000 | App URL |
| BLOB_READ_WRITE_TOKEN | Optional | vercel_blob_... | For image uploads |
| HUGGINGFACE_API_KEY | Optional | hf_... | For AI disease detection |

---

## Need Help?

If you're still having issues:

1. Check the terminal output for `[v0]` log messages
2. Open browser DevTools (F12) → Console tab
3. Look for error messages in red
4. Check Network tab for failed API requests
5. Verify `.env.local` is in the correct location (root folder)
6. Ensure DATABASE_URL doesn't have quotes around it

\`\`\`env
# WRONG
DATABASE_URL="postgresql://..."

# CORRECT
DATABASE_URL=postgresql://...
