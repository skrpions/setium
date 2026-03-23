import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { Fund } from '../../../../core/domain/entities/fund.model';
import { NotificationMethod } from '../../../../core/domain/entities/transaction.model';
import { NotificationSelectorComponent } from '../../../../shared/components/notification-selector/notification-selector.component';

export interface SubscribeModalData {
  fund: Fund;
}

export interface SubscribeModalResult {
  fund: Fund;
  amount: number;
  notificationMethod: NotificationMethod;
}

@Component({
  selector: 'app-subscribe-modal',
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    NotificationSelectorComponent,
  ],
  templateUrl: './subscribe-modal.component.html',
  styleUrl: './subscribe-modal.component.scss',
})
export class SubscribeModalComponent {
  private readonly dialogRef = inject(MatDialogRef<SubscribeModalComponent>);
  readonly data: SubscribeModalData = inject(MAT_DIALOG_DATA);

  amountControl = new FormControl<number | null>(this.data.fund.minAmount, {
    validators: [Validators.required, Validators.min(this.data.fund.minAmount)],
  });

  notificationMethod: NotificationMethod = 'email';

  confirm(): void {
    if (this.amountControl.invalid) return;

    const result: SubscribeModalResult = {
      fund: this.data.fund,
      amount: this.amountControl.value!,
      notificationMethod: this.notificationMethod,
    };

    this.dialogRef.close(result);
  }
}
