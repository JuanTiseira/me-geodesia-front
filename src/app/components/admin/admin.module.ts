import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { HomeComponent } from './home/home.component';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from './admin-routing.module';

import { NgxPaginationModule } from 'ngx-pagination';
import { Select2Module } from "ng-select2-component";
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { CommonModule } from '@angular/common';  
import { NgxSpinnerModule } from "ngx-spinner";
import { NgSelectModule } from '@ng-select/ng-select';
import {NgxPrintModule} from 'ngx-print';
// Import ngx-barcode module
import { NgxBarcodeModule } from 'ngx-barcode';

//EXPEDIENTES 
import { DetalleComponent } from './expedientes/pages/detalle/detalle.component';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';
import { AgregarComponent } from './expedientes/pages/agregar/agregar-expediente.component';


//HISTORIAL 
import { BuscarHistorialComponent } from './historial/pages/buscar/buscar.component';
import { DetalleHistorialComponent } from './historial/pages/detalle/detalle.component';


//USUARIOS
import { BuscarUsuarioComponent } from './usuarios/pages/buscar/buscar.component';
import { DetalleUsuarioComponent } from './usuarios/pages/detalle/detalle.component';
import { AgregarUsuarioComponent } from './usuarios/pages/agregar/agregar.component';


//INMUBELES
import { AgregarInmuebleComponent } from './inmuebles/paste/agregar/agregar-inmueble.component';
import { BuscarInmuebleComponent } from './inmuebles/paste/buscar/buscar-inmueble.component';


//RETIROS 
import { BuscarRetiroComponent } from './retiro/buscar/buscar-retiro.component';
import { CaratulaComponent } from './expedientes/pages/reporte/caratula/caratula.component';





@NgModule({
  declarations: [
     
    HomeComponent, 
    BuscarComponent,
    DetalleComponent,
    DetalleHistorialComponent,
    BuscarUsuarioComponent,
    BuscarHistorialComponent,
    AgregarUsuarioComponent,
    DetalleUsuarioComponent,
    AgregarComponent,
    AgregarInmuebleComponent,
    BuscarInmuebleComponent,
    BuscarRetiroComponent,
    CaratulaComponent,
   
  ],
  imports: [
    NgxBarcodeModule,
    NgxPrintModule,
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
    ReactiveFormsModule
 
  ]
})

export class AdminModule { }
