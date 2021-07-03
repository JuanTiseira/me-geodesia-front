import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute , Router} from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import Swal from 'sweetalert2'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';
import { concat, Observable, of, Subject } from 'rxjs';
import { DataService, Person } from 'src/app/services/data.service';
import { catchError, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';

 

@Component({
  selector: 'app-agregar-expediente',
  templateUrl: './agregar-expediente.component.html',
  styleUrls: ['./agregar-expediente.component.scss']
})


export class AgregarComponent implements OnInit {

  // @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
 
  
  public tipos_expedientes: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
  public docs: any
  public selectedDocumentos: any 
  public dropdownSettings: IDropdownSettings;
  public selectedItems: any
  public tramite_urgente: boolean


  people$: Observable<Person[]>;
    peopleLoading = false;
    peopleInput$ = new Subject<string>();
    selectedPersons: Person[] = <any>[{}];

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


    trackByFn(item: Person) {
      return item.id;
  }
  ngOnInit(): void {

    this.loadPeople();
    this.spinner.show();

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 1000);
   
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

    this._apiService.getTipoExpedientes().then(response => {
      
      this.tipos_expedientes = response
      //this.tipos_expedientes = response
    })
    
    this._apiService.getInmueblesDisponibles().then(response => {
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

    this._apiService.getDocumentos().then(response => {
      this.documentos = response

      
      this._functionService.imprimirMensaje(response, "documentos")
    })


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

  private loadPeople() {

    
    this.people$ = concat(
        of([]), // default items
        this.peopleInput$.pipe(
            distinctUntilChanged(),
            tap(() => this.peopleLoading = true),
            switchMap(term => this.dataService.getPeople(term).pipe(
                catchError(() => of([])), // empty list on error
                tap(() => this.peopleLoading = false)
                
            ))
        )
        
    );
  }

  get f() { return this.expedienteForm.controls; }

  
  onSubmit() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.expedienteForm.invalid) {
        console.log('errores en el formulario', this.expedienteForm.invalid)
        return;
    }

    this.loading = true;    
    this.createExpediente();
  
}
  
  createExpediente() {
    
    
    console.log(this.expedienteForm.value)
    this._apiService.setExpediente(this.expedienteForm.value)
    .then((res: any) =>{

      console.warn(res);
      Swal.fire({
        title: 'Exito',
        text: 'Se registro correctamente',
        icon: 'success',
        confirmButtonText: 'Cool',
      })

      this.router.navigate(['/expediente/'+ res.id ], { queryParams: { numero: res.numero , anio: res.anio} });
      
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


  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  
}