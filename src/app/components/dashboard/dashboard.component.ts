import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/models/role.models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  filterItem: string;
  clase: boolean;

  constructor(private router: Router, 
    private authService: AuthService,
    private route: ActivatedRoute,
    private activateRoute: ActivatedRoute) {

      this.route.paramMap.subscribe(params => {
        this.filterItem = params.get('categoria');

        console.log(this.router.url)

        if (this.router.url != '/home') {
          this.clase = true
        }else{
          this.clase = false
        }
      })
     }

    // get isAuthorized() {
    //   return this.authService.isAuthorized();
    // }
  
    get isAdmin() {
      return this.authService.hasRole(Role.ROL_ADMIN);
    }

    get isExterno() {
      return this.authService.hasRole(Role.ROL_PROFESIONAL);
    }
  

  ngOnInit(): void {
   
  }

  ngOnChanges() {
   
    
  }

}
