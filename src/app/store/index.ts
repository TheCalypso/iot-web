import { Action, ActionReducer, ActionReducerMap, MetaReducer } from '@ngrx/store';
import { logout } from './auth/auth.actions';
import { authReducer } from './auth/auth.reducer';
import { AppState } from './interfaces';
import { sidebarReducer } from './sidebar/sidebar.reducer';
import IOTLocalStorage from '../utils/local-storage';

export const reducers: ActionReducerMap<any> = {
  sidebar: sidebarReducer,
  auth: authReducer
};

const iotLocalStorage = new IOTLocalStorage();

function localStorageSyncReducer(reducer: ActionReducer<any>): ActionReducer<any> {
  return function (state, action) {
    const newState = reducer(state, action);

    // Si c'est l'action INIT d'ngrx (qui signifie que le store est en train de s'initialiser),
    // nous pourrions vouloir charger l'état du localStorage.
    if (action.type === '@ngrx/store/init') {
      const loadedState = {
        sidebar: iotLocalStorage.getObject('sidebar') || state.sidebar,
        auth: iotLocalStorage.getObject('auth') || state.auth
      };
      return { ...state, ...loadedState };
    }

    iotLocalStorage.saveObject('sidebar', newState.sidebar);
    iotLocalStorage.saveObject('auth', newState.auth);

    return newState;
  };
}

export function logoutMetareducer(reducer: ActionReducer<AppState>) {
  return function (state: AppState, action: Action) {
    if (action.type === logout.type) {
      return reducer(undefined, action);
    }
    return reducer(state, action);
  };
}

export const metaReducers: Array<MetaReducer<any>> = [logoutMetareducer, localStorageSyncReducer];
