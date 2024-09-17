import { createAction, props } from '@ngrx/store';
import { Credentials } from '../../interfaces/credentials';

export const login = createAction('[Auth] Login', props<Credentials>());
export const loginComplete = createAction('[Auth] Login complete', props<{ user: any }>());
export const loginError = createAction('[Auth] Login error', props<{ error: any }>());
export const logout = createAction('[Auth] Logout');
