import { Location } from '@angular/common';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import Swal from 'sweetalert2'
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-crear-usuario',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.scss']
})
export class AgregarUsuarioComponent implements OnInit {

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  @Output() verDetallesFunction: EventEmitter<any>;


  public tipos_usuarios: any;
  public documentos: any;
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
  public roles: any;
  usuarioForm: FormGroup
  // form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;


  constructor(
    private _apiService: ApiService,
    private _functionService: FunctionsService,
    private formBuilder: FormBuilder,
    private _location: Location,
    private route: ActivatedRoute,
    private router: Router,
  ) { this.verDetallesFunction = new EventEmitter(); }

  ngOnInit(): void {

    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    console.log("add mode: ", this.id)

    this.usuarioForm = this.formBuilder.group({
      rol: ['', Validators.required],
      nombre: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)])],
      apellido: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+$/)])],
      cuit: ['', Validators.compose([Validators.required, Validators.minLength(11), Validators.pattern(/^[0-9]+$/)])],
      dni: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern(/^[0-9]+$/)])],
      matricula: ['', Validators.compose([Validators.required, Validators.minLength(4), Validators.pattern(/^-?([0-9]\d*)?$/)])],
      direccion: ['', Validators.compose([Validators.required, Validators.pattern(/^[a-zA-Z\s]+\s[0-9\s]+$/)])],
      fecha_nacimiento: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.email])],
      telefono: ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.pattern(/^-?([0-9]\d*)?$/)])],
      user: [],
      password: []
    }, {});


    // if (!this.isAddMode) {
    //     this._apiService.getExpediente(this.route.snapshot.paramMap.get('id'))
    //     .then(x => this.form.patchValue(x));
    // }


    const tipoExpedientesSub = this._apiService.getTipoExpedientes()
      .subscribe(response => {
        this.tipos_usuarios = response
      })
    this._apiService.cargarPeticion(tipoExpedientesSub);

    this._apiService.getInmuebles().subscribe((response)=>{
      this.inmuebles = response
      this._functionService.imprimirMensaje(response, "inmuebles")
    })
      // .then(response => {
      //   this.inmuebles = response
      //   this._functionService.imprimirMensaje(response, "inmuebles")
      // })

    const observacionesSub = this._apiService.getObservaciones()
      .subscribe(response => {
        this.observaciones = response
        this._functionService.imprimirMensaje(response, "observaciones")
      })
    
    this._apiService.cargarPeticion(observacionesSub)
    
    const usuariosSub = this._apiService.getUsuarios()
      .subscribe(response => {
        this.usuarios = response
        this._functionService.imprimirMensaje(response, "usuarios")
      })
    this._apiService.cargarPeticion(usuariosSub);

    this._apiService.cargarPeticion(this._apiService.getRoles()
      .subscribe(response => {
        this.roles = response
        this._functionService.imprimirMensaje(response, "roles")
      }));


  }

  get f() { return this.usuarioForm.controls; }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
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
    const usuarioSub = this._apiService.setUsuario(this.usuarioForm.value)
      .subscribe(() => {
        this._functionService.configSwal(this.mensajeSwal, `Se registro correctamente.`, "success", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire().finally(() => { this.limpiar() });
        this.verDetallesFunction.emit(true);
      })
      this.loading = false;
    this._apiService.cargarPeticion(usuarioSub)

    document?.getElementById("closeModalButton")?.click();
  }


}