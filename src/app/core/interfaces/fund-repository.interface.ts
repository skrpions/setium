import { Observable } from 'rxjs';
import { Fund } from '../models/fund.model';

/** Puerto de salida: contrato para acceder a los fondos disponibles */
export interface FundRepository {
  getAll(): Observable<Fund[]>;
  getById(id: number): Observable<Fund | undefined>;
}
