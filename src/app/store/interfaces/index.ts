import { User } from '../../interfaces/user';

export interface AppState {
  auth: AuthState;
  sidebar: Sidebar;
}

export interface Sidebar {
  minimize: boolean;
}

export interface AuthState {
  profile: User | {};
  isLoggedIn: boolean;
}
