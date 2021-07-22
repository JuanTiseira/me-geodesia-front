import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { Role } from 'src/app/models/role.models';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent

  closeResult = '';
  public page: number = 0;
  public search: string = '';
  public expedientes: any;
  public tipos_expedientes: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
  public tipo_consulta: any;

  expediente: string
  tramite: string
  param_busqueda: ''

  constructor( private _apiService: ApiService,
                private _functionService: FunctionsService ,
                private authService: AuthService,
                private spinner: NgxSpinnerService
                ) { }

  ngOnInit(): void {

      if (this.authService.hasRole(Role.ROL_ADMIN) || this.authService.hasRole(Role.ROL_EMPLEADO)) {
        this.spinner.show();
        this._apiService.getExpedientes()
        .then(response => {
          this.expedientes = response
         
        })

      this._apiService.getUsuarios()
        .then(response => {
          this.usuarios = response
          this._functionService.imprimirMensaje(response, "usuarios")
        })
      }

      this.spinner.hide();
  }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  get isEmpleado() {
    return this.authService.hasRole(Role.ROL_EMPLEADO);
  }

  get isProfesional() {
    return this.authService.hasRole(Role.ROL_PROFESIONAL);
  }
 
}