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
import { MatPaginatorModule } from '@angular/material/paginator';
import {NgxPaginationModule} from 'ngx-pagination';
import { DetalleComponent } from './expedientes/pages/detalle/detalle.component';
import { DetalleHistorialComponent } from './historial/pages/detalle/detalle.component';
import { Select2Module } from "ng-select2-component";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { BuscarUsuarioComponent } from './usuarios/pages/buscar/buscar.component';
import { BuscarHistorialComponent } from './historial/pages/buscar/buscar.component';


@NgModule({
  declarations: [
   
    HomeComponent,
    AgregarComponent,
    BuscarComponent,
    TiposComponent,
    InmueblesComponent,
    DocumentosComponent,
    TramitesComponent,
    ObservacionesComponent,
    DetalleComponent,
    DetalleHistorialComponent,
    BuscarUsuarioComponent,
    BuscarHistorialComponent,
   
  ],
  imports: [
 
    SweetAlert2Module,
    Select2Module,
    NgxPaginationModule,
    RouterModule.forChild(APP_ROUTES),
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ]
})

export class AdminModule { }
