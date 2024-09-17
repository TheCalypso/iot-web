import { Component, Input, SimpleChange } from '@angular/core';
import { getInitials } from '../../utils/utils';

interface MatAvatarChanges {
  firstName: SimpleChange;
  lastName: SimpleChange;
}

@Component({
  selector: 'app-mat-avatar',
  templateUrl: './mat-avatar.component.html',
  styleUrls: ['./mat-avatar.component.scss']
})
export class MatAvatarComponent {
  initials: string = '';

  @Input() firstName: string | undefined;
  @Input() lastName: string | undefined;

  ngOnChanges(changes: MatAvatarChanges): void {
    this.firstName = changes.firstName.currentValue;
    this.lastName = changes.lastName.currentValue;
    this.initials = getInitials(this.firstName, this.lastName);
  }
}
