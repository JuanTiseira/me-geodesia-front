import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Role } from 'src/app/models/role.models';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  direction = "";
  url = "";

  constructor(private router: Router, 
    private authService: AuthService,
    private activateRoute: ActivatedRoute ) {}


  // get isAuthorized() {
  //   return this.authService.isAuthorized();
  // }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  get isEmpleado() {
    return this.authService.hasRole(Role.ROL_EMPLEADO);
  }

  get isEmpleadoME() {
    return this.authService.hasRole(Role.ROL_EMPLEADOME);
  }

  get isEmpleadoCarga(){
    return this.authService.hasRole(Role.ROL_EMPLEADO_CARGA);
  }



  ngOnInit(): void {
  }

  cambioUrl(url: string){
    this.url = url;
  }

}
