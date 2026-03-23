import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Fund, FundCategory } from '../../../core/domain/entities/fund.model';
import { FundMockService } from '../../../core/infrastructure/services/fund-mock.service';
import { AppStateService } from '../../../core/application/state/app-state.service';
import { FundCardComponent } from '../components/fund-card/fund-card.component';
import {
  SubscribeModalComponent,
  SubscribeModalData,
  SubscribeModalResult,
} from '../components/subscribe-modal/subscribe-modal.component';

@Component({
  selector: 'app-fund-list',
  imports: [AsyncPipe, MatChipsModule, MatProgressSpinnerModule, MatIconModule, FundCardComponent],
  templateUrl: './fund-list.component.html',
  styleUrl: './fund-list.component.scss',
})
export class FundListComponent implements OnInit {
  private readonly fundService = inject(FundMockService);
  private readonly stateService = inject(AppStateService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  allFunds: Fund[] = [];
  filteredFunds: Fund[] = [];
  isLoading = true;

  ngOnInit(): void {
    this.fundService.getAll().subscribe(funds => {
      this.allFunds = funds;
      this.filteredFunds = funds;
      this.isLoading = false;
    });
  }

  filterByCategory(category: string): void {
    if (!category) {
      this.filteredFunds = this.allFunds;
    } else {
      this.filteredFunds = this.allFunds.filter(f => f.category === category as FundCategory);
    }
  }

  isSubscribed(fundId: number): Observable<boolean> {
    return this.stateService.isSubscribedToFund$(fundId);
  }

  openSubscribeModal(fund: Fund): void {
    const dialogRef = this.dialog.open(SubscribeModalComponent, {
      data: { fund } as SubscribeModalData,
      width: '440px',
    });

    dialogRef.afterClosed().subscribe((result?: SubscribeModalResult) => {
      if (!result) return;

      const error = this.stateService.subscribeToFund(
        result.fund,
        result.amount,
        result.notificationMethod,
      );

      if (error) {
        this.snackBar.open(error, 'Cerrar', { duration: 5000, panelClass: 'snackbar--error' });
      } else {
        const method = result.notificationMethod === 'email' ? 'correo electronico' : 'SMS';
        this.snackBar.open(
          `Suscripcion exitosa a ${result.fund.name}. Se notifico por ${method}.`,
          'OK',
          { duration: 4000 },
        );
      }
    });
  }

  cancelSubscription(fund: Fund): void {
    const error = this.stateService.cancelSubscription(fund.id);

    if (error) {
      this.snackBar.open(error, 'Cerrar', { duration: 5000, panelClass: 'snackbar--error' });
    } else {
      this.snackBar.open(`Se cancelo la suscripcion a ${fund.name}`, 'OK', { duration: 4000 });
    }
  }
}
