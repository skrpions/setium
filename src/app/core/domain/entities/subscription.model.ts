import { NotificationMethod } from './transaction.model';

/** Modelo de dominio que representa una suscripcion activa a un fondo */
export interface Subscription {
  fundId: number;
  fundName: string;
  amount: number;
  notificationMethod: NotificationMethod;
  subscribedAt: Date;
}
