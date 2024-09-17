import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  isLoading: boolean = true;

  constructor(private translate: TranslateService) {
    translate.setDefaultLang('fr');
    translate
      .use('fr')
      .pipe(takeUntilDestroyed())
      .subscribe(() => {
        this.isLoading = false;
      });
  }
}
