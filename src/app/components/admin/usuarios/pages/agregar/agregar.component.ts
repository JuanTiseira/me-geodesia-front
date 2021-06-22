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
export class AgregarUsuarioComponent implements OnInit {

  // @ViewChild('mensajeSwal') mensajeSwal: SwalComponent

  public tipos_usuarios: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
  public roles: any;
  usuarioForm : FormGroup
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

    this.usuarioForm = this.formBuilder.group({
      
      // user: ['', Validators.required],
      rol: ['', Validators.required],
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      cuit: ['', Validators.required],
      dni: ['', Validators.required],
      matricula: ['', Validators.required],
      direccion: ['', Validators.required],
      fecha_nacimiento: ['', Validators.required],
      email: ['', Validators.required],
      telefono: ['', Validators.required],  
    }, {
         
      });


    if (!this.isAddMode) {
        this._apiService.getExpediente(this.route.snapshot.paramMap.get('id'))
        .then(x => this.form.patchValue(x));
    }
    

    this._apiService.getTipoExpedientes().then(response => {
      
      this.tipos_usuarios = response
      //this.tipos_usuarios = response
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

    this._apiService.getRoles().then(response => {
      this.roles = response
      this._functionService.imprimirMensaje(response, "roles")
    })

  
  }

  get f() { return this.usuarioForm.controls; }

  
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.usuarioForm.invalid) {
        alert('errores')
        console.log(this.usuarioForm)
        return;
    }

    this.loading = true;    
    this.createExpediente();
  
}
  
  createExpediente() {
    
    console.log(this.usuarioForm.value)
    this._apiService.setExpediente(this.usuarioForm.value)
    .then(() =>{
      console.warn(this.usuarioForm.value);
      Swal.fire({
        title: 'Exito',
        text: 'Se registro correctamente',
        icon: 'success',
        confirmButtonText: 'Cool',
      })
      this.router.navigate(['/usuario/buscar'])
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