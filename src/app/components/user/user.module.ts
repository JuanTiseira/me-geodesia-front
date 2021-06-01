import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeguimientoExpedienteComponent } from './seguimiento-expediente/seguimiento-expediente.component';
import { ConsultaExpedienteComponent } from './consulta-expediente/consulta-expediente.component';



@NgModule({
  declarations: [
    SeguimientoExpedienteComponent,
    ConsultaExpedienteComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
