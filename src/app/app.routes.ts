import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/posts/pages/posts-page/posts-page').then((m) => m.PostsPage),
  },
  {
    path: 'favorites',
    loadComponent: () =>
      import('./favorites/pages/favorites-page/favorites-page').then((m) => m.FavoritesPage),
  },
];