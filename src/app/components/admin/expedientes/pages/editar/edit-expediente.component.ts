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
import { DataService, Documento, Inmueble, Person } from 'src/app/services/data.service';
import { catchError, debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import * as moment from 'moment'
import { TokenService } from 'src/app/services/token.service';
import { NgSelectComponent } from '@ng-select/ng-select';
@Component({
  selector: 'app-editar',
  templateUrl: './edit-expediente.component.html',
  styleUrls: ['./edit-expediente.component.scss']
})



export class EditComponent implements OnInit, OnDestroy{

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  @ViewChild('ngselectmensura') ngselectmensura: NgSelectComponent;
  
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
  inmueble$: Observable<Inmueble[]>;

  documentosSub: Subscription;
  expedienteSub: Subscription;
  usuarioSub: Subscription;
  editExpedienteSub: Subscription;
  retiroSub: Subscription;
  tipoExpedientesSub: Subscription;
  abreviaturasSub: Subscription;
  

  agrimensorLoading = false;
  gestorLoading = false;
  propietarioLoading = false;
  documentoLoading = false;
  usuarioLoading = false;
  inmuebleLoading = false;
  


  agrimensorInput$ = new Subject<string>();
  inmuebleInput$ = new Subject<string>();
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
  abreviaturas:any;
  imprimir: boolean;
  date: any;
  tramite: any;
  fecha_hora: string;
  user: any;
  minLengthTerm = 3;



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
    this.loadInmuebles();

    // this.abreviaturasSub = this._apiService.getAbreviaturas()
    // .subscribe((response:any) => {
    //   this.abreviaturas = response.results
    // })
    // this._apiService.cargarPeticion(this.abreviaturasSub);

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
        mensura: [],
        agrimensor: [],
        tramite_urgente: []
      });
 
      


    this.id = this.route.snapshot.params['id'];

    //BUSQUEDA Y CARGA CON FILTROS 
    if (this.route.snapshot.params['id']){
        this.expedienteSub = this._apiService.getExpediente(this.route.snapshot.params['id'])
          .subscribe((x:any) =>{
            this.tramite = x
            this.expedienteForm.patchValue({tramite_urgente: this.tramite?.tramite_urgente});
            this.resultado = x.expediente
            this.documentosexpediente  = this.resultado.documentos

            this.selecteditem = this.resultado.tipo_expediente
            this.abreviaturas = this.resultado.tipo_expediente?.mensuras
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
    this.loadInmuebles();
    
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }

  trackByFn(item: Person) {
    return item.id;
  }
  

  private loadPropietarios() {
    this.propietario$ = this.propietarioInput$.pipe(
                          filter(res => {
                            return res !== null && res.length >= this.minLengthTerm
                          }),
                          distinctUntilChanged(),
                          debounceTime(800),
                          switchMap(term => this.dataService.getPeople(term))
                        )
  }

  private loadGestores() {
    this.gestor$ =  this.gestorInput$.pipe(
                      filter(res => {
                        return res !== null && res.length >= this.minLengthTerm
                      }),
                      distinctUntilChanged(),
                      tap(() => this.gestorLoading = true),
                      debounceTime(800),
                      switchMap(term => this.dataService.getPeople(term).pipe(
                        tap(() => this.gestorLoading = false))
                    ))
  }


  private loadAgrimensores() {
    this.agrimensor$ =  this.agrimensorInput$.pipe(
                          filter(res => {
                            return res !== null && res.length >= this.minLengthTerm
                          }),
                          distinctUntilChanged(),
                          tap(() => this.agrimensorLoading = true),
                          debounceTime(800),
                          switchMap(term => this.dataService.getPeople(term).pipe(
                            tap(() => this.agrimensorLoading = false))
                        ))
  }

  private loadInmuebles() {
    this.inmueble$ =  this.inmuebleInput$.pipe(
                          filter(res => {
                            return res !== null && res.length >= 2
                          }),
                          distinctUntilChanged(),
                          tap(() => this.inmuebleLoading = true),
                          debounceTime(800),
                          switchMap(term => this.dataService.getInmuebles(term).pipe(
                            tap(() => this.inmuebleLoading = false))
                        ))
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
      console.log(this.expedienteForm.value[i])
      if(this.expedienteForm.value[i] != null){
        formulario[i] = this.expedienteForm.value[i]
      }
    }

    if(this.expedienteForm.value.tipo_expediente != null && this.expedienteForm.value.mensura == null){
      this._functionService.configSwal(this.mensajeSwal, `Si se modifica el tipo de expediente debe modificar la mensura.`, "error", "Aceptar", "", false, "", "");
      this.mensajeSwal.fire()
      this.loading = false;  
      return;
    }
      
    this.editExpedienteSub = this._apiService.editExpediente(this.id, formulario)
      .subscribe((res) =>{
        this._functionService.configSwal(this.mensajeSwal, `Se modificó correctamente.`, "success", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire().finally(() => this.ngOnInit())
      })
    this._apiService.cargarPeticion(this.editExpedienteSub);  
    this.loading = false;
  }


  tipoExpedienteChanged(e){
    this.ngselectmensura.handleClearClick();
    let tipo_expediente = this.tipos_expedientes.results.find(mensuras => mensuras.id === e)
    this.abreviaturas = tipo_expediente.mensuras
  }

  limpiarMensuras(){
    this.abreviaturas = null;
  }

 
}
