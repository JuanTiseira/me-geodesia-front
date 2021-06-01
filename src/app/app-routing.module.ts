import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LoginComponent } from './components/login/login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', component: DashboardComponent, canLoad: [AuthGuard], canActivate: [AuthGuard],
    children:[
      // { path: 'miCuenta', component: MiCuentaComponent},
      // { path: 'movimientos', component: MiCuentaComponent},
      // { path: 'saldos', component: SaldosComponent},
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
        // Role.ROLE_ADMIN,
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
