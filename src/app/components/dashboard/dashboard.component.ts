import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  filterItem: string;
  clase: boolean;

  constructor(private router: Router, 
    public functionsService: FunctionsService) {

      // this.route.paramMap.subscribe(params => {
      //   this.filterItem = params.get('categoria');
      //   if (this.router.url != '/home') {
      //     this.clase = true
      //   }else{
      //     this.clase = false
      //   }
      // })
     }
  

  ngOnInit(): void {
    if(!this.functionsService.isAdmin && !this.functionsService.isEmpleado && !this.functionsService.isEmpleadoME && !this.functionsService.isEmpleadoCarga){
      this.router.navigate(['login']);
    }
   
  }

}
