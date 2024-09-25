import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  private readonly baseUrl = 'https://api-shorter.danyatochka.ru/';

  getURL(code: string): Observable<string> {
    return this.http.get<string>(this.baseUrl + `url?code=${code}`);
  }

  generateUrl(url: string): Observable<string> {
    const formData = new FormData();
    formData.append('input', url);

    return this.http.post<string>(this.baseUrl + 'short_url', formData);
  }
}
