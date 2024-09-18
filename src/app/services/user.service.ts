import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject, map } from 'rxjs';
import { User } from '../interfaces/user';
import { environment } from '../../environments/environment';
//import { FetchSettings } from '../interfaces/table';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly apiUrl = environment.backendUrl;
  private userSubject = new BehaviorSubject<User | null>(null);
  private userSavedSubject = new Subject<void>();
  userSaved$ = this.userSavedSubject.asObservable();
  userToView$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  //   getUsers(settings: FetchSettings, filters: {}): Observable<{ data: User[]; count: number }> {
  //     return this.http
  //       .get<{ data: User[]; count: number }>(`${this.apiUrl}/users/`, {
  //         params: {
  //           order: settings.order,
  //           page: settings.currentPage,
  //           size: settings.pageSize,
  //           ...filters
  //         }
  //       })
  //       .pipe(map((result) => result));
  //   }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users/`, user).pipe(map((result) => result));
  }

  updateUser(userId: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${userId}/`, user).pipe(map((result) => result));
  }

  partialUpdateUser(userId: number, user: User): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/users/${userId}/`, user).pipe(map((result) => result));
  }

  deleteUser(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/users/${userId}/`);
  }

  selectUser(user: User | null | undefined): void {
    if (user === undefined) {
      this.userSubject.next(null);
      return;
    }
    user ??= {};
    this.userSubject.next(user);
  }

  savedUser(): void {
    this.userSavedSubject.next();
  }
}
