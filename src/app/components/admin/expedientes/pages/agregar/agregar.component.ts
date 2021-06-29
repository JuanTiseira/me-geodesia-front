import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute , Router} from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import Swal from 'sweetalert2'
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.scss']
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


  expedienteForm : FormGroup
  form: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;
  

  constructor(
    private _apiService: ApiService,
    private _functionService: FunctionsService,
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {

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
    
    this.expedienteForm.patchValue({observacion: this.selectedItems});
    
    console.log(this.expedienteForm.value)
    this._apiService.setExpediente(this.expedienteForm.value)
    .then((r) =>{

      console.warn(r);
      Swal.fire({
        title: 'Exito',
        text: 'Se registro correctamente',
        icon: 'success',
        confirmButtonText: 'Cool',
      })
      this.router.navigate(['/expediente/buscar'])
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

  onItemSelect(item: any) {
    console.log(item);
  }
  onSelectAll(items: any) {
    console.log(items);
  }

  
}