import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { provideNgxMask } from 'ngx-mask';
import { SubscribeModalComponent, SubscribeModalData } from './subscribe-modal.component';
import { Fund } from '../../../../core/domain/entities/fund.model';

const MOCK_FUND: Fund = { id: 2, name: 'FPV_BTG_PACTUAL_ECOPETROL', minAmount: 125000, category: 'FPV' };

describe('SubscribeModalComponent - Validacion de formulario', () => {
  let component: SubscribeModalComponent;
  let fixture: ComponentFixture<SubscribeModalComponent>;
  let dialogRefSpy: { close: ReturnType<typeof vi.fn> };

  beforeEach(async () => {
    dialogRefSpy = { close: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [SubscribeModalComponent],
      providers: [
        provideAnimationsAsync(),
        provideNgxMask(),
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: { fund: MOCK_FUND } as SubscribeModalData },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SubscribeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debe inicializar el monto con el minimo del fondo', () => {
    expect(component.amountControl.value).toBe(125000);
  });

  it('debe ser invalido si el monto es null', () => {
    component.amountControl.setValue(null);
    expect(component.amountControl.valid).toBe(false);
    expect(component.amountControl.hasError('required')).toBe(true);
  });

  it('debe ser invalido si el monto es menor al minimo', () => {
    component.amountControl.setValue(50000);
    expect(component.amountControl.valid).toBe(false);
    expect(component.amountControl.hasError('min')).toBe(true);
  });

  it('debe ser valido si el monto es igual o mayor al minimo', () => {
    component.amountControl.setValue(125000);
    expect(component.amountControl.valid).toBe(true);

    component.amountControl.setValue(500000);
    expect(component.amountControl.valid).toBe(true);
  });

  it('no debe cerrar el dialog si el formulario es invalido', () => {
    component.amountControl.setValue(null);
    component.confirm();
    expect(dialogRefSpy.close).not.toHaveBeenCalled();
  });

  it('debe cerrar el dialog con el resultado si el formulario es valido', () => {
    component.amountControl.setValue(150000);
    component.notificationMethod = 'sms';
    component.confirm();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      fund: MOCK_FUND,
      amount: 150000,
      notificationMethod: 'sms',
    });
  });
});
