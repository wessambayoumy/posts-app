import { computed, inject, Injectable, signal } from '@angular/core';
import { Post } from '../../core/database/database.types';
import { FavoritesRepository } from '../data-access/favorites.repository';

@Injectable({ providedIn: 'root' })
export class FavoritesService {
  private readonly repository = inject(FavoritesRepository);

  readonly favorites = signal<Post[]>([]);
  readonly loading = signal<boolean>(false);
  readonly error = signal<string | null>(null);

  readonly favoriteIds = computed(() => new Set(this.favorites().map((item) => item.id)));
  readonly isEmpty = computed(() => !this.loading() && this.favorites().length === 0);

  constructor() {
    void this.getFavorites();
  }

  isFavorite(id: number): boolean {
    return this.favoriteIds().has(id);
  }

  async getFavorites(): Promise<Post[]> {
    this.loading.set(true);
    this.error.set(null);
    try {
      const items = await this.repository.getAll();
      this.favorites.set(items);
      return items;
    } catch {
      this.error.set('Unable to load favorites from local storage.');
      return this.favorites();
    } finally {
      this.loading.set(false);
    }
  }

  async toggleFavorite(post: Post): Promise<void> {
    this.error.set(null);
    const currentlyFavorite = this.isFavorite(post.id);

    // Optimistic signal update for immediate UI feedback
    if (currentlyFavorite) {
      this.favorites.update((current) => current.filter((item) => item.id !== post.id));
    } else {
      this.favorites.update((current) =>
        [...current.filter((item) => item.id !== post.id), { ...post }].sort((a, b) => a.id - b.id)
      );
    }

    try {
      if (currentlyFavorite) {
        await this.repository.remove(post.id);
      } else {
        await this.repository.add(post);
      }
      const persisted = await this.repository.getAll();
      this.favorites.set(persisted);
    } catch {
      // Revert on persistence error and reload persisted state
      await this.getFavorites();
      this.error.set('Unable to update favorite status.');
    }
  }
}
