import { Routes} from '@angular/router';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';
import { AgregarComponent } from './expedientes/pages/agregar/agregar-expediente.component';
import { HomeComponent } from './home/home.component';
import { AgregarUsuarioComponent } from './usuarios/pages/agregar/agregar.component';
import { BuscarUsuarioComponent } from './usuarios/pages/buscar/buscar.component';
import { BuscarHistorialComponent } from './historial/pages/buscar/buscar.component';
import { DetalleComponent } from './expedientes/pages/detalle/detalle.component';
import { DetalleHistorialComponent } from './historial/pages/detalle/detalle.component';
import { DetalleUsuarioComponent } from './usuarios/pages/detalle/detalle.component';
import { AgregarInmuebleComponent } from './inmuebles/paste/agregar/agregar.component';


export const APP_ROUTES: Routes = [

  //EXPEDIENTES 

  {path: 'expediente/buscar', component: BuscarComponent},

  {path: 'expediente/agregar', component: AgregarComponent},

  {path: 'expediente/editar/:id', component: AgregarComponent },

  {path: 'expediente/:id', component: DetalleComponent },


  //USUARIOS

  {path: 'usuario/agregar', component: AgregarUsuarioComponent},

  {path: 'usuario/buscar', component: BuscarUsuarioComponent},

  {path: 'usuario/:id', component: DetalleUsuarioComponent},


  //HISTORIAL

  {path: 'historial/:id', component: DetalleHistorialComponent},
  
  {path: 'home', component: HomeComponent},

  //INMUEBLES

  {path: 'inmueble/buscar', component: BuscarComponent},

  {path: 'inmueble/agregar', component: AgregarInmuebleComponent},

  {path: 'inmueble/editar/:id', component: AgregarComponent },

  {path: 'inmueble/:id', component: DetalleComponent },

];