import { Routes } from '@angular/router';
import { AppComponent } from './app.component';
import { UrlComponent } from './components/url/url.component';

export const routes: Routes = [
  { path: '', component: AppComponent },
  { path: ':code', component: UrlComponent },
];
