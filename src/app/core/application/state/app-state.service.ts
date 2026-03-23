import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Fund } from '../../domain/entities/fund.model';
import { Subscription } from '../../domain/entities/subscription.model';
import { Transaction, NotificationMethod } from '../../domain/entities/transaction.model';

/** Saldo inicial del usuario en COP */
const INITIAL_BALANCE = 500000;

/**
 * Servicio central de estado de la aplicacion.
 * Gestiona el saldo del usuario, suscripciones activas y el historial de transacciones
 * utilizando BehaviorSubjects y Observables (RxJS).
 */
@Injectable({ providedIn: 'root' })
export class AppStateService {
  private readonly balanceSubject = new BehaviorSubject<number>(INITIAL_BALANCE);
  private readonly subscriptionsSubject = new BehaviorSubject<Subscription[]>([]);
  private readonly transactionsSubject = new BehaviorSubject<Transaction[]>([]);

  /** Saldo actual del usuario */
  readonly userBalance$: Observable<number> = this.balanceSubject.asObservable();

  /** Fondos a los que el usuario esta suscrito actualmente */
  readonly subscribedFunds$: Observable<Subscription[]> = this.subscriptionsSubject.asObservable();

  /** Historial completo de transacciones */
  readonly transactions$: Observable<Transaction[]> = this.transactionsSubject.asObservable();

  /** Verifica si el usuario ya esta suscrito a un fondo especifico */
  isSubscribedToFund$(fundId: number): Observable<boolean> {
    return this.subscribedFunds$.pipe(
      map(subs => subs.some(s => s.fundId === fundId))
    );
  }

  /**
   * Suscribe al usuario a un fondo.
   * Retorna un mensaje de error si no se puede completar, o null si fue exitoso.
   */
  subscribeToFund(fund: Fund, amount: number, notificationMethod: NotificationMethod): string | null {
    const currentBalance = this.balanceSubject.getValue();
    const currentSubs = this.subscriptionsSubject.getValue();

    if (currentSubs.some(s => s.fundId === fund.id)) {
      return `Ya estas suscrito al fondo ${fund.name}`;
    }

    if (amount < fund.minAmount) {
      return `El monto minimo de vinculacion al fondo ${fund.name} es de $${fund.minAmount.toLocaleString('es-CO')} COP`;
    }

    if (amount > currentBalance) {
      return `No tiene saldo disponible para vincularse al fondo ${fund.name}`;
    }

    // Actualizar saldo
    this.balanceSubject.next(currentBalance - amount);

    // Agregar suscripcion
    const newSubscription: Subscription = {
      fundId: fund.id,
      fundName: fund.name,
      amount,
      notificationMethod,
      subscribedAt: new Date(),
    };
    this.subscriptionsSubject.next([...currentSubs, newSubscription]);

    // Registrar transaccion
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      fundId: fund.id,
      fundName: fund.name,
      type: 'subscription',
      amount,
      date: new Date(),
      notificationMethod,
    };
    this.transactionsSubject.next([transaction, ...this.transactionsSubject.getValue()]);

    return null;
  }

  /**
   * Cancela la suscripcion a un fondo y devuelve el saldo al usuario.
   * Retorna un mensaje de error si no se puede completar, o null si fue exitoso.
   */
  cancelSubscription(fundId: number): string | null {
    const currentSubs = this.subscriptionsSubject.getValue();
    const subscription = currentSubs.find(s => s.fundId === fundId);

    if (!subscription) {
      return 'No estas suscrito a este fondo';
    }

    // Devolver saldo
    const currentBalance = this.balanceSubject.getValue();
    this.balanceSubject.next(currentBalance + subscription.amount);

    // Remover suscripcion
    this.subscriptionsSubject.next(currentSubs.filter(s => s.fundId !== fundId));

    // Registrar transaccion de cancelacion
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      fundId: subscription.fundId,
      fundName: subscription.fundName,
      type: 'cancellation',
      amount: subscription.amount,
      date: new Date(),
    };
    this.transactionsSubject.next([transaction, ...this.transactionsSubject.getValue()]);

    return null;
  }
}
