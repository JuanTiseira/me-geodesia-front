import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { Role } from './models/role.models';
import { BuscarComponent } from './components/admin/expedientes/pages/buscar/buscar.component';
import { HomeComponent } from './components/admin/home/home.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},


  { path: '', component: DashboardComponent, 
    canLoad: [AuthGuard], 
    canActivate: [AuthGuard],
    children:[
      {path: 'home', component: HomeComponent},
      // {path: 'expediente/buscar', component: BuscarComponent},
      // {path: 'historial/buscar', component: BuscarComponent},
      // { path: 'pagos', component: PagosComponent},
      // { path: 'contacto', component: ContactoComponent}
    ]
  },

  
  { path: '', component: DashboardComponent, 
    canLoad: [AuthGuard], 
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/components/admin/admin.module').then(m => m.AdminModule),
    data: {
      roles: [
        Role.ROL_ADMIN,
      ]
    }
  
  },

  { path: '', component: DashboardComponent, 
    canLoad: [AuthGuard], 
    canActivate: [AuthGuard],
    loadChildren: () => import('../app/components/admin/empleado.module').then(m => m.EmpleadoModule),
    data: {
      roles: [
        Role.ROL_USER,
      ]
    }
  
  },



{
  path:'**', component: LoginComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }


