import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { TransactionListComponent } from './transaction-list.component';
import { AppStateService } from '../../../core/application/app-state.service';
import { Fund } from '../../../core/domain/entities/fund.model';

const MOCK_FUND: Fund = { id: 1, name: 'FPV_BTG_PACTUAL_RECAUDADORA', minAmount: 75000, category: 'FPV' };

describe('TransactionListComponent', () => {
  let component: TransactionListComponent;
  let fixture: ComponentFixture<TransactionListComponent>;
  let stateService: AppStateService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionListComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    stateService = TestBed.inject(AppStateService);
    fixture = TestBed.createComponent(TransactionListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar estado vacio cuando no hay transacciones', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Sin transacciones');
  });

  it('debe mostrar transacciones despues de una suscripcion', async () => {
    stateService.subscribeToFund(MOCK_FUND, 100000, 'email');
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('FPV_BTG_PACTUAL_RECAUDADORA');
    expect(el.textContent).toContain('Apertura');
  });

  it('debe mostrar cancelacion en el historial', async () => {
    stateService.subscribeToFund(MOCK_FUND, 100000, 'email');
    stateService.cancelSubscription(MOCK_FUND.id);
    fixture.detectChanges();
    await fixture.whenStable();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Cancelacion');
  });
});
