import { Component, Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Actions, ofType } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { first } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { login, loginComplete, loginError } from '../../store/auth/auth.actions';
import { MatSnackBar } from '@angular/material/snack-bar';
import { showSnackBar } from '../../utils/utils';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
@Injectable({ providedIn: 'root' })
export class LoginComponent {
  loginForm: FormGroup = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', Validators.required]
  });
  hidePassword = true;
  originPage: any;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    private store: Store<{}>,
    private readonly action$: Actions,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly snackbar: MatSnackBar,
    private readonly translate: TranslateService
  ) {
    this.route.queryParams.pipe(takeUntilDestroyed()).subscribe((params) => {
      this.originPage = params['originPage'] ?? '';
    });
    this.action$.pipe(ofType(loginError), takeUntilDestroyed()).subscribe(() => {
      this.loading = false;
    });
    this.action$.pipe(ofType(loginComplete), first()).subscribe(() => {
      void this.router.navigate([this.originPage]);
      showSnackBar(this.snackbar, this.translate.instant('toast.success.connect'), 'mat-success');
    });
  }
  onSubmit(): void {
    if (!this.loginForm.valid) return;
    this.store.dispatch(login(this.loginForm.getRawValue()));
    this.loading = true;
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }
}
