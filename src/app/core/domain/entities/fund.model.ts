/** Categorias disponibles para los fondos */
export type FundCategory = 'FPV' | 'FIC';

/** Modelo de dominio que representa un fondo de inversion */
export interface Fund {
  id: number;
  name: string;
  minAmount: number;
  category: FundCategory;
}
