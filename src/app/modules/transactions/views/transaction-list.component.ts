import { Component, inject } from '@angular/core';
import { AsyncPipe, CurrencyPipe, DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { AppStateService } from '../../../core/application/app-state.service';

@Component({
  selector: 'app-transaction-list',
  imports: [AsyncPipe, CurrencyPipe, DatePipe, MatTableModule, MatChipsModule, MatIconModule],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent {
  private readonly stateService = inject(AppStateService);

  readonly transactions$ = this.stateService.transactions$;
  readonly displayedColumns = ['type', 'fundName', 'amount', 'notification', 'date'];
}
