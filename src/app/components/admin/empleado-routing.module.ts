import { Routes} from '@angular/router';
import { AgregarComponent } from './expedientes/pages/agregar/agregar-expediente.component';
import { BuscarComponent } from './expedientes/pages/buscar/buscar.component';
import { DetalleComponent } from './expedientes/pages/detalle/detalle.component';
import { EditComponent } from './expedientes/pages/editar/edit-expediente.component';
import { CaratulaComponent } from './expedientes/pages/reporte/caratula/caratula.component';



export const APP_ROUTES: Routes = [
    //EXPEDIENTES 

    {path: 'expediente/buscar', component: BuscarComponent},

    {path: 'expediente/agregar', component: AgregarComponent},
  
    {path: 'expediente/editar/:id', component: EditComponent },
  
    {path: 'expediente/caratula', component: CaratulaComponent},
  
    {path: 'expediente/:id', component: DetalleComponent },
];