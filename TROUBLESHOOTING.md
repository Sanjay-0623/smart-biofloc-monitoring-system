# Troubleshooting Guide

Common issues and their solutions when running in Visual Studio Code.

## Login/Authentication Issues

### Error: "An error occurred. Please try again."

**Causes:**
1. Database not connected
2. Database tables not created
3. Invalid credentials

**Solutions:**

1. **Check environment variables:**
   \`\`\`bash
   # Open .env.local and verify:
   DATABASE_URL=postgresql://... (no quotes)
   NEXTAUTH_SECRET=69eb683c8ad60e1875096a451cd23f58
   NEXTAUTH_URL=http://localhost:3000
   \`\`\`

2. **Initialize database:**
   - Open browser to http://localhost:3000/api/auth/init-db
   - Should see "Database initialized successfully!"

3. **Check terminal logs:**
   - Look for `[v0]` messages in VS Code terminal
   - Common errors:
     - "DATABASE_URL is not set" → Check .env.local
     - "relation 'profiles' does not exist" → Run init-db
     - "Connection timeout" → Check database URL

4. **Restart dev server:**
   \`\`\`bash
   # In terminal, press Ctrl+C
   npm run dev
   \`\`\`

### Error: "Database connection failed"

**Check database:**
1. Verify connection string is correct
2. Check if database is active (Neon/Supabase dashboard)
3. Ensure no typos in DATABASE_URL
4. Remove any quotes around the URL

**Test connection:**
\`\`\`bash
# In terminal
node -e "const { neon } = require('@neondatabase/serverless'); const sql = neon(process.env.DATABASE_URL); sql\`SELECT 1\`.then(() => console.log('Connected!')).catch(e => console.error(e))"
\`\`\`

### Stuck on "Signing in..." forever

**Solution:**
1. Check browser console (F12) for errors
2. Clear browser cookies for localhost
3. Check if API route is responding:
   - Open http://localhost:3000/api/auth/session
   - Should see JSON response (not error)

## Server Issues

### Error: "Port 3000 already in use"

**Solution 1: Use different port**
\`\`\`bash
npm run dev -- -p 3001
# Then open http://localhost:3001
\`\`\`

**Solution 2: Kill existing process**
\`\`\`bash
# Windows
netstat -ano | findstr :3000
taskkill /PID [PID_NUMBER] /F

# Mac/Linux
lsof -ti:3000 | xargs kill -9
\`\`\`

### Error: "Cannot find module"

**Solution:**
\`\`\`bash
# Delete and reinstall dependencies
rm -rf node_modules package-lock.json
npm install
\`\`\`

### Changes not appearing in browser

**Solutions:**
1. Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. Clear browser cache
3. Check if dev server is running
4. Restart dev server: Ctrl+C, then `npm run dev`

## Database Issues

### Error: "relation 'profiles' does not exist"

**Solution:**
\`\`\`bash
# Visit this URL in browser
http://localhost:3000/api/auth/init-db
\`\`\`

Or manually create tables using PostgreSQL extension in VS Code.

### Error: "duplicate key value violates unique constraint"

**Cause:** Trying to create account with existing email

**Solution:** Use a different email or login with existing account

### Can't connect to database

**Check:**
1. Database is active in Neon/Supabase dashboard
2. Connection string includes password
3. No firewall blocking connection
4. Internet connection is working

## VS Code Issues

### TypeScript errors everywhere

**Solutions:**
1. Reload VS Code: Ctrl+Shift+P → "Reload Window"
2. Restart TS Server: Ctrl+Shift+P → "TypeScript: Restart TS Server"
3. Delete `.next` folder and restart dev server

### Tailwind classes not working

**Solutions:**
1. Install Tailwind CSS IntelliSense extension
2. Reload VS Code
3. Check `app/globals.css` exists

### Prettier not formatting

**Solutions:**
1. Install Prettier extension
2. Set as default formatter: Ctrl+Shift+P → "Format Document With" → Prettier
3. Enable format on save in settings

## ESP32 Hardware Issues

### ESP32 not connecting to WiFi

**Check:**
1. Using 2.4GHz WiFi (ESP32 doesn't support 5GHz)
2. SSID and password are correct in code
3. WiFi is within range
4. No special characters in WiFi password

### Sensors not reading correctly

**Check:**
1. Wiring connections are correct
2. Sensors have power (3.3V or 5V as required)
3. Ground connections are secure
4. Pull-up resistor on temperature sensor (4.7kΩ)

### Data not showing on website

**Check:**
1. Server URL in ESP32 code is correct
2. ESP32 is connected to WiFi (check Serial Monitor)
3. API endpoint `/api/predict` is working
4. Check browser Network tab for incoming requests

## Environment Variable Issues

### "Environment variable is not set"

**Check:**
1. File is named exactly `.env.local` (with dot)
2. File is in root folder (same level as package.json)
3. No quotes around values
4. Restart dev server after creating/editing

**Correct format:**
\`\`\`env
DATABASE_URL=postgresql://user:pass@host/db
NEXTAUTH_SECRET=abc123
NEXTAUTH_URL=http://localhost:3000
\`\`\`

**Incorrect format:**
\`\`\`env
DATABASE_URL="postgresql://..."  # ❌ No quotes
DATABASE_URL = postgresql://...   # ❌ No spaces around =
\`\`\`

## Browser Issues

### Blank page or white screen

**Solutions:**
1. Check browser console (F12) for JavaScript errors
2. Clear browser cache and cookies
3. Try different browser
4. Check if dev server is running

### CSS not loading

**Solutions:**
1. Hard refresh: Ctrl+Shift+R
2. Check `app/globals.css` exists
3. Restart dev server
4. Clear .next folder: `rm -rf .next`

## Performance Issues

### Slow page loads

**Check:**
1. Database query performance
2. Large images being loaded
3. Too many API calls
4. Network connection speed

### High memory usage

**Solutions:**
1. Close other applications
2. Restart VS Code
3. Clear .next build cache
4. Limit open browser tabs

## Still Having Issues?

1. **Check all documentation:**
   - `QUICK_START.md`
   - `VSCODE_SETUP_GUIDE.md`
   - `DATABASE_SETUP_GUIDE.md`

2. **Verify system requirements:**
   - Node.js v18 or higher: `node -v`
   - npm v9 or higher: `npm -v`
   - Enough disk space (at least 500MB)

3. **Look for error messages:**
   - Terminal output (look for `[v0]` prefix)
   - Browser console (F12)
   - VS Code Problems panel (Ctrl+Shift+M)

4. **Start fresh:**
   \`\`\`bash
   # Stop server (Ctrl+C)
   # Delete dependencies
   rm -rf node_modules .next
   # Reinstall
   npm install
   # Restart
   npm run dev
   \`\`\`

Remember: Most issues are related to environment variables or database connection. Always check these first!
\`\`\`
