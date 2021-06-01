import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConsultaExpedienteComponent } from './consulta-expediente.component';

describe('ConsultaExpedienteComponent', () => {
  let component: ConsultaExpedienteComponent;
  let fixture: ComponentFixture<ConsultaExpedienteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConsultaExpedienteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConsultaExpedienteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
