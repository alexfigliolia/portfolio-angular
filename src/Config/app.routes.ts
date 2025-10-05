import { Routes } from '@angular/router';
import { LazyRoute } from 'Tools/LazyRoute';

export const routes: Routes = [
  new LazyRoute({
    path: '',
    title: 'Home',
    loaderFN: () => import('Routes/Home').then((v) => v.Home),
  }),
  new LazyRoute({
    path: 'work',
    title: 'Work',
    loaderFN: () => import('Routes/Work').then((v) => v.Work),
  }),
];
