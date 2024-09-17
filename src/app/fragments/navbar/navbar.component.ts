import { Component, Input } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { Subject, Observable, of } from 'rxjs';
import * as sidebarActions from '../../store/sidebar/sidebar.actions';
import * as authActions from '../../store/auth/auth.actions';
import { User } from '../../interfaces/user';
import { selectUser } from '../../store/auth/auth.reducer';
import { selectSidebar } from '../../store/sidebar/sidebar.reducer';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {
  private readonly ngUnsubscribe = new Subject<void>();
  sidebar: boolean = false;
  user: User | undefined = undefined;
  handset$: Observable<boolean> = of(false);
  firstName: string | undefined;
  lastName: string | undefined;

  pageSize: number = 10;
  currentPage: number = 0;
  order: string = '';

  @Input() inputDrawer: any;
  @Input() handset: boolean = false;

  constructor(
    private readonly store: Store<{}>,
    private readonly router: Router,
    readonly title: Title
  ) {
    this.store
      .select((state) => selectSidebar(state).minimize)
      .pipe(takeUntilDestroyed())
      .subscribe((sidebar) => {
        this.sidebar = sidebar;
      });
    this.store
      .select((state) => selectUser(state))
      .pipe(takeUntilDestroyed())
      .subscribe((user) => {
        this.user = user;
        this.firstName = this.user?.first_name;
        this.lastName = this.user?.last_name;
      });
  }

  onToggleSidebar(): void {
    if (this.handset) {
      this.inputDrawer.toggle();
    } else {
      this.store.dispatch(sidebarActions.toggle());
    }
  }

  onLogout(): void {
    this.store.dispatch(authActions.logout());
  }
}
