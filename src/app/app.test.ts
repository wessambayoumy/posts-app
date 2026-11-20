import { provideNativeRouter } from '@ng-native/router';
import { render } from '@ng-native/testing';
import { describe, expect, it } from 'vitest';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  it('renders the root component', () => {
    const view = render(App, {
      providers: [provideNativeRouter(routes)],
    });

    expect(view).toBeTruthy();
  });
});