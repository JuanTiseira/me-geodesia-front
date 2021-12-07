import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2'
import { AuthService } from '../../../../../services/auth.service';
import { Role } from 'src/app/models/role.models';
import { NgxSpinnerService } from 'ngx-spinner';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { DataService, Documento, Person } from 'src/app/services/data.service';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment'
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-editar',
  templateUrl: './editar.component.html',
  styleUrls: ['./editar.component.scss']
})
export class EditarComponent implements OnInit, OnDestroy {

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  
  idEdit: boolean
  resultado = null;
  message = '';
  usuarioForm: FormGroup;
  id: string;
  isEditMode: boolean;
  loading = false;
  submitted = false;
  selecteditem: string;
  selectedInmuebles: string;
  selectedtramite: string;
  usuario: any;
  texto: any;

  usuario$: Observable<Person[]>;

  documentosSub: Subscription;
  usuarioSub: Subscription;
  editUsuarioSub: Subscription;
  retiroSub: Subscription;
  

  agrimensorLoading = false;
  gestorLoading = false;
  propietarioLoading = false;
  documentoLoading = false;
  usuarioLoading = false;
  credenciales = false;

  usuarioInput$ = new Subject<string>();

  usuarioDocumentos: Documento[] = <any>[{}];

  public usuarios: any;
  public roles: any;
  documentosexpediente: any;
  imprimir: boolean;
  date: any;
  tramite: any;
  fecha_hora: string;
  user: any;



  constructor(
    private dataService: DataService,
    private _apiService: ApiService,
    private _functionService: FunctionsService ,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService,
    private _tokenService: TokenService
   
    ) {}
  
  fullName (nombre, apellido){

    var fullName = nombre.charAt(0).toUpperCase() + '. '  + apellido
    return fullName

  }


  ngOnInit(): void {
    this.date = moment(new Date()).format('DD/MM/YYYY');
    this.fecha_hora = moment(new Date()).format('hh:mm:ss')
    this.user = this._tokenService.getUserName();
    
    this.spinner.show()

    this.id = this.route.snapshot.params['id'];

    this.isEditMode = false;
    
    this.usuarioForm = this.formBuilder.group({
      rol: [],
      nombre: [],
      apellido: [],
      cuit: [],
      dni: [],
      matricula: [],
      direccion: [],
      fecha_nacimiento: [],
      email: [],
      telefono: [],
      user: [],
      password: []
    }, {});
 
      


    this.id = this.route.snapshot.params['id'];

    //BUSQUEDA Y CARGA CON FILTROS 
    if (this.route.snapshot.params['id']){
        this.usuarioSub = this._apiService.getUsuario(this.route.snapshot.params['id'])
          .subscribe((x:any) =>{
            this.tramite = x
            this.resultado = x.usuario
            this.spinner.hide()
          }, (err) => {
            this.spinner.hide()
          })
          
        this._apiService.cargarPeticion(this.usuarioSub);

    }


    this._apiService.cargarPeticion(this._apiService.getRoles()
    .subscribe(response => {
      this.roles = response
      this._functionService.imprimirMensaje(response, "roles")
    }));
    
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }

  trackByFn(item: Person) {
    return item.id;
  }
  

  compareFn(value, option): boolean {
    return value.id === option.id;
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if((!this.usuarioForm.value.user != !this.usuarioForm.value.password)){
      this.credenciales = true;
      return;
    }else{
      this.credenciales = false;
    }
    this.loading = true;    
    this.updateExpediente();
  
  }

  get f() { return this.usuarioForm.controls; }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  updateExpediente() {
    let formulario = {}
    for(let i in this.usuarioForm.value){
      if(this.usuarioForm.value[i]){
        formulario[i] = this.usuarioForm.value[i]
      }
    }
      
    this.editUsuarioSub = this._apiService.editUsuario(this.id, formulario)
      .subscribe((res) =>{
        Swal.fire({
          title: 'Exito',
          text: 'Se modificó correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        }).finally(() => {
          this.ngOnInit();
        })
      })
    this._apiService.cargarPeticion(this.editUsuarioSub);  
    this.loading = false;
  }

  limpiar() {
    this.usuarioForm.reset();
    this.submitted = false;
  }

 
}
