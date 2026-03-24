import { Component, inject } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDividerModule } from '@angular/material/divider';
import { Fund } from '../../../../core/domain/entities/fund.model';

export interface CancelModalData {
  fund: Fund;
}

@Component({
  selector: 'app-cancel-modal',
  imports: [
    CurrencyPipe,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatDividerModule,
  ],
  templateUrl: './cancel-modal.component.html',
  styleUrl: './cancel-modal.component.scss',
})
export class CancelModalComponent {
  private readonly dialogRef = inject(MatDialogRef<CancelModalComponent>);
  readonly data: CancelModalData = inject(MAT_DIALOG_DATA);

  confirm(): void {
    this.dialogRef.close(true);
  }
}
