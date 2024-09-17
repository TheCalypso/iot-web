import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, filter, switchMap, take, throwError } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { AuthState } from '../store/interfaces';
import * as authActions from '../store/auth/auth.actions';
import { Store } from '@ngrx/store';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private refreshTokenInProgress = false;
  private readonly refreshTokenSubject = new BehaviorSubject<any>(null);
  auth$: Observable<AuthState>;

  constructor(
    private readonly authService: AuthService,
    private readonly store: Store<{ auth: AuthState }>
  ) {
    this.auth$ = store.select('auth');
  }

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.startsWith(environment.backendUrl) && AuthService.accessToken !== '') {
      request = this.setHeaders(request);

      return next.handle(request).pipe(
        catchError((err) => {
          if (
            err instanceof HttpErrorResponse &&
            (err.status === 403 || // forbidden
              request.url.startsWith(environment.backendUrl + '/token/')) // api token routes
          ) {
            // forbidden request
          } else if (err instanceof HttpErrorResponse && err.status === 401) {
            return this.handle401Error(request, next);
          }
          return throwError(() => err);
        })
      );
    }
    return next.handle(request);
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.refreshTokenInProgress) {
      this.refreshTokenInProgress = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshAccessToken().pipe(
        switchMap((token) => {
          this.refreshTokenInProgress = false;
          this.refreshTokenSubject.next(token);
          return next.handle(this.setHeaders(request));
        }),
        catchError((err) => {
          this.refreshTokenInProgress = false;
          this.store.dispatch(authActions.logout());
          return throwError(() => err);
        })
      );
    }
    return this.refreshTokenSubject.pipe(
      filter((value) => value != null),
      take(1),
      switchMap(() => next.handle(this.setHeaders(request)))
    );
  }

  private setHeaders(request: HttpRequest<any>): HttpRequest<any> {
    return request.clone({
      setHeaders: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${AuthService.accessToken}`
      }
    });
  }
}
