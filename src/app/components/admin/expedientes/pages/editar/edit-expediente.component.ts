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
import * as moment from 'moment'
import { TokenService } from 'src/app/services/token.service';
@Component({
  selector: 'app-editar',
  templateUrl: './edit-expediente.component.html',
  styleUrls: ['./edit-expediente.component.scss']
})



export class EditComponent implements OnInit {

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
         
      });
    
      this.retiroForm = this.formBuilder.group({ //FORMULARIO DE RETIRO 
        descripcion: [{value: '', }, Validators.required],
        documento: [{value: '', }, Validators.required],
        expediente: [{value: '', }, Validators.required],
        usuario: [{value: '', }, Validators.required],
        dni: [{value: ''}]
      });

      this.devolForm = this.formBuilder.group({ //FORMULARIO DE DEVOLUCION num_tramite, tramite_urgente, documento
        num_tramite: [{value: '', }, Validators.required],
        tramite_urgente: [{value: '', }, Validators.required],
        documento: [{value: '', }, Validators.required]
      });
      

      this.expedienteForm.disable();
      this.retiroForm.value.dni = ''

      
    this.message = '';
    
    this.idEdit = false


    this.id = this.route.snapshot.params['id'];

    this.retiroForm.controls['dni'].setValue('');
    //BUSQUEDA Y CARGA CON FILTROS 
    if (this.route.snapshot.queryParams['anio']) {
      this._apiService.getExpedienteNumero(this.route.snapshot.queryParams['numero'], this.route.snapshot.queryParams['anio'])
        .then((x:any) =>{

          this.tramite = x

          this.resultado = x.expediente
          this.documentosexpediente  = this.resultado.documentos

          this.expedienteForm.patchValue(this.resultado)
          this.expedienteForm.patchValue({inmueble: this.resultado.inmueble.chacra});
          

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
          this.spinner.hide()
      }).catch((e)=>{
        
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
        this.spinner.hide()
      });
    }else if (this.route.snapshot.params['id'] && !this.route.snapshot.queryParams['anio'] && !this.route.snapshot.queryParams['numero'])
      {
        this._apiService.getExpediente(this.route.snapshot.params['id'])
        .then((x:any) =>{

          this.tramite = x


          this.resultado = x.expediente
          this.documentosexpediente  = this.resultado.documentos


          console.log('RESULTADO', this.resultado)
          this.expedienteForm.patchValue(this.resultado)
          this.expedienteForm.patchValue({inmueble: this.resultado.inmueble.chacra});
          
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
          this.spinner.hide()
      }).catch((e)=>{
        console.log('error', e)
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
        this.spinner.hide()
      });
      this.retiroForm.patchValue({descripcion: ''});
          

    }
    
    else{
      
      this._apiService.getExpedienteTramite(this.route.snapshot.queryParams['numero'])
        .then((x:any) =>{

          this.tramite = x

          
          this.resultado = x.expediente
          this.documentosexpediente  = this.resultado.documentos
          
          this.expedienteForm.patchValue(this.resultado)
          this.expedienteForm.patchValue({inmueble: this.resultado.inmueble.chacra});
          

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
          this.spinner.hide()
      }).catch((e)=>{
        console.log('error', e)
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
        this.spinner.hide()
      });
      
    }
  

    //CARGA DE DATOS PARA SELECTS
 
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

  leerDni(){

    this.texto =  this.usuario + this.retiroForm.value.dni
    this.retiroForm.controls['dni'].setValue('');

    this.verificarUsuario()
  
  }

  verificarUsuario () {
    let cont = 0
    let dni = ''


    if (this.texto[0] != "@") {
      console.log(this.texto)
      for (let i = 0; i <= this.texto.length; i++) { //DNI NO COMIENZA CON @
        if (this.texto[i] == '@') {
          console.log(this.texto)
          cont++
        }

        if (cont == 4 && this.texto[i] != '@') {
          dni = dni + this.texto[i].toString()
        }
      }
    }


    if (this.texto[0] == "@") {

      console.log(this.texto , '222222')

      for (let i = 0; i <= this.texto.length; i++) { //DNI NO COMIENZA CON @
        if (this.texto[i] == '@') {
          console.log(this.texto)
          cont++
        }
        if (cont == 1 && this.texto[i] != '@' && this.texto[i] != " ") {
          dni = dni + this.texto[i].toString()
        }
      }
    }

     

    
  
    console.log('dni', dni, cont)

    this._apiService.getUsuarioNumero(dni).then((response:any) => {
      this._functionService.imprimirMensaje(response, "usuario")
      console.log(response, 'respuesta')
      this.usuario = response.results[0]
      console.log(this.usuario)

      if (response.count == 0) {
        
        this._functionService.configSwal(this.mensajeSwal, `No existe el usuario`, "Error", "Aceptar", "", false, "", "")
        this.mensajeSwal.fire()
      }
      
    })
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

  imprimirEtiqueta(){
    
    this._functionService.configSwal(this.mensajeSwal, `Imprimiendo Documento`, "success", "Aceptar", "", false, "", "")
    this.mensajeSwal.fire()
    this.imprimir = true
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
       
        return;
    }else{
      this.loading = true;    
      this.setRetiro();
    }

   
  }

  guardarDevol(){
    this.submitted = true;
    // stop here if form is invalid
    if (this.devolForm.invalid) {
        alert('errores')
        
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

  setDevol() {
      for (var id of this.devolForm.value.documento) {

      this.devolForm.patchValue({num_tramite: this.tramite.id});

      this._apiService.setRetiro(this.devolForm.value)
      .then((res: any) =>{
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
