import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2'
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})



export class DetalleUsuarioComponent implements OnInit {

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent

  
  idEdit: boolean
  usuario = null;
  message = '';
  usuarioForm: FormGroup;
  id: string;
  isEditMode: boolean;
  loading = false;
  submitted = false;
  selecteditem: string;
  selectedinmueble: string;
  selecteddocumento: string;
  selectedtramite: string;
  selectedobservacion: string;
  selectedgestor: string; 
  selectedpropietario: string; 
  selectedagrimensor: string;


  public tipos_usuarios: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;



  constructor(
    private _apiService: ApiService,
    private _functionService: FunctionsService ,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private spinner: NgxSpinnerService
    ) {}

  ngOnInit(): void {
    this.spinner.show();
      
    this.id = this.route.snapshot.params['id'];
    this.isEditMode = false;
    
    this.usuarioForm = this.formBuilder.group({
      tipo_usuario: [{value: '', }, Validators.required],
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

      this.usuarioForm.disable();
     
    this.message = '';
    
    this.idEdit = false

    this._apiService.getUsuario(this.route.snapshot.paramMap.get('id'))
      .then(response => {
      
      this.usuario = response
      this.usuarioForm.patchValue(response)
      this.selecteditem = this.usuario.tipo_usuario

      this._functionService.imprimirMensaje(response, "usuario")
      this.spinner.hide()
     
    })

  
    
  }

  compareFn(value, option): boolean {
    return value.id === option.id;
}

  imprimirEtiqueta(){
    
    this._functionService.configSwal(this.mensajeSwal, `Imprimiendo Etiqueta`, "success", "Aceptar", "", false, "", "")
    this.mensajeSwal.fire()
  }

  editar (){
    this.isEditMode = true
    this.usuarioForm.enable();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.usuarioForm.invalid) {
        alert('errores')
        console.log(this.usuarioForm)
        return;
    }

    this.loading = true;    
    this.updateExpediente();
  
  }

  get f() { return this.usuarioForm.controls; }

  updateExpediente() {
    
    
    this._apiService.editExpediente(this.usuarioForm.value)
    .then(() =>{
      console.warn(this.usuarioForm.value);
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

}
