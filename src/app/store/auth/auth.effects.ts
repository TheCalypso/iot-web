import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { catchError, concatAll, concatMap, first, from, last, map, of, tap } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import * as authActions from './auth.actions';

@Injectable()
export class AuthEffects {
  constructor(
    private readonly actions$: Actions,
    private readonly authService: AuthService,
    private readonly router: Router,
    private readonly snackBar: MatSnackBar
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(authActions.login),
      concatMap(({ email, password }) =>
        from([this.authService.login(email, password), this.authService.getUserProfile()]).pipe(
          concatAll(),
          last(),
          map((user) => authActions.loginComplete({ user })),
          first(),
          catchError((error) => {
            return of(authActions.loginError({ error }));
          })
        )
      )
    )
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(authActions.logout),
        tap(() => AuthService.logout()),
        tap(() => {
          void this.router.navigate(['/login'], {
            queryParams: {
              originPage: this.router.routerState.snapshot.url
            }
          });
        })
      ),
    { dispatch: false }
  );
}
