import { Component, input, output } from '@angular/core';
import { Pressable, Text, View } from '@ng-native/components';
import { Post } from '../../models/post.model';

@Component({
  selector: 'app-post-card',
  imports: [Pressable, Text, View],
  template: `
    <view class="bg-white rounded-xl p-4 mb-3 border border-slate-200">
      <view class="flex-row items-start justify-between gap-3">
        <text class="flex-1 text-base font-bold text-slate-900">{{ post().title }}</text>
        <pressable
          (press)="toggleFavorite.emit(post())"
          class="px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200"
        >
          <text class="text-base font-bold text-amber-500">
            {{ isFavorite() ? '★' : '☆' }}
          </text>
        </pressable>
      </view>
      <text class="text-sm text-slate-600 mt-2 leading-5">{{ post().body }}</text>
      <text class="text-xs text-slate-400 mt-3">Post #{{ post().id }} · User {{ post().userId }}</text>
    </view>
  `,
})
export class PostCard {
  readonly post = input.required<Post>();
  readonly isFavorite = input<boolean>(false);
  readonly toggleFavorite = output<Post>();
}
