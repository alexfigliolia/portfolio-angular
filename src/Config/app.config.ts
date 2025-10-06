import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { LazyRoute } from 'Tools/LazyRoute';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideClientHydration(withEventReplay()),
  ],
};

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

export const LabsRoute = new LazyRoute({
  hash: 'labs',
  title: 'Labs',
  loaderFN: () => import('Routes/Labs').then((v) => v.Labs),
});

export const ContactRoute = new LazyRoute({
  hash: 'contact',
  title: 'Contact',
  loaderFN: () => import('Routes/Contact').then((v) => v.Contact),
});
