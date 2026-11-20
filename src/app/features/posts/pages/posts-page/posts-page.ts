import { Component, inject, OnInit } from '@angular/core';
import { Pressable, ScrollView, Text, View } from '@ng-native/components';
import { FavoritesService } from '../../../../favorites/services/favorites.service';
import { PostCard } from '../../components/post-card/post-card';
import { Post } from '../../models/post.model';
import { PostsService } from '../../services/posts.service';

@Component({
  selector: 'app-posts-page',
  imports: [PostCard, Pressable, ScrollView, Text, View],
  host: { style: 'flex: 1' },
  template: `
    <view style="flex: 1" class="bg-slate-100">
      <view class="flex-row items-center justify-between px-4 py-2.5 bg-slate-200 border-b border-slate-300">
        <text class="text-xs font-semibold text-slate-700">
          Status: {{ postsService.isOfflineMode() ? 'Offline / Cached' : 'Online' }}
        </text>
        <pressable
          (press)="onRefresh()"
          [disabled]="postsService.refreshing()"
          class="px-3 py-1.5 rounded-lg bg-blue-600"
        >
          <text class="text-xs font-semibold text-white">
            {{ postsService.refreshing() ? 'Refreshing...' : 'Refresh' }}
          </text>
        </pressable>
      </view>

      @if (postsService.error(); as err) {
        <view class="mx-4 mt-3 px-3.5 py-2.5 rounded-lg bg-amber-50 border border-amber-300">
          <text class="text-xs font-medium text-amber-900">{{ err }}</text>
        </view>
      }

      @if (postsService.loading() && postsService.posts().length === 0) {
        <view style="flex: 1" class="px-6 items-center justify-center">
          <text class="text-sm font-medium text-slate-600">Loading posts...</text>
        </view>
      } @else if (postsService.isEmpty()) {
        <view style="flex: 1" class="px-6 items-center justify-center">
          <text class="text-sm font-semibold text-slate-700 text-center">
            No posts available right now.
          </text>
          <pressable (press)="onRefresh()" class="mt-3 px-4 py-2 rounded-lg bg-slate-900">
            <text class="text-xs font-semibold text-white">Try Again</text>
          </pressable>
        </view>
      } @else {
        <scroll-view style="flex: 1" contentContainerStyle="padding: 12px 16px 24px 16px;">
          @for (post of postsService.posts(); track post.id) {
            <app-post-card
              [post]="post"
              [isFavorite]="favoritesService.isFavorite(post.id)"
              (toggleFavorite)="onToggleFavorite($event)"
            />
          }
        </scroll-view>
      }
    </view>
  `,
})
export class PostsPage implements OnInit {
  protected readonly postsService = inject(PostsService);
  protected readonly favoritesService = inject(FavoritesService);

  ngOnInit(): void {
    void this.postsService.loadPosts(false, true);
    void this.favoritesService.getFavorites();
  }

  onRefresh(): void {
    void this.postsService.refresh(true);
  }

  onToggleFavorite(post: Post): void {
    void this.favoritesService.toggleFavorite(post);
  }
}
