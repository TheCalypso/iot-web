import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { selectIsLoggedIn } from '../store/auth/auth.reducer';
import { of } from 'rxjs';
import IOTLocalStorage from '../utils/local-storage';
import { AuthService } from '../services/auth.service';

const iotLocalStorage = new IOTLocalStorage();

export const isLoggedInGuard: CanActivateFn = (route, state) => {
  const accessToken = AuthService.accessToken;
  let isLoggedIn: boolean = false;
  const router = inject(Router);
  const store = inject(Store);

  store
    .select((state) => selectIsLoggedIn(state))
    .subscribe((_isLoggedIn) => {
      isLoggedIn = _isLoggedIn;
    });

  if (!isLoggedIn) {
    void router.navigate(['login'], {
      queryParams: {
        origin: state.url
      }
    });
  }
  return of(isLoggedIn && !!accessToken);
};
