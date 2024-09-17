import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class BreakpointService {
  private readonly breakpointSubject: BehaviorSubject<string> = new BehaviorSubject<string>('' as string);
  destroyed = new Subject<void>();

  displayNameMap = new Map([
    [Breakpoints.XSmall, 'XSmall'],
    [Breakpoints.Small, 'Small'],
    [Breakpoints.Medium, 'Medium'],
    [Breakpoints.Large, 'Large'],
    [Breakpoints.XLarge, 'XLarge']
  ]);

  constructor(breakpointObserver: BreakpointObserver) {
    breakpointObserver
      .observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Medium, Breakpoints.Large, Breakpoints.XLarge])
      .pipe(takeUntil(this.destroyed))
      .subscribe((result) => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            this.SetBreakpoint(this.displayNameMap.get(query) as string);
          }
        }
      });
  }

  public get Data(): Observable<string> {
    return this.breakpointSubject.asObservable();
  }

  SetBreakpoint(value: string): void {
    this.breakpointSubject.next(value);
  }
}

export const isHandset = (value: string | undefined): Observable<boolean> => {
  switch (value) {
    case 'XSmall':
      return of(true);
    case 'Small':
      return of(true);
    default:
      return of(false);
  }
};
