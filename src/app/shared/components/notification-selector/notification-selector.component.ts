import { Component, input, output } from '@angular/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';
import { NotificationMethod } from '../../../core/domain/entities/transaction.model';

@Component({
  selector: 'app-notification-selector',
  imports: [MatRadioModule, MatIconModule],
  templateUrl: './notification-selector.component.html',
  styleUrl: './notification-selector.component.scss',
})
export class NotificationSelectorComponent {
  readonly value = input<NotificationMethod>('email');
  readonly selectionChange = output<NotificationMethod>();

  onSelectionChange(value: NotificationMethod): void {
    this.selectionChange.emit(value);
  }
}
