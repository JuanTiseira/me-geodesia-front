import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from '../../../../../services/auth.service';
import { Role } from 'src/app/models/role.models';
import { NgxSpinnerService } from 'ngx-spinner';
import { concat, Observable, of, Subject, Subscription } from 'rxjs';
import { DataService, Documento, Person, Inmueble } from 'src/app/services/data.service';
import { catchError, distinctUntilChanged, switchMap, tap, debounceTime, filter } from 'rxjs/operators';
import * as moment from 'moment'
import { TokenService } from 'src/app/services/token.service';
@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})



export class DetalleComponent implements OnInit, OnDestroy{

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
  textObservacion:string = '';

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
  profesionale$: Observable<Person[]>;
  inmueble$: Observable<Inmueble[]>;
  documento$: Observable<Documento[]>;
  documentos$: Observable<Documento[]>;
  usuario$: Observable<Person[]>;

  agrimensorLoading = false;
  gestorLoading = false;
  propietarioLoading = false;
  profesionalLoading = false;
  inmuebleLoading = false;
  documentoLoading = false;
  usuarioLoading = false;


  agrimensorInput$ = new Subject<string>();
  propietarioInput$ = new Subject<string>();
  profesionalInput$ = new Subject<string>();
  inmuebleInput$ = new Subject<string>();
  gestorInput$ = new Subject<string>();
  documentoInput$ = new Subject<string>();
  usuarioInput$ = new Subject<string>();


  selectedAgrimensores: Person[] = <any>[{}];
  selectedPropietarios: Person[] = <any>[{}];
  selectedGestores: Person[] = <any>[{}];
  selectedDocumentos: Documento[] = <any>[{}];
  usuarioDocumentos: Documento[] = <any>[{}];

  documentosSub: Subscription;
  expedienteSub: Subscription;
  usuarioSub: Subscription;
  editExpedienteSub: Subscription;
  retiroSub: Subscription;
  devolucionSub: Subscription;
  inmueblesSub: Subscription;
  usuariosSub: Subscription;


  public tipos_expedientes: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
  public observacionSelected: any;
  documentosexpediente: any;
  imprimir: boolean;
  date: any;
  tramite: any;
  fecha_hora: string;
  user: any;
  minLengthTerm = 3;



  constructor(
    private dataService: DataService,
    private _apiService: ApiService,
    public _functionService: FunctionsService ,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
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
  
  fullName (nombre: string, apellido: string){
    var fullname: string;
    if(nombre && apellido) fullname = nombre.charAt(0).toUpperCase() + '. '  + apellido
    else fullname = null;
    return fullname

  }

  public onbusquedamanualChanged(value:boolean){
    this.busqueda_manual = value;
    if(value){
      this.usuario = null;
    }
  }


  ngOnInit(): void {
    this.numeroParam = ""
    this.anioParam = ""
    this.submitted = false;
    this.date = moment(new Date()).format('DD/MM/YYYY');
    
    this.fecha_hora = moment(new Date()).format('hh:mm:ss')
    this.user = this._tokenService.getUserName();

    this.spinner.show()
    this.documentosSub = this._apiService.getDocumentos()
      .subscribe(response => {
        this.documentos = response
        this.spinner.hide()
        this._functionService.imprimirMensajeDebug(response, "documentos")
      }, complete => {
        this.spinner.hide()
      })
    this._apiService.cargarPeticion(this.documentosSub)

    this.loadPropietarios();
    this.loadProfesionales();
  
    this.loadDocumentos();

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
      this.expedienteSub = this._apiService.getExpedienteNumero(this.numeroParam, this.anioParam)
        .subscribe((x:any) =>{
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
          this._functionService.imprimirMensajeDebug(x, "expediente")
          this.spinner.hide()
        }, complete => {
          this.spinner.hide()
        })
      this._apiService.cargarPeticion(this.expedienteSub)
    }else if (this.id && !this.anioParam && !this.numeroParam)
      {
        this.expedienteSub = this._apiService.getExpediente(this.id)
          .subscribe((x:any) =>{
            this.tramite = x
            this.resultado = x.expediente
            this.documentosexpediente  = this.resultado.documentos

            this.expedienteForm.patchValue(this.resultado)
            if(this.resultado.inmueble){
              this.expedienteForm.patchValue({inmueble: this.resultado.inmueble.chacra});
            }
              
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
            this.spinner.hide()
            this._functionService.imprimirMensajeDebug(this.selectedPropietarios, "expediente")
          }, complete => {
            this.spinner.hide()
          })

        this._apiService.cargarPeticion(this.expedienteSub)
      this.retiroForm.patchValue({descripcion: ''});
          
    }
    
    else{
      this.expedienteSub = this._apiService.getExpedienteTramite(this.numeroParam)
        .subscribe((x:any) =>{

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
          this.spinner.hide()
          this._functionService.imprimirMensajeDebug(x, "expediente")
      }, complete => {
        this.spinner.hide()
      })
      this._apiService.cargarPeticion(this.expedienteSub)
      
    }
  

    //CARGA DE DATOS PARA SELECTS
 
    this.loadPropietarios()
    this.loadProfesionales()
    
  //FIN CARGAR DATOS PARA SELECTS
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
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


  codeList: string[] = ['', 'CODE128', 'CODE128A', 'CODE128B', 'CODE128C', 'UPC', 'EAN8', 'EAN5', 'EAN2', 'CODE39', 'ITF14', 'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110', 'pharmacode', 'codabar'];

  leerDni(){
    this.texto =  this.retiroForm.value["dni"]
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

        if(cont > 1) break;
      }
    }

    if(this.texto.length <= 10 && this.texto.length > 0){
      dni = this.texto
    }
    
    if(this.texto.length > 0){
      this.usuarioSub = this._apiService.getUsuarioNumero(dni)
      .subscribe((response:any) => {
        this._functionService.imprimirMensajeDebug(response, "usuario")

        switch (response.count) {
          case 0:
            this._functionService.configSwal(this.mensajeSwal, `No existe el usuario`, "info", "Aceptar", "", false, "", "")
            this.mensajeSwal.fire()
            this.usuario = null
            this.retiroForm.patchValue({dni: null})
            break;

          case 1:
            this.usuario = response.results[0]
            if(this.usuario.rol.nombre != "ROL_PROFESIONAL"){
              this._functionService.configSwal(this.mensajeSwal, `La persona ${this.usuario?.apellido} ${this.usuario.nombre} no es un profesional`, "info", "Aceptar", "", false, "", "")
              this.mensajeSwal.fire()
              this.usuario = null;
              this.retiroForm.patchValue({dni: null})
              break;
            }
            this.retiroForm.patchValue({dni: this.usuario?.dni})
            break; 
        
          default:
            this._functionService.configSwal(this.mensajeSwal, `Hay más de un usuario con el mismo DNI`, "info", "Aceptar", "", false, "", "")
            this.mensajeSwal.fire()
            this.usuario = null
            this.retiroForm.patchValue({dni: null})
            break;
        }     


      })
    this._apiService.cargarPeticion(this.usuarioSub)
    }

  }


  private loadPropietarios() {
    this.propietario$ = this.propietarioInput$.pipe(
                          filter(res => {
                            return res !== null && res.length >= this.minLengthTerm
                          }),
                          distinctUntilChanged(),
                          debounceTime(800),
                          switchMap(term => this.dataService.getPeople(term, "ROL_PROPIETARIO"))
                        )
  }

  private loadProfesionales() {
    this.profesionale$ = this.profesionalInput$.pipe(
                          filter(res => {
                            return res !== null && res.length >= this.minLengthTerm
                          }),
                          distinctUntilChanged(),
                          debounceTime(800),
                          switchMap(term => this.dataService.getPeople(term, "ROL_PROFESIONAL"))
                        )
  }


  private loadDocumentos() {

    this.documentos$ = this.dataService.getDocs()
  }


  compareFn(value, option): boolean {
    return value.id === option.id;
}

  verHistorial(){
    this.router.navigate([`historial/buscar/${this.tramite.numero}${this.tramite.codigo_verificacion}`])
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


  guardarRetiro(){
    this.submitted = true;
    // stop here if form is invalid
    this.retiroForm.patchValue({tramite: this.tramite.id});
    if(this.retiroForm.value["dni"]=="" && this.retiroForm.value["usuario"]=="") {
      return
    }
    if (this.retiroForm.invalid) {   
        return;
    }else{
      this.loading = true;    
      this.setRetiro();
    }

   
  }

  agregarObservacion(tramite){
    let numero = `${tramite.numero}${tramite.codigo_verificacion}`
    this._apiService.addObservacion(numero, this.textObservacion).subscribe(()=>{
      this._functionService.configSwal(this.mensajeSwal, `Observación guardada correctamente.`, "success", "Aceptar", "", false, "", "")
      this.mensajeSwal.fire().finally(()=>{
        this.ngOnInit()
        this.limpiarText()
      })
    })
  }

  limpiarText(){
    this.textObservacion = ""
    this.observacionSelected = null
  }

  showModal(objeto: any){
    this.observacionSelected = objeto
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


  setRetiro() {
    this.loading = true;
    if (!this.busqueda_manual) {
      this.retiroForm.patchValue({usuario: this.usuario?.id});
    }


    if(this.retiroForm.value.documento != null && this.retiroForm.value.usuario != null){
      for (var id of this.retiroForm.value.documento) {
        this.retiroForm.patchValue({documento: id});
        this.retiroForm.patchValue({tramite: this.tramite.id});
  
        this.retiroSub = this._apiService.setRetiro(this.retiroForm.value)
          .subscribe((res: any) => {
            this._functionService.configSwal(this.mensajeSwal, `Se ha registrado correctamente`, "success", "Aceptar", "", false, "", "")
            this.mensajeSwal.fire();
            this.loading = false;
            document.getElementById("closeModalRetiroButton").click();
          },(e)=> {
            this._functionService.configSwal(this.mensajeSwal, `No se ha podido registrar el retiro`, "error", "Aceptar", "", false, "", "")
            this.mensajeSwal.fire();
            this.loading = false;
          },() => {
            this.retiroForm.reset()
            this.usuario = ""
            this.ngOnInit()
          })

        this._apiService.cargarPeticion(this.retiroSub);
      } 
    }else{
      this.loading = false;
    }
  }

  setDevol() {
    this.devolForm.patchValue({num_tramite: this.tramite.numero});
    this.devolucionSub = this._apiService.setDevol(this.devolForm.value)
      .subscribe((res: any) =>{        
        this.loading = false;
        this._functionService.configSwal(this.mensajeSwal, 'Nueva presentación registrada', "success", "Aceptar", "", false, "", "")
        this.mensajeSwal.fire();
        document.getElementById("closeModalDevolButton").click();
        this.ngOnInit()
      }, (e)=>{
        this._functionService.configSwal(this.mensajeSwal, `No se pudo realizar la presentación`, "error", "Aceptar", "", false, "", "")
        this.mensajeSwal.fire();
        this.loading = false;
      });
    this._apiService.cargarPeticion(this.devolucionSub)
  }

  
  verDetalles(dato:boolean){
    this.inmueblesSub = this._apiService.getInmueblesDisponibles().subscribe(response => {
      this.inmuebles = response
    })
    this._apiService.cargarPeticion(this.inmueblesSub)
  } 

  verDetallesUsuarios(dato:boolean){
    this.usuariosSub = this._apiService.getUsuarios()
      .subscribe(response => {
        this.usuarios = response
      })
    this._apiService.cargarPeticion(this.usuariosSub)
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
