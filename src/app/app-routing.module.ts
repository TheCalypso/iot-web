import { Injectable, NgModule } from '@angular/core';
import { RouterModule, RouterStateSnapshot, Routes, TitleStrategy } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { notIsLoggedInGuard } from './guards/not-is-logged-in.guard';
import { isLoggedInGuard } from './guards/is-logged-in.guard';
import { SiteLayoutComponent } from './layout/site-layout/site-layout.component';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

const routes: Routes = [
  {
    path: '',
    component: SiteLayoutComponent,
    children: [{ path: '', component: HomeComponent, title: 'sidebar.home', canActivate: [isLoggedInGuard] }]
  },
  {
    path: '',
    component: BaseLayoutComponent,
    children: [
      { path: 'login', component: LoginComponent, title: 'Login', canActivate: [notIsLoggedInGuard] },
      { path: '**', redirectTo: '' }
    ]
  }
];

@Injectable()
export class TemplatePageTitleStrategy extends TitleStrategy {
  constructor(
    private readonly title: Title,
    private readonly translate: TranslateService
  ) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot) {
    this.translate.get(this.buildTitle(routerState)!).subscribe((t: string) => {
      this.title.setTitle(this.translate.instant(t));
    });
  }
}

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [
    {
      provide: TitleStrategy,
      useClass: TemplatePageTitleStrategy
    }
  ]
})
export class AppRoutingModule {}
