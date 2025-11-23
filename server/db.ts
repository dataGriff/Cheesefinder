import * as schema from "@shared/schema";
import pkg from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL must be set. Did you forget to provision a database?",
  );
}

// Use different database drivers based on environment
let db: any;
let pool: any;

if (process.env.DEV_MODE === 'true' || process.env.NODE_ENV === 'development') {
  // Use standard PostgreSQL driver for local development
  pool = new Pool({ 
    connectionString: process.env.DATABASE_URL,
    ssl: false // Disable SSL for local development
  });
  db = drizzle({ client: pool, schema });
} else {
  // Use Neon serverless driver for production
  const { Pool: NeonPool, neonConfig } = await import('@neondatabase/serverless');
  const { drizzle: neonDrizzle } = await import('drizzle-orm/neon-serverless');
  const ws = await import("ws");
  
  neonConfig.webSocketConstructor = ws.default;
  pool = new NeonPool({ connectionString: process.env.DATABASE_URL });
  db = neonDrizzle({ client: pool, schema });
}

export { db, pool };
