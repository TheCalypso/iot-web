import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from '../interfaces/user';
import { Tokens } from '../interfaces/tokens';
import GPZLocalStorage from '../utils/local-storage';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = environment.backendUrl;
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(
    private readonly http: HttpClient,
    private readonly store: Store<{}>
  ) {
    const hasToken = Boolean(AuthService.accessToken);
    this.loggedIn.next(hasToken);
  }

  static gpzLocalStorage: GPZLocalStorage = new GPZLocalStorage();

  static get accessToken(): string {
    return AuthService.gpzLocalStorage.getItem(environment.ACCESS_TOKEN) ?? '';
  }

  static set accessToken(token: string) {
    AuthService.gpzLocalStorage.saveItem(environment.ACCESS_TOKEN, token);
  }

  static get refreshToken(): string {
    return AuthService.gpzLocalStorage.getItem(environment.REFRESH_TOKEN) ?? '';
  }

  static set refreshToken(token: string) {
    AuthService.gpzLocalStorage.saveItem(environment.REFRESH_TOKEN, token);
  }

  static logout(): void {
    AuthService.gpzLocalStorage.delete(environment.ACCESS_TOKEN);
    AuthService.gpzLocalStorage.delete(environment.REFRESH_TOKEN);
  }

  login(email: string, password: string): Observable<Tokens> {
    const headers = new HttpHeaders().set('content-type', 'application/json');
    return this.http.post<Tokens>(`${this.apiUrl}/token/`, { email, password }, { headers }).pipe(
      map((tokens) => {
        AuthService.accessToken = tokens.access;
        AuthService.refreshToken = tokens.refresh;
        return tokens;
      })
    );
  }

  getUserProfile(): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/users/me/`).pipe(map((user) => user));
  }

  refreshAccessToken(refresh: string = AuthService.refreshToken): Observable<{ access_token: string }> {
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/token/refresh/`, { refresh }).pipe(
      map((token) => {
        if (token && token.access_token) {
          AuthService.accessToken = token.access_token;
        }
        return token;
      }),
      catchError((error) => {
        throw error;
      })
    );
  }
}
