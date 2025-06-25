import * as schema from "@shared/schema.js";

// Option 1: For Neon (serverless PostgreSQL)
import { Pool, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-serverless";
import ws from "ws";
neonConfig.webSocketConstructor = ws;
export const pool = new Pool({ connectionString: process.env.DATABASE_URL });
export const db = drizzle({ client: pool, schema });







// Option 2: For regular PostgreSQL (local, hosted, or cloud)
// import { Pool } from 'pg';
// import { drizzle } from 'drizzle-orm/node-postgres';

// if (!process.env.DATABASE_URL) {
//   throw new Error(
//     "DATABASE_URL must be set. Set it to your PostgreSQL connection string.",
//   );
// }

// export const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   // Optional: Add SSL configuration for hosted databases
//   ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
// });

// export const db = drizzle(pool, { schema });