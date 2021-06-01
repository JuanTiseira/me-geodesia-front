import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeguimientoExpedienteComponent } from './seguimiento-expediente.component';

describe('SeguimientoExpedienteComponent', () => {
  let component: SeguimientoExpedienteComponent;
  let fixture: ComponentFixture<SeguimientoExpedienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SeguimientoExpedienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SeguimientoExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
