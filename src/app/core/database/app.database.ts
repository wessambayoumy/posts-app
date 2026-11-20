import { Injectable } from '@angular/core';
import * as SQLite from 'expo-sqlite';

const DB_NAME = 'posts.db';
const LATEST_VERSION = 1;

@Injectable({ providedIn: 'root' })
export class AppDatabase {
  private dbPromise: Promise<SQLite.SQLiteDatabase> | null = null;

  getDb(): Promise<SQLite.SQLiteDatabase> {
    if (!this.dbPromise) {
      this.dbPromise = this.initDatabase();
    }
    return this.dbPromise;
  }

  private async initDatabase(): Promise<SQLite.SQLiteDatabase> {
    const db = await SQLite.openDatabaseAsync(DB_NAME);
    const versionRow = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
    const currentVersion = versionRow?.user_version ?? 0;

    if (currentVersion < LATEST_VERSION) {
      await this.migrate(db, currentVersion, LATEST_VERSION);
    }

    return db;
  }

  private async migrate(db: SQLite.SQLiteDatabase, from: number, to: number): Promise<void> {
    await db.withTransactionAsync(async () => {
      if (from < 1) {
        await db.execAsync(`
          CREATE TABLE IF NOT EXISTS posts (
            id INTEGER PRIMARY KEY,
            userId INTEGER NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL
          );
          CREATE TABLE IF NOT EXISTS favorites (
            id INTEGER PRIMARY KEY,
            userId INTEGER NOT NULL,
            title TEXT NOT NULL,
            body TEXT NOT NULL
          );
        `);
      }
      await db.execAsync(`PRAGMA user_version = ${to};`);
    });
  }
}