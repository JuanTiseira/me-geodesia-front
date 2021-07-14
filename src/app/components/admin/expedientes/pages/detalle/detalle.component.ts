import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2'
import { AuthService } from '../../../../../services/auth.service';
import { Role } from 'src/app/models/role.models';
import { NgxSpinnerService } from 'ngx-spinner';
import { concat, Observable, of, Subject } from 'rxjs';
import { DataService, Documento, Person } from 'src/app/services/data.service';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})



export class DetalleComponent implements OnInit {

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  
  idEdit: boolean
  resultado = null;
  message = '';
  expedienteForm: FormGroup;
  retiroForm: FormGroup
  id: string;
  isEditMode: boolean;
  loading = false;
  submitted = false;
  selecteditem: string;
  selectedInmuebles: string;
  selectedtramite: string;


    agrimensor$: Observable<Person[]>;
    gestor$: Observable<Person[]>;
    propietario$: Observable<Person[]>;
    documento$: Observable<Documento[]>;
    documentos$: Observable<Documento[]>;

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


  public tipos_expedientes: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
  documentosexpediente: any;



  constructor(
    private dataService: DataService,
    private _apiService: ApiService,
    private _functionService: FunctionsService ,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private spinner: NgxSpinnerService
   
    ) {}



  ngOnInit(): void {

    this._apiService.getDocumentos().then(response => {
      this.documentos = response
      this._functionService.imprimirMensaje(response, "documentos")
    })


    this.loadPropietarios();
    this.loadGestores();
    this.loadAgrimensores();
    this.loadDocumentos()

    this.id = this.route.snapshot.params['id'];

    this.isEditMode = false;
    
    this.expedienteForm = this.formBuilder.group({

        tipo_expediente: [{value: '', }, Validators.required],
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
    
      this.retiroForm = this.formBuilder.group({
        descripcion: [{value: '', }, Validators.required],
        documento: [{value: '', }, Validators.required],
        expediente: [{value: '', }, Validators.required],
        usuario: [{value: '', }, Validators.required],
      }, {
         
      });
      

      this.expedienteForm.disable();


      
    this.message = '';
    
    this.idEdit = false


    this.id = this.route.snapshot.params['id'];


    //BUSQUEDA Y CARGA CON FILTROS 
    if (this.route.snapshot.queryParams['anio']) {
      this._apiService.getExpedienteNumero(this.route.snapshot.queryParams['numero'], this.route.snapshot.queryParams['anio'])
        .then((x:any) =>{

          this.resultado = x.expediente
          this.documentosexpediente  = this.resultado.documentos

          this.expedienteForm.patchValue(this.resultado)

          if (x.observacion != null) {
            this.expedienteForm.patchValue({observacion: x.observacion.descripcion});
          }

          this.selecteditem = this.resultado.tipo_expediente
          this.selectedInmuebles = this.resultado.inmueble
          this.selectedDocumentos = this.resultado.documentos
          this.selectedPropietarios = this.resultado.propietario
          this.selectedGestores = this.resultado.gestor
          this.selectedAgrimensores = this.resultado.agrimensor
          this.selectedtramite = this.resultado.tramit
          this._functionService.imprimirMensaje(x, "expediente")
          
      }).catch((e)=>{
        
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      });
    }else if (this.route.snapshot.params['id'] && !this.route.snapshot.queryParams['anio'] && !this.route.snapshot.queryParams['numero'])
      {
        this._apiService.getExpediente(this.route.snapshot.params['id'])
        .then((x:any) =>{

          this.resultado = x.expediente
          this.documentosexpediente  = this.resultado.documentos


          console.log('RESULTADO', this.resultado)
          this.expedienteForm.patchValue(this.resultado)

          if (x.observacion != null) {
            this.expedienteForm.patchValue({observacion: x.observacion.descripcion});
          }
        
          this.selecteditem = this.resultado.tipo_expediente
          this.selectedInmuebles = this.resultado.inmueble
          this.selectedDocumentos = this.resultado.documentos
         
          this.selectedPropietarios = this.resultado.propietario
          this.selectedGestores = this.resultado.gestor
          this.selectedAgrimensores = this.resultado.agrimensor
          this.selectedtramite = this.resultado.tramite

          this._functionService.imprimirMensaje(this.selectedPropietarios, "expediente")
          
      }).catch((e)=>{
        console.log('error', e)
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
        
      });
      this.retiroForm.patchValue({descripcion: ''});
          

    }
    
    else{
      
      this._apiService.getExpedienteTramite(this.route.snapshot.queryParams['numero'])
        .then((x:any) =>{
          
          this.resultado = x.expediente
          this.documentosexpediente  = this.resultado.documentos
          
          this.expedienteForm.patchValue(this.resultado)
          if (x.observacion != null) {
            this.expedienteForm.patchValue({observacion: x.observacion.descripcion});
          }

          this.selecteditem = this.resultado.tipo_expediente
          this.selectedInmuebles = this.resultado.inmueble
          this.selectedDocumentos = this.resultado.documentos
          this.selectedPropietarios = this.resultado.propietario
          this.selectedGestores = this.resultado.gestor
          this.selectedAgrimensores = this.resultado.agrimensor
          this.selectedtramite = this.resultado.tramite

          this._functionService.imprimirMensaje(x, "expediente")
          
      }).catch((e)=>{
        console.log('error', e)
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      });

    }
  

    //CARGA DE DATOS PARA SELECTS
    this._apiService.getTipoExpedientes().then(response => {
      this.tipos_expedientes = response
      //this.tipos_expedientes = response
    })

    this._apiService.getTramites().then(response => {
      this.tramites = response
      this._functionService.imprimirMensaje(response, "tramites")
    })

    this._apiService.getInmuebles().then(response => {
      this.inmuebles = response
      this._functionService.imprimirMensaje(response, "inmuebles")
    })

    this._apiService.getObservaciones().then(response => {
      this.observaciones = response
      this._functionService.imprimirMensaje(response, "observaciones")
    })

    this._apiService.getUsuarios().then(response => {
      this.usuarios = response
      this._functionService.imprimirMensaje(response, "usuarios")
    })

    this.loadPropietarios()

  //FIN CARGAR DATOS PARA SELECTS
  }

  trackByFn(item: Person) {
    return item.id;
  }
  
  //IMPRIMIR ETIQUETA
  
  elementType = 'svg';
  value = '1234567';
  format = 'EAN8';
  lineColor = '#000000';
  width = 1.5;
  height = 24;
  displayValue = true;
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 24;
  background = '#ffffff';
  margin = 0;
  marginTop = 0;
  marginBottom = 0;
  marginLeft = 0;
  marginRight = 0;

  get values(): string[] {
    return this.value.split('\n');
  }
  codeList: string[] = [
    '', 'CODE128',
    'CODE128A', 'CODE128B', 'CODE128C',
    'UPC', 'EAN8', 'EAN5', 'EAN2',
    'CODE39',
    'ITF14',
    'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
    'pharmacode',
    'codabar'
  ];


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

  imprimirEtiqueta(){
    
    this._functionService.configSwal(this.mensajeSwal, `Imprimiendo Documento`, "success", "Aceptar", "", false, "", "")
    this.mensajeSwal.fire()
  }

  editar (){
    this.isEditMode = true
    this.expedienteForm.enable();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.expedienteForm.invalid) {
        alert('errores')
        console.log(this.expedienteForm)
        return;
    }

    this.loading = true;    
    this.updateExpediente();
  
  }

  guardarRetiro(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.retiroForm.invalid) {
        alert('errores')
        console.log(this.expedienteForm)
        return;
    }else{
      this.loading = true;    
      this.setRetiro();
    }

   
  }

  
  get f() { return this.expedienteForm.controls; }

  get r() { return this.retiroForm.controls; }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  updateExpediente() {
    
    
    this._apiService.editExpediente(this.expedienteForm.value)
    .then(() =>{
      console.warn(this.expedienteForm.value);
      Swal.fire({
        title: 'Exito',
        text: 'Se registro correctamente',
        icon: 'error',
        confirmButtonText: 'Cool',
      })
    })
    .catch((e)=>{
     Swal.fire({
        title: 'Error!',
        text: 'No se guardo correctamente',
        icon: 'error',
        confirmButtonText: 'Cool'
      })
      this.loading = false;
    });

  }


  setRetiro() {
  
    console.info('FORMULARIO RETIRO', this.retiroForm.value.documento)

    for (var id of this.retiroForm.value.documento) {

      this.retiroForm.patchValue({documento: id});
      this.retiroForm.patchValue({expediente: this.resultado.id});

      console.log(this.retiroForm)
      this._apiService.setRetiro(this.retiroForm.value)
      .then((res: any) =>{

        console.warn(res);
        Swal.fire({
          title: 'Exito',
          text: 'Se registro correctamente',
          icon: 'success',
          confirmButtonText: 'Cool',
        })
        this.loading = false;
        document.getElementById("closeModalRetiroButton").click();
      })
      .catch((e)=>{
      Swal.fire({
          title: 'Error!',
          text: 'No se pudo registrar',
          icon: 'error',
          confirmButtonText: 'Cool'
        })
        this.loading = false;
    });
    } 
  }

 
}
