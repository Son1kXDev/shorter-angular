import { AfterViewInit, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApiService } from './services/api.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  cookieService = inject(CookieService);
  apiService = inject(ApiService);

  constructor() {}

  ngAfterViewInit(): void {
    if (!this.cookieService.get('URLCookie')) {
      this.apiService.getToken().subscribe((response) => {
        this.cookieService.set('URLCookie', response.token);
      });
    }
  }
}
