import { inject, Injectable } from '@angular/core';
import { AppDatabase } from '../../core/database/app.database';
import { Post, PostRow } from '../../core/database/database.types';

@Injectable({ providedIn: 'root' })
export class FavoritesRepository {
  private readonly database = inject(AppDatabase);

  async getAll(): Promise<Post[]> {
    const db = await this.database.getDb();
    const rows = await db.getAllAsync<PostRow>(
      'SELECT id, userId, title, body FROM favorites ORDER BY id ASC'
    );
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      title: row.title,
      body: row.body,
    }));
  }

  async add(post: Post): Promise<void> {
    const db = await this.database.getDb();
    await db.runAsync(
      'INSERT OR REPLACE INTO favorites (id, userId, title, body) VALUES (?, ?, ?, ?)',
      [post.id, post.userId, post.title, post.body]
    );
  }

  async remove(id: number): Promise<void> {
    const db = await this.database.getDb();
    await db.runAsync('DELETE FROM favorites WHERE id = ?', [id]);
  }
}
