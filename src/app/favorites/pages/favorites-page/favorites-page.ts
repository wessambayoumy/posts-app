import { Component, inject, OnInit } from '@angular/core';
import { ScrollView, Text, View } from '@ng-native/components';
import { Post } from '../../../core/database/database.types';
import { PostCard } from '../../../features/posts/components/post-card/post-card';
import { FavoritesService } from '../../services/favorites.service';

@Component({
  selector: 'app-favorites-page',
  imports: [PostCard, ScrollView, Text, View],
  host: { style: 'flex: 1' },
  template: `
    <view style="flex: 1" class="bg-slate-100">
      @if (favoritesService.error(); as err) {
        <view class="mx-4 mt-3 px-3.5 py-2.5 rounded-lg bg-red-50 border border-red-200">
          <text class="text-xs font-medium text-red-800">{{ err }}</text>
        </view>
      }

      @if (favoritesService.loading() && favoritesService.favorites().length === 0) {
        <view style="flex: 1" class="px-6 items-center justify-center">
          <text class="text-sm font-medium text-slate-600">Loading favorites...</text>
        </view>
      } @else if (favoritesService.isEmpty()) {
        <view style="flex: 1" class="px-6 items-center justify-center">
          <text class="text-base font-semibold text-slate-700">No favorites yet</text>
          <text class="text-xs text-slate-500 mt-1 text-center">
            Tap the star on any post to save it offline.
          </text>
        </view>
      } @else {
        <scroll-view style="flex: 1" contentContainerStyle="padding: 12px 16px 24px 16px;">
          @for (post of favoritesService.favorites(); track post.id) {
            <app-post-card
              [post]="post"
              [isFavorite]="true"
              (toggleFavorite)="onRemoveFavorite($event)"
            />
          }
        </scroll-view>
      }
    </view>
  `,
})
export class FavoritesPage implements OnInit {
  protected readonly favoritesService = inject(FavoritesService);

  ngOnInit(): void {
    void this.favoritesService.getFavorites();
  }

  onRemoveFavorite(post: Post): void {
    void this.favoritesService.toggleFavorite(post);
  }
}
