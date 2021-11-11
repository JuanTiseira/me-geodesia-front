import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Role } from 'src/app/models/role.models';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { concat, Observable, of, Subject, Subscription} from 'rxjs';
import { DataService, Documento, Person } from 'src/app/services/data.service';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})

export class BuscarComponent implements OnInit, OnDestroy {

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  closeResult = '';
  
  public page: number = 0;
  public search: string = '';
  public expedientes: any;
  public load: boolean;

  public tipos_expedientes: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
  public tipo_consulta: any;

  public selectedItems: any
  public tramite_urgente: boolean = false

  p: number = 1;
  submitted = false;
  
  agrimensor$: Observable<Person[]>;
  gestor$: Observable<Person[]>;
  propietario$: Observable<Person[]>;
  documento$: Observable<Documento[]>;

  tipoExpedientesSub: Subscription;
  usuariosSub: Subscription;
  deleteExpedienteSub: Subscription;
  expedienteSub: Subscription;
  expedientesSub: Subscription;

  agrimensorLoading = false;
  gestorLoading = false;
  propietarioLoading = false;
  documentoLoading = false;


  agrimensorInput$ = new Subject<string>();
  propietarioInput$ = new Subject<string>();
  gestorInput$ = new Subject<string>();
  documentoInput$ = new Subject<string>();


  selectedAgrimensores: Person[] = <any>[{}];
  selectedPropietarios: Person[] = <any>[{}];
  selectedGestores: Person[] = <any>[{}];
  selectedDocumentos: Documento[] = <any>[{}];

  expediente: string
  tramite: string
  param_busqueda: ''
  consultaForm : FormGroup
  categories = [
    {id: 1, name: 'Expediente', value: 'expediente'},
    {id: 2, name: 'Tramite', value: 'tramite'},
  ]

  constructor( private _apiService: ApiService,
                private dataService: DataService,
                private _functionService: FunctionsService ,
                private authService: AuthService,
                private formBuilder: FormBuilder,
                private router: Router,
                private spinner: NgxSpinnerService
                ) { this.load = false; }

  ngOnInit(): void {    
    this.consultaForm = this.formBuilder.group({
      param_busqueda: ['', Validators.required],   
      numero: ['', Validators.compose([Validators.required, Validators.maxLength(8), Validators.pattern(/^-?([0-9]\d*)?$/)])],
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
      this.loadPropietarios();
      this.loadGestores();
      this.loadAgrimensores();
      this.loadDocumentos();
      
      this.tipoExpedientesSub = this._apiService.getTipoExpedientes()
        .subscribe(response => {
          this.tipos_expedientes = response
        })
      this._apiService.cargarPeticion(this.tipoExpedientesSub);

      this._apiService.getInmuebles().subscribe((response)=>{
        this.inmuebles = response
        this._functionService.imprimirMensaje(response, "inmuebles")
      })
        // .then(response => {
        //   this.inmuebles = response
        //   this._functionService.imprimirMensaje(response, "inmuebles")
        // })
       
  
      this.usuariosSub = this._apiService.getUsuarios()
        .subscribe(response => {
          this.usuarios = response
          this._functionService.imprimirMensaje(response, "usuarios")
        })
      this._apiService.cargarPeticion(this.usuariosSub)

  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }

  buscar () {
    alert('buscado')
  }

  eliminar (id) {
    this._functionService.configSwal(this.mensajeSwal, `Está seguro de eliminar esto?.`, "warning", "Aceptar", "Cancelar", true, "", "d33");
    this.mensajeSwal.fire()
      .then((result) => {
      if (result.isConfirmed) {
        this.deleteExpedienteSub = this._apiService.deleteExpediente(id)
          .subscribe(() =>{ 
            this._functionService.configSwal(this.mensajeSwal, `El expediente fue eliminado.`, "success", "Aceptar", "", false, "", "");
            this.mensajeSwal.fire()
            this.buscarExpedientes()
          })
        this._apiService.cargarPeticion(this.deleteExpedienteSub)  
        }
    })
  }

  onTableDataChange(event) {
    this.spinner.show();
    this._apiService.changePage(event, 'expedientes')
      .then((res) =>{

        this.p =  event
        this.expedientes = res        
        if (this.expedientes.count == 0) {
          this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
          this.mensajeSwal.fire()
        }else{
          this.expedientes = res
        }
        this.load = false;
      
      })
      .catch(()=>{
        this._functionService.imprimirMensaje(event, "error onTableDataChange: ")
      })
      .finally(()=>{
        this.spinner.hide();
      })

  } 

  buscarAnterior() {
    alert('anterior pagina')
  }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  get isEmpleado() {
    return this.authService.hasRole(Role.ROL_EMPLEADO);
  }

  get isEmpleadoME() {
    return this.authService.hasRole(Role.ROL_EMPLEADOME);
  }

  buscarExpediente() {

    this.submitted = true;
    if (this.consultaForm.invalid) {
      this._functionService.imprimirMensaje(this.consultaForm, "consulta form: ")
      return;
    
    }
    this.spinner.show();
    
    var numeroanio = this.consultaForm.value.numero

    this._functionService.imprimirMensaje(numeroanio, "numero anio: ")

    
    
    if (this.consultaForm.value.param_busqueda == 'expediente') {
      
      if(numeroanio.toString().length > 5) {
        this._functionService.imprimirMensaje(numeroanio.toString().length, "numero anio: ")

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
              //BUSCA POR NUMERO DE EXPEDIENTE Y TRAE EL TRAMITE CON OBSERVACION Y EXPEDIENTE

        this.expedienteSub = this._apiService.getExpedienteNumero(numero, anio)
        .subscribe((x:any) =>{
          this.router.navigate(['/expediente/'+x.expediente.id],{ queryParams: { numero: numero , anio: anio} }); //TOMA EL ID DEL OBJETO Y MUESTRA EL DETALLE
        })
        this._apiService.cargarPeticion(this.expedienteSub)
      }else{
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire();
      }

    }else{

      //BUSCA POR NUMERO DE TRAMITE Y TRAE EL TRAMITE CON OBSERVACION Y EXPEDIENTE
      this.expedienteSub = this._apiService.getExpedienteTramite(numeroanio)
        .subscribe((x:any) =>{
          this.router.navigate(['/expediente/'+x.expediente.id],{ queryParams: { numero: numeroanio } }); //TOMA EL ID DEL OBJETO Y MUESTRA EL DETALLE 
        })
      this._apiService.cargarPeticion(this.expedienteSub);
    }
    this.spinner.hide();
  }

  rangeYear () {
    const max = new Date().getFullYear()
    const min = max - 100
    const years = []
    for (let i = max; i >= min; i--) {
        years.push(i)
    }
    return years
  }
  
  buscarExpedientes() {
    this.spinner.show();
    this._functionService.imprimirMensaje(this.consultaForm.value, "formulario: ")
    this.expedientesSub = this._apiService.getExpedientesFiltros(this.consultaForm.value)
      .subscribe((res) =>{
        this.expedientes = res
        if (this.expedientes.count == 0) {
          this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
          this.mensajeSwal.fire()
        }else{
          this.expedientes = res
        }
        this.load = false;
        this.spinner.hide();
      },(error)=>{
        this.expedientes = []
        this.spinner.hide();
        
      })
    this._apiService.cargarPeticion(this.expedientesSub);
  }

  limpiar() {
    this.consultaForm.reset();
  }

  trackByFn(item: Person) {
    return item.id;
  }

  get f() { return this.consultaForm.controls; }

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
    this.documento$ = concat(
        of([]), // items por defecto
        this.documentoInput$.pipe(
            distinctUntilChanged(),
            tap(() => this.documentoLoading = true),
            switchMap(term => this.dataService.getDocs(term).pipe(
                catchError(() => of([])), // limpiar lista error
                tap(() => this.documentoLoading = false)
            ))
        )
    );
  }
  
}