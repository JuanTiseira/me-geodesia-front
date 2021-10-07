import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { Role } from 'src/app/models/role.models';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';

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
  

  expedientes_a_entrar;
  expedientes_salida;
  expedientes_sector;
  sector: string;
  expediente: string
  submitted: boolean;
  tramite: string
  param_busqueda: ''
  // consultaForm : FormGroup
  categories = [
    {id: 1, name: 'Expediente', value: 'expediente'},
    {id: 2, name: 'Tramite', value: 'tramite'},
  ]

  constructor(private router: Router,
              private _apiService: ApiService,
              private _functionService: FunctionsService ,
              private authService: AuthService,
              private formBuilder: FormBuilder,
              private spinner: NgxSpinnerService
  ) { }


  consultaForm = this.formBuilder.group({
    param_busqueda: [''],   
    numero: ['', Validators.compose([Validators.maxLength(8), Validators.required])],
    anio: [''],
    tipo_expediente: [''],
    inmueble: [''],
    documento: [''],
    propietario: [''],
    gestor: [''],
    tramite: [''],
    observacion: [''],
    abreviatura: [''],
    agrimensor: [''],
    tipo_consulta: [''],
});

  ngOnInit(): void {
    this.submitted = false;

      if (this.isAdmin || this.isEmpleado) {
        this.spinner.show();
        this._apiService.getExpedientes()
        .then(response => {
          this.expedientes = response
        })

      this._apiService.getUsuarios()
        .then(response => {
          this.usuarios = response
        })
        .catch(error => {
          this._functionService.imprimirMensaje(error, "error en home: ");
          this.router.navigate(['login']);
        })
      }else{
        this.router.navigate(['login']);
      }

      if(this.isEmpleado){
        this.cargarExpedientesEstado()
      }

      this.spinner.hide();
  }

  get r (){ return this.consultaForm.controls;}

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  get isEmpleado() {
    return this.authService.hasRole(Role.ROL_EMPLEADO);
  }

  get isProfesional() {
    return this.authService.hasRole(Role.ROL_PROFESIONAL);
  }

  cargarExpedienteAlSector(){
    this.submitted = true;

    if(this.consultaForm.invalid) return
    
    var tramite = this.consultaForm.value.numero;
    this._functionService.imprimirMensaje(tramite, "numero tramite: ");
    this._apiService.setNuevaTransicion(tramite)
      .then((response) => {
        this._functionService.imprimirMensaje(response, "response: ")
        this._functionService.configSwal(this.mensajeSwal, 'Expediente cargado', "success", "Aceptar", "", false, "", "")
        this.mensajeSwal.fire()
        .finally(() => {this.cargarExpedientesEstado()})
      })
      .catch((error) => {
        this._functionService.imprimirMensaje(error, "error 2222: ")
        this._functionService.configSwal(this.mensajeSwal, 'No es posible cargar este tramite', "error", "Aceptar", "", false, "", "")
        this.mensajeSwal.fire()
      })
  }


  cargarExpedientesEstado(){
    this._apiService.getExpedientesSector()
      .then((response:any) => {
        this.expedientes_sector = response.data
        this.expedientes_a_entrar = response.data
        this.expedientes_salida = response.data
      })
      .catch(error => {
        this._functionService.imprimirMensaje(error, "error al traer los expedientes en home")
      })
  }
}