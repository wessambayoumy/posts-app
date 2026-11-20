import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { MOCK_POSTS } from '../data-access/mock-posts';
import { PostsRepository } from '../data-access/posts.repository';
import { Post } from '../models/post.model';
import { ConnectivityService } from '../../../core/database/services/connectivity.service';

const POSTS_API_URL = 'https://jsonplaceholder.typicode.com/posts';

@Injectable({ providedIn: 'root' })
export class PostsService {
  private readonly http = inject(HttpClient);
  private readonly repository = inject(PostsRepository);
  private readonly connectivity = inject(ConnectivityService);

  readonly posts = signal<Post[]>([]);
  readonly loading = signal<boolean>(false);
  readonly refreshing = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly isOfflineMode = signal<boolean>(false);

  readonly isEmpty = computed(() => !this.loading() && this.posts().length === 0);

  async loadPosts(forceRefresh = false, useMockFallback = false): Promise<void> {
    if (forceRefresh) {
      this.refreshing.set(true);
    } else {
      this.loading.set(true);
    }
    this.error.set(null);

    const cached = await this.repository.getAll();
    if (cached.length > 0 && !forceRefresh) {
      this.posts.set(cached);
    }

    const canReachNetwork = await this.connectivity.refreshStatus();
    if (!canReachNetwork) {
      this.isOfflineMode.set(true);
      if (cached.length > 0) {
        this.posts.set(cached);
        this.error.set(null);
      } else if (useMockFallback) {
        this.posts.set(MOCK_POSTS);
        this.error.set('Offline with empty cache. Showing mock posts.');
      } else {
        this.error.set('No internet connection and no cached posts available.');
      }
      this.loading.set(false);
      this.refreshing.set(false);
      return;
    }

    try {
      const remotePosts = await firstValueFrom(this.http.get<Post[]>(POSTS_API_URL));
      await this.repository.replaceAll(remotePosts);
      const updated = await this.repository.getAll();
      this.posts.set(updated);
      this.isOfflineMode.set(false);
      this.error.set(null);
    } catch {
      this.isOfflineMode.set(true);
      const fallback = cached.length > 0 ? cached : await this.repository.getAll();
      if (fallback.length > 0) {
        this.posts.set(fallback);
        this.error.set('Unable to reach server. Showing cached posts.');
      } else if (useMockFallback) {
        this.posts.set(MOCK_POSTS);
        this.error.set('Unable to reach server. Showing mock posts.');
      } else {
        this.error.set('Unable to load posts. Check your connection and try again.');
      }
    } finally {
      this.loading.set(false);
      this.refreshing.set(false);
    }
  }

  async refresh(useMockFallback = false): Promise<void> {
    await this.loadPosts(true, useMockFallback);
  }

  loadMockPosts(): void {
    this.posts.set(MOCK_POSTS);
    this.error.set(null);
  }
}
