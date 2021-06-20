import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { ApiService } from '../../../services/api.service';
import { FunctionsService } from '../../../services/functions.service';
import { Role } from 'src/app/models/role.models';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  expedientes: any;
  usuarios: any;



  constructor(
    private _apiService : ApiService,
    private _functionService: FunctionsService,
    private authService: AuthService
  ) { 
    
  }

  ngOnInit(): void {

      if (this.authService.hasRole(Role.ROL_ADMIN)) {
        this._apiService.getExpedientes()
        .then(response => {
          this.expedientes = response
          this._functionService.imprimirMensaje(response, "expedientes")
        })


      this._apiService.getUsuarios()
        .then(response => {
          this.usuarios = response
          this._functionService.imprimirMensaje(response, "usuarios")
        })
      }

      this._apiService.getExpedientes()
      .then(response => {
        this.expedientes = response
        this._functionService.imprimirMensaje(response, "expedientes")
      })


     
  }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  get isEmpleado() {
    return this.authService.hasRole(Role.ROL_USER);
  }

}
