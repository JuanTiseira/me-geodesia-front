import { Routes} from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';
import { AgregarComponent } from './expedientes/pages/agregar/agregar.component';
import { HomeComponent } from './home/home.component';
import { HistorialComponent } from './historial/historial.component';



export const APP_ROUTES: Routes = [
  { path: 'usuarios', component: UsuariosComponent},

  { path: 'historial', component: HistorialComponent},
  
  { path: 'home', component: HomeComponent}
];