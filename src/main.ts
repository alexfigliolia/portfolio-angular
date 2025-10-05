import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from 'Config/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err: unknown) => {
  console.error(err);
});
