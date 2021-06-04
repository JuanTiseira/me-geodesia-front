import { NgModule } from '@angular/core';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { APP_ROUTES } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { HistorialComponent } from './historial/historial.component';
import { AgregarComponent } from './expedientes/pages/agregar/agregar.component';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';

@NgModule({
  declarations: [
    UsuariosComponent,
    HistorialComponent,
    HomeComponent,
    AgregarComponent,
    BuscarComponent
  ],
  imports: [
    RouterModule.forChild(APP_ROUTES),
    SharedModule
  ]
})
export class AdminModule { }
