import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

// Lazy singleton — connection is not opened until first use.
// This prevents crashes when test files import from @/lib/db in environments
// where DATABASE_URL is not set (e.g. unit tests that mock the DB layer).
let _db: ReturnType<typeof drizzle> | null = null;

export function getDb() {
  if (!_db) {
    const client = postgres(process.env.DATABASE_URL!);
    _db = drizzle(client, { schema });
  }
  return _db;
}

// Convenience re-export for code that calls db.query / db.select directly.
// Usage: import { db } from "@/lib/db"
// In tests that don't hit the DB, this is never called so no crash.
export const db = new Proxy({} as ReturnType<typeof drizzle>, {
  get(_target, prop) {
    return (getDb() as never)[prop as never];
  },
});
