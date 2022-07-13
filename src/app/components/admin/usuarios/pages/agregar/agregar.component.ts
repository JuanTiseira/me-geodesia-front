import { Location } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import Swal from 'sweetalert2'
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';
import { AuthService } from 'src/app/services/auth.service';
import { Role } from 'src/app/models/role.models';



@Component({
  selector: 'app-crear-usuario',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.scss']
})
export class AgregarUsuarioComponent implements OnInit {

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  @ViewChild('rol') rolComponent: NgSelectComponent;

  @Output() verDetallesFunction: EventEmitter<any>;
  @Input() desdeExpediente: boolean;

  public tipos_usuarios: any;
  public documentos: any;
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
  public roles: any;
  public asignaciones: any;
  public permisos: any;
  usuarioForm: FormGroup
  // form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  credenciales = false;
  selectedRol: any;
  selectedAsignacion: any;
  descripcionRol: string;
  
  idRol: any;

  accesoTodos = ["Profesional", "Propietario", "Empleado: Lindero", "Empleado: Técnico", "Empleado: Parcelamiento", "Empleado: Presentaciones posteriores", "Empleado: Carga de expediente", "Empleado: Mesa de entrada", "Administrador"]
  accesoUsuarios = ["Empleado: Lindero", "Empleado: Técnico", "Empleado: Parcelamiento", "Empleado: Presentaciones posteriores", "Empleado: Carga de expediente", "Empleado: Mesa de entrada", "Administrador"]
  accesoProfesionalPropietario = ["Profesional", "Propietario"]
  accesoProfesional = ["Profesional"]


  tipoExpedientesSub: Subscription;
  observacionesSub: Subscription;
  usuariosSub: Subscription;
  usuarioSub: Subscription;

  constructor(
    private _apiService: ApiService,
    public _functionService: FunctionsService,
    private formBuilder: FormBuilder,
    private _location: Location,
    private route: ActivatedRoute,
  ) { this.verDetallesFunction = new EventEmitter(); }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.usuarioForm = this.formBuilder.group({
      rol: ['', Validators.required]
      // asignacion: ['', Validators.required]
    }, {});


    this.tipoExpedientesSub = this._apiService.getTipoExpedientes()
      .subscribe(response => {
        this.tipos_usuarios = response
      })
    this._apiService.cargarPeticion(this.tipoExpedientesSub);

    this._apiService.getInmuebles().subscribe((response)=>{
      this.inmuebles = response
      this._functionService.imprimirMensajeDebug(response, "inmuebles")
    })


    this.observacionesSub = this._apiService.getObservaciones()
      .subscribe(response => {
        this.observaciones = response
        this._functionService.imprimirMensajeDebug(response, "observaciones")
      })
    
    this._apiService.cargarPeticion(this.observacionesSub)
    
    this.usuariosSub = this._apiService.getUsuarios()
      .subscribe(response => {
        this.usuarios = response
        this._functionService.imprimirMensajeDebug(response, "usuarios")
      })
    this._apiService.cargarPeticion(this.usuariosSub);

    this._apiService.cargarPeticion(this._apiService.getRoles()
      .subscribe((response:any) => {
        if(!this.desdeExpediente && this._functionService.isAdmin){
          this.roles = response.results
        }else{
          this.roles = response.results.filter(element => { return element.nombre === "ROL_PROFESIONAL" || element.nombre === "ROL_PROPIETARIO"})
        }
        this._functionService.imprimirMensajeDebug(this.roles, "roles")
      }));
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }

  rolChanged(e){
    if(e != null){
      this.selectedRol = e
      this.idRol = e.id
      this.descripcionRol = e.descripcion  
      this.setControlsForm();
    }else{
      this.descripcionRol = null
    }

  }

  setControlsForm(){
    switch (this.selectedRol.descripcion) {
      case "Profesional": // rol profesional
        this.usuarioForm = this.formBuilder.group({
          rol: [this.selectedRol.descripcion, Validators.required],
          nombre: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)])],
          apellido: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)])],
          cuit: ['', Validators.compose([Validators.minLength(11), Validators.pattern(/^[0-9]+$/)])],
          dni: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern(/^[0-9]+$/)])],
          matricula: ['', Validators.compose([Validators.required, Validators.minLength(3), Validators.pattern(/^-?([0-9]\d*)?$/)])],
          direccion: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+\s[0-9\s]+$/)])],
          fecha_nacimiento: ['', Validators.required],
          email: ['', Validators.email],
          telefono: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^-?([0-9]\d*)?$/)])],
          asignacion: [this.selectedRol.asignaciones[0], Validators.required],
          user: [],
          password: [],
        }, {});
        break;

      case "Propietario": // rol propietario
        this.usuarioForm = this.formBuilder.group({
          rol: [this.selectedRol.descripcion, Validators.required],
          nombre: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)])],
          apellido: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)])],
          cuit: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.pattern(/^[0-9]+$/)])],
          dni: ['', Validators.compose([Validators.minLength(7), Validators.pattern(/^[0-9]+$/)])],
          matricula: ['', Validators.compose([Validators.minLength(4), Validators.pattern(/^-?([0-9]\d*)?$/)])],
          direccion: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+\s[0-9\s]+$/)])],
          fecha_nacimiento: ['', Validators.required],
          email: ['', Validators.email],
          telefono: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^-?([0-9]\d*)?$/)])],
          asignacion: [this.selectedRol.asignaciones[0]],
          user: [],
          password: [],
        }, {});
        break;
    
      default: //1,2,5
        this.usuarioForm = this.formBuilder.group({
          rol: [this.selectedRol.descripcion, Validators.required],
          nombre: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)])],
          apellido: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)])],
          cuit: ['', Validators.compose([Validators.minLength(11), Validators.pattern(/^[0-9]+$/)])],
          dni: ['', Validators.compose([Validators.minLength(7), Validators.pattern(/^[0-9]+$/)])],
          matricula: ['', Validators.compose([Validators.minLength(4), Validators.pattern(/^-?([0-9]\d*)?$/)])],
          direccion: ['', Validators.compose([Validators.pattern(/^[a-zA-Z\s]+\s[0-9\s]+$/)])],
          fecha_nacimiento: [''],
          email: ['', Validators.compose([Validators.required, Validators.email])],
          telefono: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^-?([0-9]\d*)?$/)])],
          asignacion: [this.selectedRol.asignaciones[0], Validators.required],
          user: ['', Validators.required],
          password: ['', Validators.required],
        }, {});
        break;
    }
  }
  
  get f() { return this.usuarioForm.controls; }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if((!this.usuarioForm.value.user != !this.usuarioForm.value.password)){
      this.credenciales = true;
      return;
    }else{
      this.credenciales = false;
    }

    if (this.usuarioForm.invalid) {
      return;
    }

    this.loading = true;
    this.createUsuario();

  }

  limpiar() {
    this.usuarioForm.reset();
    this.submitted = false;
  }

  volver() {
    this._location.back();
  }

  createUsuario() {
    this.usuarioForm.value.rol = this.idRol
    this.usuarioForm.value.asignacion = this.selectedRol.asignaciones[0].id
    this.usuarioSub = this._apiService.setUsuario(this.usuarioForm.value)
      .subscribe(() => {
        this._functionService.configSwal(this.mensajeSwal, `Se registro correctamente.`, "success", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire().finally(() => { this.limpiar() });
        this.verDetallesFunction.emit(true);
      })
      this.loading = false;
    this._apiService.cargarPeticion(this.usuarioSub)

    document?.getElementById("closeModalButton")?.click();
  }

}