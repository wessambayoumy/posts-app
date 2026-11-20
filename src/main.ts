import { AppRegistry, Image, Platform, processColor } from 'react-native';
import { mount } from '@ng-native/platform';
import { provideNativeHttpClient } from '@ng-native/platform/http';
import { getFabricUIManager, registerPlatformComponents } from '@ng-native/fabric';
import { provideNativeRouter } from '@ng-native/router';
import tailwind from './../.angular-native/app.tailwind.js';
import { App } from './app/app';
import { routes } from './app/app.routes';

registerPlatformComponents(Platform.OS);

AppRegistry.registerRunnable('main', ({ rootTag }) => {
  mount(Number(rootTag), App, getFabricUIManager(), {
    globalStyles: tailwind,
    processColor,
    resolveAssetSource: (value) => Image.resolveAssetSource(value as never),
    providers: [
      provideNativeRouter(routes),
      provideNativeHttpClient(),
    ],
  });
});