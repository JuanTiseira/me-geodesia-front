import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute , Router} from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import Swal from 'sweetalert2'



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
    ) { }

  ngOnInit(): void {
   
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.expedienteForm = this.formBuilder.group({
      
      tipo_expediente: ['', Validators.required],
      inmueble: ['', [Validators.required]],
      propietario: ['', Validators.required],
      gestor: [''],
      observacion: ['', Validators.required],
      abreviatura: ['', Validators.required],
      agrimensor: ['', Validators.required],
      }, {
         
      });


      if (!this.isAddMode) {
        this._apiService.getExpediente(this.route.snapshot.paramMap.get('id'))
        .then(x => this.form.patchValue(x));
    }
    

    this._apiService.getTipoExpedientes().then(response => {
      
      this.tipos_expedientes = response
      //this.tipos_expedientes = response
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

  
  }

  get f() { return this.expedienteForm.controls; }

  
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.expedienteForm.invalid) {
        alert('errores')
        console.log(this.expedienteForm)
        return;
    }

    this.loading = true;    
    this.createExpediente();
  
}
  
  createExpediente() {
    
    console.log(this.expedienteForm.value)
    this._apiService.setExpediente(this.expedienteForm.value)
    .then(() =>{
      console.warn(this.expedienteForm.value);
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

  
}