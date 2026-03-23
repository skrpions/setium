import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { FundCardComponent } from './fund-card.component';
import { Fund } from '../../../../core/domain/entities/fund.model';

const MOCK_FUND: Fund = { id: 3, name: 'DEUDAPRIVADA', minAmount: 50000, category: 'FIC' };

describe('FundCardComponent', () => {
  let component: FundCardComponent;
  let fixture: ComponentFixture<FundCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FundCardComponent],
      providers: [provideAnimationsAsync()],
    }).compileComponents();

    fixture = TestBed.createComponent(FundCardComponent);
    fixture.componentRef.setInput('fund', MOCK_FUND);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  it('debe crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debe mostrar el nombre del fondo', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('DEUDAPRIVADA');
  });

  it('debe mostrar la categoria del fondo', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('FIC');
  });

  it('debe mostrar boton Suscribirse cuando no esta suscrito', () => {
    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Suscribirse');
  });

  it('debe mostrar boton Cancelar cuando esta suscrito', () => {
    fixture.componentRef.setInput('isSubscribed', true);
    fixture.detectChanges();

    const el: HTMLElement = fixture.nativeElement;
    expect(el.textContent).toContain('Cancelar');
  });

  it('debe emitir onSubscribe al hacer click en Suscribirse', () => {
    let emittedFund: Fund | undefined;
    component.onSubscribe.subscribe((f: Fund) => emittedFund = f);

    const btn = fixture.nativeElement.querySelector('button');
    btn.click();

    expect(emittedFund).toEqual(MOCK_FUND);
  });
});
