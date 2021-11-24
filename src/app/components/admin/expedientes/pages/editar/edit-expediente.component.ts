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
  templateUrl: './edit-expediente.component.html',
  styleUrls: ['./edit-expediente.component.scss']
})



export class EditComponent implements OnInit, OnDestroy{

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  
  idEdit: boolean
  resultado = null;
  message = '';
  expedienteForm: FormGroup;
  retiroForm: FormGroup
  devolForm: FormGroup
  id: string;
  isEditMode: boolean;
  loading = false;
  submitted = false;
  selecteditem: string;
  selectedInmuebles: string;
  selectedtramite: string;
  usuario: any;
  texto: any;


  agrimensor$: Observable<Person[]>;
  gestor$: Observable<Person[]>;
  propietario$: Observable<Person[]>;
  documento$: Observable<Documento[]>;
  documentos$: Observable<Documento[]>;
  usuario$: Observable<Person[]>;

  documentosSub: Subscription;
  expedienteSub: Subscription;
  usuarioSub: Subscription;
  editExpedienteSub: Subscription;
  retiroSub: Subscription;
  tipoExpedientesSub: Subscription;
  

  agrimensorLoading = false;
  gestorLoading = false;
  propietarioLoading = false;
  documentoLoading = false;
  usuarioLoading = false;


  agrimensorInput$ = new Subject<string>();
  propietarioInput$ = new Subject<string>();
  gestorInput$ = new Subject<string>();
  documentoInput$ = new Subject<string>();
  usuarioInput$ = new Subject<string>();


  selectedAgrimensores: Person[] = <any>[{}];
  selectedPropietarios: Person[] = <any>[{}];
  selectedGestores: Person[] = <any>[{}];
  selectedDocumentos: Documento[] = <any>[{}];
  usuarioDocumentos: Documento[] = <any>[{}];


  public tipos_expedientes: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
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
    this.documentosSub = this._apiService.getDocumentos()
      .subscribe(response => {
        this.documentos = response
        this._functionService.imprimirMensaje(response, "documentos")
      })
    this._apiService.cargarPeticion(this.documentosSub);

    this.loadPropietarios();
    this.loadGestores();
    this.loadAgrimensores();
    this.loadDocumentos()

    this.id = this.route.snapshot.params['id'];

    this.isEditMode = false;
    
    this.expedienteForm = this.formBuilder.group({
        tipo_expediente: [],
        inmueble: [],
        documentos: [],
        propietario: [],
        gestor: [],
        tramite: [],
        observacion: [],
        abreviatura: [],
        agrimensor: [],
        tramite_urgente: []
      });
 
      


    this.id = this.route.snapshot.params['id'];

    //BUSQUEDA Y CARGA CON FILTROS 
    if (this.route.snapshot.params['id']){
        this.expedienteSub = this._apiService.getExpediente(this.route.snapshot.params['id'])
          .subscribe((x:any) =>{
            this.tramite = x
            this.resultado = x.expediente
            this.documentosexpediente  = this.resultado.documentos

            this.selecteditem = this.resultado.tipo_expediente
            this.selectedInmuebles = this.resultado.inmueble
            this.selectedDocumentos = this.resultado.documentos
          
            this.selectedPropietarios = this.resultado.propietario
            this.selectedGestores = this.resultado.gestor
            this.selectedAgrimensores = this.resultado.agrimensor
            this.selectedtramite = this.resultado.tramite

            this._functionService.imprimirMensaje(this.selectedPropietarios, "expediente")
            this.spinner.hide()
          })
          
        this._apiService.cargarPeticion(this.expedienteSub);

        this.tipoExpedientesSub = this._apiService.getTipoExpedientes()
        .subscribe(response => {
          this.tipos_expedientes = response
        })
      this._apiService.cargarPeticion(this.tipoExpedientesSub);

    }
  
    //CARGA DE DATOS PARA SELECTS
 
    this.loadPropietarios()
    this.loadGestores();
    this.loadDocumentos();
    this.loadAgrimensores();
    
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }

  trackByFn(item: Person) {
    return item.id;
  }
  

  private loadPropietarios() {
    this.propietario$ = concat(
        of([]), // items por defecto
        this.propietarioInput$.pipe(
            distinctUntilChanged(),
            tap(() => this.propietarioLoading = true),
            switchMap(term => this.dataService.getPeople(term).pipe(
                catchError(() => of([])), // limpiar lista error
                tap(() => this.propietarioLoading = false)
            ))
        )
    );
  }

  private loadGestores() {
    this.gestor$ = concat(
        of([]), // items por defecto
        this.gestorInput$.pipe(
            distinctUntilChanged(),
            tap(() => this.gestorLoading = true),
            switchMap(term => this.dataService.getPeople(term).pipe(
                catchError(() => of([])), // limpiar lista error
                tap(() => this.gestorLoading = false)
            ))
        )
    );
  }


  private loadAgrimensores() {
    this.agrimensor$ = concat(
        of([]), // items por defecto
        this.agrimensorInput$.pipe(
            distinctUntilChanged(),
            tap(() => this.agrimensorLoading = true),
            switchMap(term => this.dataService.getPeople(term).pipe(
                catchError(() => of([])), // limpiar lista error
                tap(() => this.agrimensorLoading = false)
            ))
        )
    );
  }

  private loadDocumentos() {
    this.documentos$ = this.dataService.getDocs()
  }


  compareFn(value, option): boolean {
    return value.id === option.id;
  }


  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.expedienteForm.invalid) {
        return;
    }
    this.loading = true;    
    this.updateExpediente();
  
  }

  get f() { return this.expedienteForm.controls; }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  updateExpediente() {
    let formulario = {}
    for(let i in this.expedienteForm.value){
      if(this.expedienteForm.value[i]){
        formulario[i] = this.expedienteForm.value[i]
      }
    }
      
    this.editExpedienteSub = this._apiService.editExpediente(this.id, formulario)
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
    this._apiService.cargarPeticion(this.editExpedienteSub);  
    this.loading = false;
  }

 
}
