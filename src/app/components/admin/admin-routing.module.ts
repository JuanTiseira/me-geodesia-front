import { Routes} from '@angular/router';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';
import { AgregarComponent } from './expedientes/pages/agregar/agregar.component';
import { HomeComponent } from './home/home.component';





export const APP_ROUTES: Routes = [

  {path: 'expediente/buscar', component: BuscarComponent},

  {path: 'expediente/agregar', component: AgregarComponent},
  
  { path: 'home', component: HomeComponent}
];