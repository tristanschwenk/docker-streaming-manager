import Database from "better-sqlite3";

export default defineEventHandler((event) => {
  const dbPath = process.env.DATABASE_PATH || "./auth.db";
  
  try {
    const db = new Database(dbPath);
    const stmt = db.prepare("SELECT COUNT(*) as count FROM user");
    const result = stmt.get() as { count: number };
    return { 
      hasUsers: (result?.count ?? 0) > 0 
    };
  } catch (e) {
    return { 
      hasUsers: false 
    };
  }
});
