import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';
import { AgregarComponent } from './expedientes/pages/agregar/agregar-expediente.component';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from './admin-routing.module';
import { TiposComponent } from './tipos/tipos.component';
import { DocumentosComponent } from './documentos/documentos.component';
import { TramitesComponent } from './tramites/tramites.component';
import { ObservacionesComponent } from './observaciones/observaciones.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { NgxPaginationModule } from 'ngx-pagination';
import { Select2Module } from "ng-select2-component";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';  
import { BrowserModule } from '@angular/platform-browser';
import { NgxSpinnerModule } from "ngx-spinner";
import { NgSelectModule } from '@ng-select/ng-select';
//EXPEDIENTES 
import { DetalleComponent } from './expedientes/pages/detalle/detalle.component';


//HISTORIAL 
import { BuscarHistorialComponent } from './historial/pages/buscar/buscar.component';
import { DetalleHistorialComponent } from './historial/pages/detalle/detalle.component';


//USUARIOS
import { BuscarUsuarioComponent } from './usuarios/pages/buscar/buscar.component';
import { DetalleUsuarioComponent } from './usuarios/pages/detalle/detalle.component';
import { AgregarUsuarioComponent } from './usuarios/pages/agregar/agregar.component';


//INMUBELES
import { AgregarInmuebleComponent } from './inmuebles/paste/agregar/agregar.component';




@NgModule({
  declarations: [
     
    HomeComponent, 
    BuscarComponent,
    TiposComponent,
    DocumentosComponent,
    TramitesComponent,
    ObservacionesComponent,
    DetalleComponent,
    DetalleHistorialComponent,
    BuscarUsuarioComponent,
    BuscarHistorialComponent,
    AgregarUsuarioComponent,
    DetalleUsuarioComponent,
    AgregarComponent,
    AgregarInmuebleComponent

  ],
  imports: [
    NgSelectModule,
    NgxSpinnerModule,
    CommonModule,
    NgMultiSelectDropDownModule.forRoot(),
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
