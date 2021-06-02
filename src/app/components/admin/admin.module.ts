import { NgModule } from '@angular/core';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { APP_ROUTES } from './admin-routing.module';
import { HomeComponent } from './home/home.component';
import { HistorialComponent } from './historial/historial.component';



@NgModule({
  declarations: [
    UsuariosComponent,
    ExpedientesComponent,
    HistorialComponent,
    HomeComponent
  ],
  imports: [
    RouterModule.forChild(APP_ROUTES),
    SharedModule
  ]
})
export class AdminModule { }
