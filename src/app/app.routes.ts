import { Routes } from '@angular/router';
import { LazyRoute } from 'Tools/LazyRoute';

export const routes: Routes = [new LazyRoute('', () => import('Routes/Home').then((v) => v.Home))];
