import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AgregarComponent } from './expedientes/pages/agregar/agregar-expediente.component';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from './admin-routing.module';

import { MatPaginatorModule } from '@angular/material/paginator';
import {NgxPaginationModule} from 'ngx-pagination';
import { DetalleComponent } from './expedientes/pages/detalle/detalle.component';
import { DetalleHistorialComponent } from './historial/pages/detalle/detalle.component';



@NgModule({
  declarations: [
   
 
   
  ],
  imports: [
    NgxPaginationModule,
    RouterModule.forChild(APP_ROUTES),
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ]
})

export class EmpleadoModule { }
