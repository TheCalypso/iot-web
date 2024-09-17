import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { selectSidebar } from '../../store/sidebar/sidebar.reducer';
import { TranslateService } from '@ngx-translate/core';

type Element = {
  icon: string;
  text: string;
  routerLink: string;
  exact: boolean;
};

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  elements: Element[] = [
    {
      icon: 'cottage',
      text: 'sidebar.home',
      routerLink: '',
      exact: true
    }
  ];

  sidebar$: Observable<boolean>;

  constructor(
    private readonly store: Store<{}>,
    private readonly translate: TranslateService
  ) {
    this.sidebar$ = this.store.select((state) => selectSidebar(state).minimize);
  }
}
