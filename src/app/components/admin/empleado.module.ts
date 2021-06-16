import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { AgregarComponent } from './expedientes/pages/agregar/agregar.component';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from './admin-routing.module';
import { TiposComponent } from './tipos/tipos.component';
import { InmueblesComponent } from './inmuebles/inmuebles.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { TramitesComponent } from './tramites/tramites.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { AgrimensoresComponent } from './agrimensores/agrimensores.component';
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
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ]
})

export class EmpleadoModule { }
