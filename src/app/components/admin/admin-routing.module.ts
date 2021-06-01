import { Routes} from '@angular/router';
import { UsuariosComponent } from './usuarios/usuarios.component';
import { ExpedientesComponent } from './expedientes/expedientes.component';
import { HomeComponent } from './home/home.component';



export const APP_ROUTES: Routes = [
  { path: 'usuarios', component: UsuariosComponent},
  { path: 'expedientes', component: ExpedientesComponent},
  { path: 'home', component: HomeComponent}
];