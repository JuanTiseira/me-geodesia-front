import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { Role } from './models/role.models';
import { BuscarComponent } from './components/admin/expedientes/pages/buscar/buscar.component';
import { HomeComponent } from './components/admin/home/home.component';
import { DetalleComponent } from './components/admin/expedientes/pages/detalle/detalle.component';
import { BuscarHistorialComponent } from './components/admin/historial/pages/buscar/buscar.component';
import { CaratulaComponent } from './components/admin/expedientes/pages/reporte/caratula/caratula.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: DashboardComponent, 
    children:[
      {path: 'home', component: HomeComponent},
      {path: 'historial/buscar', canLoad: [AuthGuard],  canActivate: [AuthGuard], component: BuscarHistorialComponent},
      {path: 'historial/buscar/:id', canLoad: [AuthGuard],  canActivate: [AuthGuard], component: BuscarHistorialComponent},
    ],
    data: {
      roles: [
        Role.ROL_ADMIN,
        Role.ROL_EMPLEADO,
        Role.ROL_EMPLEADOME,
        Role.ROL_EMPLEADO_CARGA,
        Role.ROL_PROFESIONAL,
      ]
    }
  },

  { path: '', component: DashboardComponent, 
  canLoad: [AuthGuard], 
  canActivate: [AuthGuard],
  loadChildren: () => import('../app/components/admin/empleado.module').then(m => m.EmpleadoModule),
  data: {
    roles: [
      Role.ROL_EMPLEADO,
      Role.ROL_EMPLEADOME,
      Role.ROL_EMPLEADO_CARGA,
      Role.ROL_ADMIN
    ]
  }

},
  { path: '', component: DashboardComponent, 
    canLoad: [AuthGuard], 
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/components/admin/admin.module').then(m => m.AdminModule),
    data: {
      roles: [
        Role.ROL_ADMIN,
        Role.ROL_EMPLEADOME,
        Role.ROL_EMPLEADO_CARGA,
      ]
    }
  
  },

{
  path:'**', pathMatch: 'full', redirectTo: '/home'
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


