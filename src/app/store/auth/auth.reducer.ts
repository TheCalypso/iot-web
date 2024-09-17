import { createReducer, on } from '@ngrx/store';
import { User } from '../../interfaces/user';
import { AuthState } from '../interfaces/';
import * as authActions from './auth.actions';

export const initialState: AuthState = {
  profile: {},
  isLoggedIn: false
};

export const authReducer = createReducer(
  initialState,
  on(authActions.loginComplete, (state, { user }) => {
    return {
      ...state,
      profile: user,
      isLoggedIn: true
    };
  })
);

// selectors
export const selectUser = (state: any): User => state.auth.profile;
export const selectIsLoggedIn = (state: any): boolean => state.auth.isLoggedIn;
