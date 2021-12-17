import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { Role } from 'src/app/models/role.models';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {
  
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

  expedientesSub: Subscription;
  usuariosSub: Subscription;
  transicionSub: Subscription;
  expedientesSectorSub: Subscription;
  expedientesSalidaSub: Subscription;
  expedientesEntradaSub: Subscription;
  cantidadSectoresSub: Subscription;
  cantidadUsuariosSub: Subscription;

  expedientes_a_entrar= "";
  expedientes_salida= "";
  expedientes_sector = "";
  sector: string;
  expediente: string
  submitted: boolean;
  tramite: string
  param_busqueda: ''
  cantidad_sectores= []
  cantidad_usuarios= []
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
      if (this.isAdmin || this.isEmpleadoME || this.isEmpleado ) {
        
        this.spinner.show();
        this.cargarExpedientesEstado()
        this.cantidadSectoresSub = this._apiService.getExpedientesPorSector().subscribe((response:any) => {
          this.cantidad_sectores = response;
        })
        this._apiService.cargarPeticion(this.cantidadSectoresSub)

        this.cantidadUsuariosSub = this._apiService.getCantidadUsuarios().subscribe((response:any) => {
          this.cantidad_usuarios = response;
        })
        this._apiService.cargarPeticion(this.cantidadUsuariosSub)

      }else{
        this.router.navigate(['login']);
      }


      this.spinner.hide();
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }


  get r (){ return this.consultaForm.controls;}

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  get isEmpleado() {
    return this.authService.hasRole(Role.ROL_EMPLEADO);
  }

  get isEmpleadoME() {
    return this.authService.hasRole(Role.ROL_EMPLEADOME);
  }

  get isProfesional() {
    return this.authService.hasRole(Role.ROL_PROFESIONAL);
  }

  cargarExpedienteAlSector(){
    this.submitted = true;
    if(this.consultaForm.invalid) return
    
    var tramite = this.consultaForm.value.numero;
    this._functionService.imprimirMensaje(tramite, "numero tramite: ");
    this.transicionSub = this._apiService.setNuevaTransicion(tramite)
      .subscribe((response) => {
        this._functionService.imprimirMensaje(response, "response: ")
        this._functionService.configSwal(this.mensajeSwal, 'Expediente cargado', "success", "Aceptar", "", false, "", "")
        this.mensajeSwal.fire().finally(() => {this.cargarExpedientesEstado()})
      })
    this._apiService.cargarPeticion(this.transicionSub)
  }


  cargarExpedientesEstado(){
    this.consultaForm.reset();
    this.submitted = false;
    this.expedientesSectorSub = this._apiService.getExpedientesSector()
      .subscribe((response:any) => {
        this.expedientes_sector = response.data.sector
        this.expedientes_salida = response.data.sector_salida
        this.expedientes_a_entrar = response.data.sector_entrada
      })

    this._apiService.cargarPeticion(this.expedientesSectorSub);

  }
}