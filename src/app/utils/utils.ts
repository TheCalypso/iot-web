import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from '../components/snack-bar/snack-bar.component';

export const getInitials = (firstName: string | undefined, lastName: string | undefined): string => {
  if (firstName && lastName) {
    const initials = firstName[0] + lastName[0];
    return initials.toUpperCase();
  }
  return '';
};

export const showSnackBar = (snackbar: MatSnackBar, message: string, skin: string): void => {
  snackbar.openFromComponent(SnackBarComponent, {
    data: message,
    panelClass: skin
  });
};
