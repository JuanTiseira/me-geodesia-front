import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';
import { Role } from './models/role.models';

const routes: Routes = [
  { path: 'login', component: LoginComponent},


  { path: '', component: DashboardComponent, 
    canLoad: [AuthGuard], 
    canActivate: [AuthGuard],
    children:[
      // { path: 'home', component: MiCuentaComponent},
      // { path: 'expedientes', component: MiCuentaComponent},
      // { path: 'historial', component: SaldosComponent},
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
{
  path:'**', component: LoginComponent
}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
