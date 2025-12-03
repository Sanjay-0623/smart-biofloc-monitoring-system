# Database Setup Guide for Visual Studio Code

## Prerequisites

1. **Install Visual Studio Code**: https://code.visualstudio.com/
2. **Install Node.js**: https://nodejs.org/ (version 18 or higher)
3. **PostgreSQL Database**: You need access to Neon or any PostgreSQL database

## Method 1: Automatic Setup (Recommended)

The database automatically initializes when you first sign up on the website. No manual setup needed!

Just:
1. Run the project: `npm run dev`
2. Go to the signup page
3. Create an account
4. The database tables are created automatically

## Method 2: Manual Setup in VS Code

### Step 1: Download and Setup Project

1. **Download the project from v0**:
   - Click three dots (⋮) in top right
   - Select "Download ZIP"
   - Extract to a folder

2. **Open in VS Code**:
   - Open VS Code
   - File → Open Folder
   - Select the extracted project folder

3. **Install Dependencies**:
   - Open Terminal in VS Code (`Ctrl + ~` or `View → Terminal`)
   - Run:
     \`\`\`bash
     npm install
     \`\`\`

### Step 2: Configure Environment Variables

1. **Create `.env.local` file** in the project root:
   \`\`\`env
   # Neon Database (you can also use Supabase or any PostgreSQL)
   DATABASE_URL=postgresql://user:password@host/database
   
   # NextAuth (for authentication)
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-secret-here
   
   # Optional: Hugging Face for AI disease detection
   HUGGINGFACE_API_KEY=your-huggingface-api-key
   \`\`\`

2. **Get your DATABASE_URL**:

   **Option A: From Vercel (if you deployed to Vercel)**
   - Go to your Vercel project
   - Settings → Environment Variables
   - Copy the `DATABASE_URL`

   **Option B: From Neon directly**
   - Go to https://neon.tech/
   - Create a new project
   - Copy the connection string from the dashboard
   - Format: `postgresql://username:password@host/database`

   **Option C: From Supabase**
   - Go to https://supabase.com/
   - Project Settings → Database
   - Copy the "Connection string" (URI format)

### Step 3: Run Database Setup

**Option A: Using the Built-in API (Easiest)**
1. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Open your browser to: http://localhost:3000/api/auth/init-db

3. You should see: `{"success": true, "message": "Database initialized"}`

**Option B: Using PostgreSQL Client in VS Code**

1. **Install PostgreSQL Extension**:
   - In VS Code, go to Extensions (Ctrl+Shift+X)
   - Search "PostgreSQL" by Chris Kolkman
   - Install it

2. **Connect to Database**:
   - Press F1 → Type "PostgreSQL: Add Connection"
   - Enter your database details from DATABASE_URL

3. **Run SQL Scripts**:
   - Open `scripts/001_create_profiles_neon.sql`
   - Right-click → "Run Query"
   - Then open `scripts/002_create_fish_disease_detections_neon.sql`
   - Right-click → "Run Query"

**Option C: Using Command Line**

If you have `psql` installed:
\`\`\`bash
# Connect to your database
psql "postgresql://user:password@host/database"

# Run the setup scripts
\i scripts/001_create_profiles_neon.sql
\i scripts/002_create_fish_disease_detections_neon.sql
\`\`\`

### Step 4: Verify Database Setup

1. **Check if tables were created**:
   - Option 1: Visit http://localhost:3000/api/auth/session
   - Should return: `{"authenticated": false}`
   
2. **Or use VS Code PostgreSQL Extension**:
   - Open database connection
   - Expand "Tables"
   - You should see: `profiles` and `fish_disease_detections`

### Step 5: Create Admin User (Optional)

To create an admin account:

1. **Create a regular account** through the signup page

2. **Upgrade to admin** using SQL:
   \`\`\`sql
   UPDATE profiles 
   SET role = 'admin' 
   WHERE email = 'your-email@example.com';
   \`\`\`

## Database Schema

### profiles table
- `id` - Unique user ID (TEXT)
- `email` - User email (TEXT, UNIQUE)
- `password_hash` - Hashed password (TEXT)
- `full_name` - User's full name (TEXT)
- `role` - 'user' or 'admin' (TEXT)
- `created_at` - Account creation timestamp
- `updated_at` - Last update timestamp

### fish_disease_detections table
- `id` - Detection ID (UUID)
- `user_id` - Reference to profiles.id (TEXT)
- `image_url` - Uploaded image URL (TEXT)
- `detected_disease` - Disease name (TEXT)
- `confidence` - Detection confidence 0-100 (NUMERIC)
- `treatment_recommendation` - Treatment advice (TEXT)
- `created_at` - Detection timestamp

## Troubleshooting

### Error: "DATABASE_URL environment variable is not set"
- Make sure `.env.local` exists with DATABASE_URL
- Restart the dev server: `npm run dev`

### Error: "relation 'profiles' does not exist"
- Run the database initialization: http://localhost:3000/api/auth/init-db
- Or manually run the SQL scripts

### Connection timeout
- Check your database is running
- Verify DATABASE_URL format is correct
- Check firewall/network settings

### Can't connect to Neon database
- Neon requires internet connection
- Check if your IP is allowed (Neon allows all by default)
- Verify connection string has correct credentials

## Running the Project

After database setup:

\`\`\`bash
# Development mode
npm run dev

# Open in browser
http://localhost:3000
\`\`\`

## Next Steps

1. Create an account on the signup page
2. Upload fish images for disease detection
3. Monitor water quality with sensor data
4. Access admin dashboard (if you set role to 'admin')

## Need Help?

- Check the main README.md for project documentation
- Verify all environment variables are set correctly
- Make sure Node.js version is 18 or higher: `node --version`
