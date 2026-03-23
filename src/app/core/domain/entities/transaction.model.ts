/** Tipos de transaccion posibles */
export type TransactionType = 'subscription' | 'cancellation';

/** Metodos de notificacion disponibles */
export type NotificationMethod = 'email' | 'sms';

/** Modelo de dominio que representa una transaccion */
export interface Transaction {
  id: string;
  fundId: number;
  fundName: string;
  type: TransactionType;
  amount: number;
  date: Date;
  notificationMethod?: NotificationMethod;
}
