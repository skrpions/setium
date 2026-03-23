import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'funds', pathMatch: 'full' },
  {
    path: 'funds',
    loadComponent: () => import('./features/funds/views/fund-list').then(m => m.FundListComponent),
  },
  {
    path: 'transactions',
    loadComponent: () => import('./features/transactions/views/transaction-list').then(m => m.TransactionListComponent),
  },
  { path: '**', redirectTo: 'funds' },
];
