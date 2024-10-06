import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, take, tap } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  http = inject(HttpClient);
  cookieService = inject(CookieService);
  private tokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);
  private readonly baseUrl = 'https://api-shorter.danyatochka.ru/';

  constructor() {
    const token = this.cookieService.get('token');
    if (token) {
      this.tokenSubject.next(token);
    }
  }

  getToken(): Observable<{ token: string }> {
    return this.http
      .get<{ token: string }>(this.baseUrl, {
        withCredentials: true,
      })
      .pipe(
        tap((response) => {
          this.cookieService.set('token', response.token);
          this.tokenSubject.next(response.token);
        }),
      );
  }

  getURL(code: string): Observable<string> {
    return this.tokenSubject.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<string>(this.baseUrl + `jwt/url?code=${code}`, {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        });
      }),
    );
  }

  generateUrl(url: string): Observable<string> {
    const formData = new FormData();
    formData.append('input', url);

    return this.tokenSubject.pipe(
      take(1),
      switchMap((token) => {
        return this.http.post<string>(this.baseUrl + 'jwt/url', formData, {
          headers: new HttpHeaders({
            Authorization: 'Bearer ' + token,
          }),
        });
      }),
    );
  }
}
