import { Routes } from '@angular/router';
import { UrlComponent } from './components/url/url.component';
import { HomeComponent } from './components/home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: ':code', component: UrlComponent, pathMatch: 'full' },
];
