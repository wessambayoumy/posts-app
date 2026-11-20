import { inject, Injectable } from '@angular/core';
import { AppDatabase } from '../../../core/database/app.database';
import { Post, PostRow } from '../models/post.model';

@Injectable({ providedIn: 'root' })
export class PostsRepository {
  private readonly database = inject(AppDatabase);

  async getAll(): Promise<Post[]> {
    const db = await this.database.getDb();
    const rows = await db.getAllAsync<PostRow>(
      'SELECT id, userId, title, body FROM posts ORDER BY id ASC'
    );
    return rows.map((row) => ({
      id: row.id,
      userId: row.userId,
      title: row.title,
      body: row.body,
    }));
  }

  async replaceAll(posts: Post[]): Promise<void> {
    const db = await this.database.getDb();
    await db.withTransactionAsync(async () => {
      await db.runAsync('DELETE FROM posts');
      for (const post of posts) {
        await db.runAsync(
          'INSERT OR REPLACE INTO posts (id, userId, title, body) VALUES (?, ?, ?, ?)',
          [post.id, post.userId, post.title, post.body]
        );
      }
    });
  }
}
