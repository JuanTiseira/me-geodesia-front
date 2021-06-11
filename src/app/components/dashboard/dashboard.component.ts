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

  constructor(private router: Router, 
    private authService: AuthService,
    private activateRoute: ActivatedRoute) { }

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

}
