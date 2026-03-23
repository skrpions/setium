import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { AppStateService } from './app-state.service';
import { Fund } from '../../domain/entities/fund.model';

const MOCK_FUND: Fund = { id: 1, name: 'FPV_BTG_PACTUAL_RECAUDADORA', minAmount: 75000, category: 'FPV' };

describe('AppStateService', () => {
  let service: AppStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppStateService);
  });

  it('debe iniciar con saldo de 500.000 COP', async () => {
    const balance = await firstValueFrom(service.userBalance$);
    expect(balance).toBe(500000);
  });

  it('debe suscribirse a un fondo y descontar el saldo', async () => {
    const error = service.subscribeToFund(MOCK_FUND, 100000, 'email');

    expect(error).toBeNull();

    const balance = await firstValueFrom(service.userBalance$);
    expect(balance).toBe(400000);

    const subs = await firstValueFrom(service.subscribedFunds$);
    expect(subs).toHaveLength(1);
    expect(subs[0].fundId).toBe(1);
    expect(subs[0].amount).toBe(100000);
  });

  it('debe rechazar suscripcion si el saldo es insuficiente', () => {
    const error = service.subscribeToFund(MOCK_FUND, 600000, 'sms');
    expect(error).toContain('No tiene saldo disponible');
  });

  it('debe rechazar suscripcion si el monto es menor al minimo', () => {
    const error = service.subscribeToFund(MOCK_FUND, 50000, 'email');
    expect(error).toContain('monto minimo');
  });

  it('debe cancelar suscripcion y devolver el saldo', async () => {
    service.subscribeToFund(MOCK_FUND, 100000, 'email');
    const error = service.cancelSubscription(MOCK_FUND.id);

    expect(error).toBeNull();

    const balance = await firstValueFrom(service.userBalance$);
    expect(balance).toBe(500000);

    const subs = await firstValueFrom(service.subscribedFunds$);
    expect(subs).toHaveLength(0);
  });

  it('debe registrar transacciones en el historial', async () => {
    service.subscribeToFund(MOCK_FUND, 100000, 'email');
    service.cancelSubscription(MOCK_FUND.id);

    const transactions = await firstValueFrom(service.transactions$);
    expect(transactions).toHaveLength(2);
    expect(transactions[0].type).toBe('cancellation');
    expect(transactions[1].type).toBe('subscription');
  });
});
