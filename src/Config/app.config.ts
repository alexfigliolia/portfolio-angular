import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { ContentPreloader } from 'Tools/ContentPreloader';
import { LazyRoute } from 'Tools/LazyRoute';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
  ],
};

export const PreloadPromise = ContentPreloader.initialize();

export const HomeRoute = new LazyRoute({
  hash: '',
  title: 'Home',
  loaderFN: () => import('Routes/Home').then((v) => v.Home),
});

export const WorkRoute = new LazyRoute({
  hash: 'work',
  title: 'Work',
  loaderFN: () => import('Routes/Work').then((v) => v.Work),
});
