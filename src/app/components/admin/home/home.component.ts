import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { Role } from 'src/app/models/role.models';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';

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
  consultaForm : FormGroup
  categories = [
    {id: 1, name: 'Expediente', value: 'expediente'},
    {id: 2, name: 'Tramite', value: 'tramite'},
  ]

  constructor( private _apiService: ApiService,
                private _functionService: FunctionsService ,
                private authService: AuthService,
                private formBuilder: FormBuilder,
                private spinner: NgxSpinnerService
                ) { }

  ngOnInit(): void {

    this.consultaForm = this.formBuilder.group({
      param_busqueda: [''],   
      numero: ['', Validators.maxLength(5)],
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


      if (this.isAdmin || this.isEmpleado) {
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


  buscarHistorialExpediente(){
    var numeroanio = this.consultaForm.value.numero

    this._functionService.imprimirMensaje(numeroanio, "numero anio: ")

    
    
    if (this.consultaForm.value.param_busqueda == 'expediente') {
      
      if(numeroanio.toString().length > 5) {
        var numero = 0 
        let z = 1
  
        for (let i = 5; i < 9; i++) {
  
          if (numeroanio.toString().length === i) {
            numero = numeroanio.toString().slice(0, z);
          }else{
            z++
          }
          
        }
        var anio = numeroanio.toString().slice(-4);
        this._functionService.imprimirMensaje(numeroanio, "numero anio: ")
      }else{
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
      }
    }
  }
}