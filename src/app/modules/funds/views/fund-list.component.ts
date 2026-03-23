import { Component, inject, OnInit } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { toast } from 'ngx-sonner';
import { Fund, FundCategory } from '../../../core/domain/entities/fund.model';
import { FundMockService } from '../../../core/infrastructure/services/fund-mock.service';
import { AppStateService } from '../../../core/application/app-state.service';
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
      maxHeight: '95vh',
      autoFocus: 'input',
    });

    dialogRef.afterClosed().subscribe((result?: SubscribeModalResult) => {
      if (!result) return;

      const error = this.stateService.subscribeToFund(
        result.fund,
        result.amount,
        result.notificationMethod,
      );

      if (error) {
        toast.error('Error', { description: error });
      } else {
        const method = result.notificationMethod === 'email' ? 'Email' : 'SMS';
        toast.success('Suscripcion exitosa', { description: `Notificado por ${method}` });
      }
    });
  }

  cancelSubscription(fund: Fund): void {
    const error = this.stateService.cancelSubscription(fund.id);

    if (error) {
      toast.error('Error', { description: error });
    } else {
      toast.success('Suscripcion cancelada', { description: fund.name });
    }
  }
}
