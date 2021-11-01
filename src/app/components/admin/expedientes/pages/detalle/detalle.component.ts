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
  devolForm: FormGroup
  id: string;
  anioParam:string = '';
  numeroParam:string = '';

  // isNumeroAnio:boolean = false;
  isEditMode: boolean;

  loading = false;
  submitted: boolean = false;
  selecteditem: string;
  selectedInmuebles: string;
  selectedtramite: string;
  usuario: any;
  texto: any;
  public busqueda_manual: boolean = false


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
   
    ) {
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
        descripcion: ['', Validators.required],
        documento: ['', Validators.required],
        tramite: [{value: '', }, Validators.required],
        usuario: [''],
        dni: ['']
      });

      this.devolForm = this.formBuilder.group({ //FORMULARIO DE DEVOLUCION num_tramite, tramite_urgente, documento
        num_tramite: [{value: '', }, Validators.required],
        tramite_urgente: [false, Validators.required],
        documentos: ['', Validators.required]
      });

    }
  
  fullName (nombre, apellido){

    var fullName = nombre.charAt(0).toUpperCase() + '. '  + apellido
    return fullName

  }

  public onbusquedamanualChanged(value:boolean){
    this.busqueda_manual = value;
  }


  ngOnInit(): void {

    this.numeroParam = ""
    this.anioParam = ""
    this.submitted = false;
    this.date = moment(new Date()).format('DD/MM/YYYY');
    
    this.fecha_hora = moment(new Date()).format('hh:mm:ss')
    this.user = this._tokenService.getUserName();

    this.spinner.show()
    this._apiService.getDocumentos()
      .then(response => {
        this.documentos = response
        this._functionService.imprimirMensaje(response, "documentos")
        // this.documentosexpediente = this.documentos.results
      })
      .catch(err => {
        this._functionService.imprimirMensaje(err, "error documento: ")
      })

    this.loadPropietarios();
  
    this.loadDocumentos()

    this.id = this.route.snapshot.params['id'];
    this.anioParam = this.route.snapshot.queryParams['anio'];
    this.numeroParam = this.route.snapshot.queryParams['numero']

    this.isEditMode = false;
       
    this.expedienteForm.disable();
    this.retiroForm.value.dni = ''

    this.message = '';
    
    this.idEdit = false

    this.retiroForm.controls['dni'].setValue('');
    //BUSQUEDA Y CARGA CON FILTROS 
    if (this.anioParam) {
      this._apiService.getExpedienteNumero(this.numeroParam, this.anioParam)
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
    }else if (this.id && !this.anioParam && !this.numeroParam)
      {
        this._apiService.getExpediente(this.id)
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

          this._functionService.imprimirMensaje(this.selectedPropietarios, "expediente")
          this.spinner.hide()
      }).catch((e)=>{
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
        this.spinner.hide()
      });
      this.retiroForm.patchValue({descripcion: ''});
          

    }
    
    else{
      
      this._apiService.getExpedienteTramite(this.numeroParam)
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

  get isNumeroAnio(){ 
    let numP = !!this.numeroParam
    let anioP = !!this.anioParam
    return (numP == anioP)? true:false
  }
  
  //IMPRIMIR ETIQUETA
  
  elementType = 'svg';
  public value = '1234567';
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

  zfill(number, width) {
    var numberOutput = Math.abs(number); /* Valor absoluto del número */
    var length = number.toString().length; /* Largo del número */ 
    var zero = "0"; /* String de cero */  
    
    if (width <= length) {
        if (number < 0) {
             return ("-" + numberOutput.toString()); 
        } else {
             return numberOutput.toString(); 
        }
    } else {
        if (number < 0) {
            return ("-" + (zero.repeat(width - length)) + numberOutput.toString()); 
        } else {
            return ((zero.repeat(width - length)) + numberOutput.toString()); 
        }
    }
  }


  get values(): string[] {

    // let value = this.zfill(this.tramite.numero, 7)
    let value = this.tramite?.numero + this.tramite?.codigo_verificacion 
    return value.split('\n');
  }

  get fecha_creacion(): string {
    return moment(this.resultado.created_at).format('DD/MM/YYYY');
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
    this.texto =  this.retiroForm.value["dni"]
    // console.log("texto: ", this.texto)
    //this.retiroForm.controls['dni'].setValue('');
    this.verificarUsuario()
  }

  verificarUsuario () {
    let cont = 0
    let dni = '' 

    if (this.texto[0] != '"') {
      for (let i = 0; i <= this.texto.length; i++) { //DNI NO COMIENZA CON @
        if (this.texto[i] == '"') {
          cont++
        }
        if (cont == 4 && this.texto[i] != '"') {
          dni = dni + this.texto[i].toString()
        }
      }
    }

    if (this.texto[0] == '"') {
      for (let i = 0; i <= this.texto.length; i++) { //DNI NO COMIENZA CON @
        if (this.texto[i] == '"') {
          cont++
        }
        if (cont == 1 && this.texto[i] != '"' && this.texto[i] != " ") {
          dni = dni + this.texto[i].toString()
        }
      }
    }
  
    this._apiService.getUsuarioNumero(dni)
      .then((response:any) => {
        this._functionService.imprimirMensaje(response, "usuario")
        this.usuario = response.results[0]
        this.retiroForm.patchValue({dni: this.usuario?.dni})

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


  private loadDocumentos() {

    this.documentos$ = this.dataService.getDocs()
  }


  compareFn(value, option): boolean {
    return value.id === option.id;
}

  verHistorial(){
    this.router.navigate(['historial/buscar/'+this.tramite.numero])
  }

  imprimirEtiqueta(){
    
    this._functionService.configSwal(this.mensajeSwal, `Imprimiendo Documento \n(cerrar ventana de impresión para continuar)`, "success", "Aceptar", "", false, "", "")
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
        return;
    }

    this.loading = true;    
    this.updateExpediente();
  
  }

  guardarRetiro(){
    this.submitted = true;
    // stop here if form is invalid
    if(this.retiroForm.value["dni"]=="" && this.retiroForm.value["usuario"]=="") return
    if (this.retiroForm.invalid) {       
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
        return;
    }else{
      this.loading = true;    
      this.setDevol();
    }
  }

  
  get f() { return this.expedienteForm.controls; }
  get r() { return this.retiroForm.controls; }
  get d() { return this.devolForm.controls; }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  updateExpediente() {
    
    this._apiService.editExpediente(this.expedienteForm.value)
    .then(() =>{
      this._functionService.configSwal(this.mensajeSwal, `Se ha editado correctamente`, "success", "Aceptar", "", false, "", "")
      this.mensajeSwal.fire();
    })
    .catch((e)=>{
      this._functionService.configSwal(this.mensajeSwal, `No se pudo editar el expediente`, "error", "Aceptar", "", false, "", "")
      this.mensajeSwal.fire();
      this.loading = false;
    });

  }


  setRetiro() {
    this.loading = true;
    if (this.busqueda_manual != true) {
      this.retiroForm.patchValue({usuario: this.usuario.id});
    }

    if(this.retiroForm.value.documento != null){
      for (var id of this.retiroForm.value.documento) {
        this.retiroForm.patchValue({documento: id});
        this.retiroForm.patchValue({tramite: this.tramite.id});
  
        this._apiService.setRetiro(this.retiroForm.value)
          .then((res: any) =>{
            this._functionService.configSwal(this.mensajeSwal, `Se ha registrado correctamente`, "success", "Aceptar", "", false, "", "")
            this.mensajeSwal.fire();
            this.loading = false;
            document.getElementById("closeModalRetiroButton").click();
          })
          .catch((e)=>{
            this._functionService.configSwal(this.mensajeSwal, `No se ha podido registrar el retiro`, "error", "Aceptar", "", false, "", "")
            this.mensajeSwal.fire();
            this.loading = false;
          })
          .finally(() =>{
            this.retiroForm.reset()
            this.usuario = ""
            this.ngOnInit()
          })
      } 
    }else{
      this.loading = false;
    }
    
    
  }

  setDevol() {

      this.devolForm.patchValue({num_tramite: this.tramite.numero});
      this._apiService.setDevol(this.devolForm.value)
        .then((res: any) =>{        
          this.loading = false;
          this._functionService.configSwal(this.mensajeSwal, 'Nueva presentación registrada', "success", "Aceptar", "", false, "", "")
          this.mensajeSwal.fire();
          document.getElementById("closeModalDevolButton").click();
          this.ngOnInit()
        })
        .catch((e)=>{
          this._functionService.configSwal(this.mensajeSwal, `No se pudo realizar la presentación`, "error", "Aceptar", "", false, "", "")
          this.mensajeSwal.fire();
          this.loading = false;
        });
  }

  
  verDetalles(dato:boolean){
    this._apiService.getInmueblesDisponibles().then(response => {
      this.inmuebles = response
    })
  } 

  verDetallesUsuarios(dato:boolean){
    this._apiService.getUsuarios().then(response => {
      this.usuarios = response
    })
  } 

  verTramite(){
    this.router.navigate(['expediente/',this.id])
    .then(response => {
      this.ngOnInit()
    })
    
  }

  cancelarRetiro(){
    this.limpiar(this.retiroForm)
    this.usuario = ""
  }


  limpiar(formulario){
    formulario.reset();
  }
}
