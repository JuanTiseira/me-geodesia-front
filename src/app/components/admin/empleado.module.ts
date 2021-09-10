import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { APP_ROUTES } from './empleado-routing.module';

import { MatPaginatorModule } from '@angular/material/paginator';
import {NgxPaginationModule} from 'ngx-pagination';



@NgModule({
  declarations: [
   
 
   
  ],
  imports: [
    NgxPaginationModule,
    RouterModule.forChild(APP_ROUTES),
    FormsModule,
    ReactiveFormsModule,
    MatPaginatorModule
  ]
})

export class EmpleadoModule { }
