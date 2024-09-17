import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, Subject, map, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { BreakpointService, isHandset } from '../../services/breakpoint.service';

@Component({
  selector: 'app-site-layout',
  templateUrl: './site-layout.component.html',
  styleUrls: ['./site-layout.component.scss']
})
export class SiteLayoutComponent {
  title = 'gaspezia-members-web';
  breakpointObservable$: Observable<string>;
  handset$: Observable<boolean> = of(false);
  isLoggedIn$: Observable<boolean>;
  handset: boolean = false;
  pageName: string = '/';
  destroyed = new Subject<void>();

  constructor(
    private readonly store: Store<{}>,
    breakpointService: BreakpointService,
    private readonly router: Router,
    private readonly dialog: MatDialog,
    private readonly authService: AuthService
  ) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.dialog.closeAll();
        this.pageName = event.url.split('?')[0];
      }
    });
    this.breakpointObservable$ = breakpointService.Data;
    this.breakpointObservable$.subscribe({
      next: (value) => {
        this.handset$ = isHandset(value);
        this.handset$.subscribe({
          next: (val: any) => {
            this.handset = val;
          },
          error: (err: any) => console.error(err)
        });
      },
      error: (err) => console.error(err)
    });
  }
}
