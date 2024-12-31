import sqlite3 from "sqlite3";
import path from "path";

export const db = new sqlite3.Database(
  path.resolve(process.env.DATABASE_PATH ?? ""),
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.error("Error opening database:", err.message);
    } else {
      console.log("Connected to the database.");
    }
  }
);

export async function getDatabase() {
  return new Promise<void>((resolve, reject) => {
    db.exec(
      `
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        is_admin BOOLEAN DEFAULT FALSE, -- Nouvelle colonne pour le rôle admin
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        completed BOOLEAN DEFAULT FALSE,
        user_id INTEGER NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
      `,
      (err) => {
        if (err) {
          console.error("Error creating tables:", err.message);
          reject(err);
        } else {
          console.log("Tables created or already exist.");
          resolve();
        }
      }
    );
  });
}

export async function query(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error("Error executing query:", err.message);
        reject(err);
      } else {
        resolve(rows);
      }
    });
  });
}
