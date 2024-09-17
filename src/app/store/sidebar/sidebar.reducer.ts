import { createReducer, on } from '@ngrx/store';
import { Sidebar } from '../interfaces';
import * as sidebarActions from './sidebar.actions';

export const initialState: Sidebar = {
  minimize: true
};

export const sidebarReducer = createReducer(
  initialState,
  on(sidebarActions.toggle, (state) => {
    return { minimize: !state.minimize };
  }),
  on(sidebarActions.close, () => {
    return { minimize: false };
  }),
  on(sidebarActions.open, () => {
    return { minimize: true };
  })
);

// selectors
export const selectSidebar = (state: any): Sidebar => state.sidebar;
