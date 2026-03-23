import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Fund } from '../models/fund.model';
import { FundRepository } from '../interfaces/fund-repository.interface';

/** Datos mock de los fondos disponibles */
const MOCK_FUNDS: Fund[] = [
  { id: 1, name: 'FPV_BTG_PACTUAL_RECAUDADORA', minAmount: 75000, category: 'FPV' },
  { id: 2, name: 'FPV_BTG_PACTUAL_ECOPETROL', minAmount: 125000, category: 'FPV' },
  { id: 3, name: 'DEUDAPRIVADA', minAmount: 50000, category: 'FIC' },
  { id: 4, name: 'FDO-ACCIONES', minAmount: 250000, category: 'FIC' },
  { id: 5, name: 'FPV_BTG_PACTUAL_DINAMICA', minAmount: 100000, category: 'FPV' },
];

/** Implementacion mock del repositorio de fondos (capa de infraestructura) */
@Injectable({ providedIn: 'root' })
export class FundMockService implements FundRepository {
  getAll(): Observable<Fund[]> {
    return of(MOCK_FUNDS);
  }

  getById(id: number): Observable<Fund | undefined> {
    return of(MOCK_FUNDS.find(fund => fund.id === id));
  }
}
