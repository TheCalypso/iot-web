import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { of } from 'rxjs';
import { selectIsLoggedIn } from '../store/auth/auth.reducer';

export const notIsLoggedInGuard: CanActivateFn = (route, state) => {
  let isLoggedIn: boolean = false;
  const router = inject(Router);
  const store = inject(Store);

  store
    .select((state) => selectIsLoggedIn(state))
    .subscribe((_isLoggedIn) => {
      isLoggedIn = _isLoggedIn;
    });

  if (isLoggedIn) {
    void router.navigate(['']);
    return of(false);
  } else {
    return of(true);
  }
};
