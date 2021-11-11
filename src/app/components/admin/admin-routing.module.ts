import { Routes} from '@angular/router';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';
import { AgregarComponent } from './expedientes/pages/agregar/agregar-expediente.component';
import { EditComponent } from './expedientes/pages/editar/edit-expediente.component';
import { AgregarUsuarioComponent } from './usuarios/pages/agregar/agregar.component';
import { BuscarUsuarioComponent } from './usuarios/pages/buscar/buscar.component';
import { DetalleComponent } from './expedientes/pages/detalle/detalle.component';
import { DetalleUsuarioComponent } from './usuarios/pages/detalle/detalle.component';
import { AgregarInmuebleComponent } from './inmuebles/agregar/agregar-inmueble.component';
import { BuscarInmuebleComponent } from './inmuebles/buscar/buscar-inmueble.component';
import { DetallesInmuebleComponent } from './inmuebles/detalles/detalles-inmueble.component';
import { BuscarRetiroComponent } from './retiro/buscar/buscar-retiro.component';
import { CaratulaComponent } from './expedientes/pages/reporte/caratula/caratula.component';



export const APP_ROUTES: Routes = [

  //EXPEDIENTES 

  {path: 'expediente/buscar', component: BuscarComponent},

  {path: 'expediente/agregar', component: AgregarComponent},

  {path: 'expediente/editar/:id', component: EditComponent },

  {path: 'expediente/caratula', component: CaratulaComponent},

  {path: 'expediente/:id', component: DetalleComponent},

  //IMPRIMIR CARATULA 

  

  //USUARIOS

  {path: 'usuario/agregar', component: AgregarUsuarioComponent},

  {path: 'usuario/buscar', component: BuscarUsuarioComponent},

  {path: 'usuario/:id', component: DetalleUsuarioComponent},


  //HISTORIAL

  // {path: 'historial/:id', component: DetalleHistorialComponent},
  
  // {path: 'home', component: HomeComponent},

  //INMUEBLES

  {path: 'inmueble/buscar', component: BuscarInmuebleComponent},

  {path: 'inmueble/agregar', component: AgregarInmuebleComponent},

  {path: 'inmueble/editar/:id', component: AgregarComponent },

  {path: 'inmueble/:id', component: DetallesInmuebleComponent },


  
  //RETIRO

  {path: 'retiro/buscar', component: BuscarRetiroComponent},



];