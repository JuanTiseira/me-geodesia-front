import { Routes} from '@angular/router';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';
import { AgregarComponent } from './expedientes/pages/agregar/agregar.component';
import { HomeComponent } from './home/home.component';
import { AgregarUsuarioComponent } from './usuarios/pages/agregar/agregar.component';
import { BuscarUsuarioComponent } from './usuarios/pages/buscar/buscar.component';
import { BuscarHistorialComponent } from './historial/pages/buscar/buscar.component';


export const APP_ROUTES: Routes = [

  {path: 'expediente/buscar', component: BuscarComponent},

  {path: 'expediente/agregar', component: AgregarComponent},

  {path: 'usuario/agregar', component: AgregarUsuarioComponent},

  {path: 'usuario/buscar', component: BuscarUsuarioComponent},

  {path: 'historial/buscar', component: BuscarHistorialComponent},
  
  {path: 'home', component: HomeComponent}

];