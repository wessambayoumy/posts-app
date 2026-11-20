import { Component, computed, inject, signal } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { Pressable, Text, View } from '@ng-native/components';
import { filter } from 'rxjs';
import { FavoritesService } from './favorites/services/favorites.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Pressable, Text, View],
  host: { style: 'flex: 1' },
  template: `
    <view style="flex: 1" class="bg-slate-100">
      <view class="flex-row items-center justify-between pt-10 pb-3 px-4 bg-white border-b border-slate-200">
        <text class="text-lg font-bold text-slate-900">Posts App</text>
        <view class="flex-row items-center gap-2">
          <pressable
            (press)="navigate('/')"
            [class]="isPostsActive() ? activeBtnClass : inactiveBtnClass"
          >
            <text [class]="isPostsActive() ? activeTextClass : inactiveTextClass">
              Posts
            </text>
          </pressable>
          <pressable
            (press)="navigate('/favorites')"
            [class]="isFavoritesActive() ? activeBtnClass : inactiveBtnClass"
          >
            <text [class]="isFavoritesActive() ? activeTextClass : inactiveTextClass">
              Favorites ({{ favoritesService.favorites().length }})
            </text>
          </pressable>
        </view>
      </view>
      <view style="flex: 1">
        <router-outlet />
      </view>
    </view>
  `,
})
export class App {
  private readonly router = inject(Router);
  protected readonly favoritesService = inject(FavoritesService);

  private readonly currentUrl = signal<string>(this.router.url || '/');

  protected readonly isFavoritesActive = computed(() =>
    this.currentUrl().startsWith('/favorites')
  );
  protected readonly isPostsActive = computed(() => !this.isFavoritesActive());

  protected readonly activeBtnClass = 'px-3 py-1.5 rounded-lg bg-slate-900';
  protected readonly inactiveBtnClass = 'px-3 py-1.5 rounded-lg bg-slate-200';
  protected readonly activeTextClass = 'text-sm font-medium text-white';
  protected readonly inactiveTextClass = 'text-sm font-medium text-slate-800';

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.currentUrl.set(event.urlAfterRedirects || event.url);
      });
  }

  navigate(path: string): void {
    this.currentUrl.set(path);
    void this.router.navigateByUrl(path);
  }
}
