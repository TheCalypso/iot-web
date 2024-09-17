import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './module/material.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './store';
import { AuthEffects } from './store/auth/auth.effects';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SiteLayoutComponent } from './layout/site-layout/site-layout.component';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { getFrenchPaginatorIntl } from './french-paginator-intl';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { NavbarComponent } from './fragments/navbar/navbar.component';
import { SidebarComponent } from './fragments/sidebar/sidebar.component';
import { MatAvatarComponent } from './components/mat-avatar/mat-avatar.component';
import { SnackBarComponent } from './components/snack-bar/snack-bar.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SiteLayoutComponent,
    BaseLayoutComponent,
    NavbarComponent,
    SidebarComponent,
    MatAvatarComponent,
    SnackBarComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    FormsModule,
    StoreModule.forRoot(reducers, { metaReducers }),
    EffectsModule.forRoot([AuthEffects])
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
    {
      provide: MAT_SNACK_BAR_DEFAULT_OPTIONS,
      useValue: {
        duration: 5000,
        verticalPosition: 'top',
        panelClass: 'mat-action'
      }
    },
    {
      provide: MatPaginatorIntl,
      useValue: getFrenchPaginatorIntl()
    },
    provideHttpClient(withInterceptorsFromDi())
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
