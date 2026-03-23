import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'funds', pathMatch: 'full' },
  {
    path: 'funds',
    loadComponent: () => import('./modules/funds/views/fund-list.component').then(m => m.FundListComponent),
  },
  {
    path: 'transactions',
    loadComponent: () => import('./modules/transactions/views/transaction-list.component').then(m => m.TransactionListComponent),
  },
  { path: '**', redirectTo: 'funds' },
];
