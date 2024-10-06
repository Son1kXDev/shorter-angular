import { inject, Injectable } from '@angular/core';
import {
  HTTP_INTERCEPTORS,
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';

import { ApiService } from '../services/api.service';

import { Observable, take, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private apiService: ApiService = inject(ApiService);
  private isRefreshing = false;

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    req = req.clone({
      withCredentials: true,
    });

    return next.handle(req).pipe(
      catchError((error) => {
        if (
          error instanceof HttpErrorResponse &&
          (error.status === 401 ||
            error.error.message === 'missing or malformed jwt')
        ) {
          return this.handle401Error(req, next);
        }

        return throwError(() => error);
      }),
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return this.apiService.getToken().pipe(
        switchMap((tokenResponse) => {
          this.isRefreshing = false;

          const newRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${tokenResponse.token}`,
            },
          });

          return next.handle(newRequest);
        }),
        catchError((error) => {
          this.isRefreshing = false;

          return throwError(() => error);
        }),
      );
    } else {
      return this.apiService.getToken().pipe(
        take(1),
        switchMap((tokenResponse) => {
          const newRequest = request.clone({
            setHeaders: {
              Authorization: `Bearer ${tokenResponse.token}`, // Извлекаем token
            },
          });
          return next.handle(newRequest);
        }),
      );
    }
  }
}

export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: HttpRequestInterceptor, multi: true },
];
