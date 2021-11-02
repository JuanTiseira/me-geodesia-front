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
  

  expedientes_a_entrar= "";
  expedientes_salida= "";
  expedientes_sector = "";
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

      if (this.isAdmin || this.isEmpleadoMe || this.isEmpleado ) {
        this.spinner.show();
        const expedientesSub = this._apiService.getExpedientes()
          .subscribe(response => {
            this.expedientes = response
          })
        this._apiService.cargarPeticion(expedientesSub);

      
      const usuariosSub = this._apiService.getUsuarios()
        .subscribe(response => {
          this.usuarios = response
        })
      this._apiService.cargarPeticion(usuariosSub)
      }else{
        this.router.navigate(['login']);
      }

      if(this.isEmpleado || this.isEmpleadoMe || this.isAdmin){
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

  get isEmpleadoMe() {
    return this.authService.hasRole(Role.ROL_EMPLEADO_ME);
  }

  get isProfesional() {
    return this.authService.hasRole(Role.ROL_PROFESIONAL);
  }

  cargarExpedienteAlSector(){
    this.submitted = true;
    if(this.consultaForm.invalid) return
    
    var tramite = this.consultaForm.value.numero;
    this._functionService.imprimirMensaje(tramite, "numero tramite: ");
    const transicionSub = this._apiService.setNuevaTransicion(tramite)
      .subscribe((response) => {
        this._functionService.imprimirMensaje(response, "response: ")
        this._functionService.configSwal(this.mensajeSwal, 'Expediente cargado', "success", "Aceptar", "", false, "", "")
        this.mensajeSwal.fire().finally(() => {this.cargarExpedientesEstado()})
      })
    this._apiService.cargarPeticion(transicionSub)
  }


  cargarExpedientesEstado(){
    this.consultaForm.reset();
    this.submitted = false;

    const expedientesSectorSub = this._apiService.getExpedientesSector()
      .subscribe((response:any) => {
        this.expedientes_sector = response.data
      })
    this._apiService.cargarPeticion(expedientesSectorSub);

    const expedientesSalidaSub = this._apiService.getExpedientesSectorSalida()
      .subscribe((response:any) => {
        this.expedientes_salida = response.data
      });
    this._apiService.cargarPeticion(expedientesSalidaSub)

    const expedientesEntradaSub = this._apiService.getExpedientesSectorEntrada()
      .subscribe((response:any) => {
        this.expedientes_a_entrar = response.data
      });
    this._apiService.cargarPeticion(expedientesEntradaSub);

  }
}