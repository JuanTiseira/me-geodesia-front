import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { Role } from 'src/app/models/role.models';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-detalle-usuario',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})



export class DetalleUsuarioComponent implements OnInit, OnDestroy{

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  @Input() usuario: any;

  
  idEdit: boolean
  // usuario = null;
  message = '';
  usuarioForm: FormGroup;
  id: string;
  isEditMode: boolean;
  loading = false;
  submitted = false;
  selecteditem: string;
  selectedinmueble: string;
  selecteddocumento: string;
  selectedtramite: string;
  selectedobservacion: string;
  selectedgestor: string; 
  selectedpropietario: string; 
  selectedagrimensor: string;

  usuarioSub: Subscription;
  editExpedienteSub: Subscription;


  public tipos_usuarios: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;



  constructor(
    private _apiService: ApiService,
    private _functionService: FunctionsService ,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
    ) {}

  ngOnInit(): void {
    this.spinner.show();
      
    this.id = this.route.snapshot.params['id'];
    this.isEditMode = false;
    
    this.usuarioForm = this.formBuilder.group({
      tipo_usuario: [{value: '', }, Validators.required],
      inmueble: [{value: '', }, Validators.required],
      documento: [{value: '', }, Validators.required],
      propietario: [{value: '', }, Validators.required],
      gestor: [{value: '', }, Validators.required],
      tramite: [{value: '', }, Validators.required],
      observacion: [{value: '', }, Validators.required],
      abreviatura: [{value: '', }, Validators.required],
      agrimensor: [{value: '', }, Validators.required],
      }, {
         
      });

      this.usuarioForm.disable();
     
    this.message = '';
    
    this.idEdit = false

    this.usuarioSub = this._apiService.getUsuario(this.route.snapshot.paramMap.get('id'))
      .subscribe(response => {
        this.usuario = response
        this.usuarioForm.patchValue(response)
        this.selecteditem = this.usuario.tipo_usuario

        this._functionService.imprimirMensajeDebug(response, "usuario")
        this.spinner.hide()
      })
    this._apiService.cargarPeticion(this.usuarioSub)
  
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }

  compareFn(value, option): boolean {
    return value.id === option.id;
}

  imprimirEtiqueta(){
    
    this._functionService.configSwal(this.mensajeSwal, `Imprimiendo Etiqueta`, "success", "Aceptar", "", false, "", "")
    this.mensajeSwal.fire()
  }

  editar (){
    this.isEditMode = true
    this.usuarioForm.enable();
  }

  get f() { return this.usuarioForm.controls; }

  get isAdmin() {
    return this.authService.hasRole([Role.ROL_ADMIN]);
  }

  get isEmpleado() {
    return this.authService.hasRole([Role.ROL_LINDERO]);
  }

  get isEmpleadoME() {
    return this.authService.hasRole([Role.ROL_MESA_ENTRADA]);
  }

  get isEmpleadoCarga() {
    return this.authService.hasRole([Role.ROL_EMPLEADO_CARGA]);
  }

  get isProfesional() {
    return this.usuario?.rol?.nombre == Role.ROL_PROFESIONAL
  }

  get isPropietario() {
    return this.usuario?.rol?.nombre == Role.ROL_PROPIETARIO
  }

}
