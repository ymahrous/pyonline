# Connect to Your Own Database

## Quick Setup Guide

### 1. Database Options

**Option A: PostgreSQL (Recommended)**
- Local PostgreSQL server
- Hosted PostgreSQL (AWS RDS, Google Cloud SQL, DigitalOcean, etc.)
- Managed services (Supabase, PlanetScale, Railway, etc.)

**Option B: Neon (Serverless)**
- Already configured but commented out in `server/db.ts`

### 2. Set Your Database URL

Add your database connection string as an environment variable:

```bash
# For PostgreSQL format:
DATABASE_URL="postgresql://username:password@hostname:port/database_name"

# Examples:
# Local: postgresql://postgres:password@localhost:5432/python_learning
# Hosted: postgresql://user:pass@db.example.com:5432/mydb
# Supabase: postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres
```

### 3. Create Required Database Tables

Run this SQL in your database to create the necessary tables:

```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR UNIQUE NOT NULL,
  email VARCHAR UNIQUE NOT NULL,
  password VARCHAR NOT NULL,
  first_name VARCHAR,
  last_name VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table (required for authentication)
CREATE TABLE sessions (
  sid VARCHAR NOT NULL COLLATE "default",
  sess JSON NOT NULL,
  expire TIMESTAMP(6) NOT NULL,
  PRIMARY KEY (sid)
);
CREATE INDEX "IDX_session_expire" ON sessions (expire);

-- Lesson progress table
CREATE TABLE lesson_progress (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  lesson_id INTEGER NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, lesson_id)
);
```

### 4. Database Configuration

The app is currently configured for regular PostgreSQL. To switch to Neon:

1. Uncomment the Neon section in `server/db.ts`
2. Comment out the PostgreSQL section
3. Install Neon dependencies if needed

### 5. Environment Variables

Set these in your Replit Secrets or environment:

```
DATABASE_URL=your_database_connection_string
SESSION_SECRET=your_session_secret_key
```

### 6. Test Connection

After setting up, the app will automatically:
- Connect to your database on startup
- Create user sessions
- Track lesson progress
- Handle authentication

### Troubleshooting

**Connection Issues:**
- Verify your DATABASE_URL format
- Check if your database server is running
- Ensure your database accepts connections from Replit's IP

**SSL Issues:**
- For hosted databases, SSL is enabled automatically in production
- Local databases typically don't need SSL

**Permission Issues:**
- Ensure your database user has CREATE, INSERT, UPDATE, DELETE permissions
- Some hosted services require specific user roles