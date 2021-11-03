import { Component, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute , Router} from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import Swal from 'sweetalert2'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { concat, Observable, of, Subject } from 'rxjs';
import { DataService, Person, Documento } from 'src/app/services/data.service';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-agregar-expediente',
  templateUrl: './agregar-expediente.component.html',
  styleUrls: ['./agregar-expediente.component.scss']
})


export class AgregarComponent implements OnInit {

    public tipos_expedientes: any;
    public documentos: any; 
    public tramites: any;
    public inmuebles: any;
    public observaciones: any;
    public usuarios: any;
    public docs: any
    public dropdownSettings: IDropdownSettings;
    public selectedItems: any
    public tramite_urgente: boolean = false

    agrimensor$: Observable<Person[]>;
    gestor$: Observable<Person[]>;
    propietario$: Observable<Person[]>;
    documento$: Observable<Documento[]>;

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

    expedienteForm : FormGroup
    form: FormGroup;
    id: string;
    isAddMode: boolean;
    loading = false;
    submitted = false;

  constructor(
    private dataService: DataService,
    private _apiService: ApiService,
    private _functionService: FunctionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
    ) { }
    
  ngOnInit(): void {
    this._apiService.cancelarPeticionesPendientes()
    this.spinner.show();


    this.loadPropietarios();
    this.loadGestores();
    this.loadAgrimensores();
    this.loadDocumentos()
    

    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;
    this.selectedItems = []


    this.expedienteForm = this.formBuilder.group({
      tipo_expediente: ['', Validators.required],
      inmueble: ['', Validators.required],
      propietario: ['', Validators.required],
      gestor: [''],
      abreviatura: ['', Validators.required],
      agrimensor: ['', Validators.required],
      tramite_urgente: [''],
      documentos: ['', Validators.required]
      });

    const tipoExpedientesSub = this._apiService.getTipoExpedientes()
      .subscribe(response => {
        this.tipos_expedientes = response
      })
    this._apiService.cargarPeticion(tipoExpedientesSub);
    this.spinner.hide(); 
    
    const inmueblesSub = this._apiService.getInmueblesDisponibles()
      .subscribe(response => {
        this.inmuebles = response
        this._functionService.imprimirMensaje(response, "inmuebles")
      })
    this._apiService.cargarPeticion(inmueblesSub);

    const observacionesSub = this._apiService.getObservaciones()
      .subscribe(response => {
        this.observaciones = response
        this._functionService.imprimirMensaje(response, "observaciones")
      })

    this._apiService.cargarPeticion(observacionesSub);

    const documentosSub = this._apiService.getDocumentos()
      .subscribe(response => {
        this.documentos = response
        this._functionService.imprimirMensaje(response, "documentos")
      })
    this._apiService.cargarPeticion(documentosSub)

    this.dropdownSettings=<IDropdownSettings> {
      singleSelection: false,
      idField: 'id',
      textField: 'descripcion',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 10,
      allowSearchFilter: true
    };
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

  get f() { return this.expedienteForm.controls; }
  
  onSubmit() {
    this.submitted = true;

    if (this.expedienteForm.invalid) {
      this._functionService.imprimirMensaje(this.expedienteForm.invalid, "expediente form invalid: ")
      return;
    }
    this.loading = true;    
    this.createExpediente();
  }
  
  createExpediente() {
    const setExpedienteSub = this._apiService.setExpediente(this.expedienteForm.value)
      .subscribe((res: any) =>{
        Swal.fire({
          title: 'Exito',
          text: 'Se registro correctamente',
          icon: 'success',
          confirmButtonText: 'Aceptar',
        })
        this.router.navigate(['/expediente/'+ res.id ], { queryParams: { numero: res.numero , anio: res.anio} });
      })
    this._apiService.cargarPeticion(setExpedienteSub)
     this.loading = false;
  }

  verDetalles(dato:boolean){
    const inmueblesSub = this._apiService.getInmueblesDisponibles()
      .subscribe(response => {
        this.inmuebles = response
      })
    this._apiService.cargarPeticion(inmueblesSub)
  } 

  verDetallesUsuarios(dato:boolean){
    const usuariosSub = this._apiService.getUsuarios()
      .subscribe(response => {
        this.usuarios = response
      })
    this._apiService.cargarPeticion(usuariosSub)
  } 

  limpiar(){
    this.expedienteForm.reset();
  }
}