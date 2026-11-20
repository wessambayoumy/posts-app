import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { Pressable, Text, View } from '@ng-native/components';

@Component({
  selector: 'app-root',
  imports: [RouterLink, RouterOutlet, Pressable, Text, View],
  host: { style: 'flex: 1' },
  template: `
    <view class="flex-1 bg-slate-100">
      <view class="flex-row items-center justify-between pt-10 pb-3 px-4 bg-white border-b border-slate-200">
        <text class="text-lg font-bold text-slate-900">Posts App</text>
        <view class="flex-row items-center gap-2">
          <pressable routerLink="/" class="px-3 py-1.5 rounded-lg bg-slate-900">
            <text class="text-sm font-medium text-white">Posts</text>
          </pressable>
          <pressable routerLink="/favorites" class="px-3 py-1.5 rounded-lg bg-slate-200">
            <text class="text-sm font-medium text-slate-800">Favorites</text>
          </pressable>
        </view>
      </view>
      <view class="flex-1">
        <router-outlet />
      </view>
    </view>
  `,
})
export class App {}
