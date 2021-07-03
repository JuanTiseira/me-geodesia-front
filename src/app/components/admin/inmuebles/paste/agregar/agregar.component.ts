import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute , Router} from '@angular/router';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import Swal from 'sweetalert2'



@Component({
  selector: 'app-crear-inmueble',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.scss']
})
export class AgregarInmuebleComponent implements OnInit {

  // @ViewChild('mensajeSwal') mensajeSwal: SwalComponent

  @Output() verDetallesFunction: EventEmitter<any>;
  
  public departamentos: any;

  inmuebleForm : FormGroup
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
    ) { 
      this.verDetallesFunction = new EventEmitter();
     }

  ngOnInit(): void {
   
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.inmuebleForm = this.formBuilder.group({
      
      // user: ['', Validators.required],
      numero_partida: ['', Validators.required],
      datos: ['', Validators.required],
      observaciones: ['', Validators.required],
      seccion: ['', Validators.required],
      chacra: ['', Validators.required],
      manzana: ['', Validators.required],
      parcela: ['', Validators.required],
      numero_mensura: ['', Validators.required],
      departamento: ['', Validators.required]
    }, {
         
      });


    if (!this.isAddMode) {
        this._apiService.getExpediente(this.route.snapshot.paramMap.get('id'))
        .then(x => this.form.patchValue(x));
    }
  
    
    this._apiService.getDepartamentos().then(response => {
      this.departamentos = response
      this._functionService.imprimirMensaje(response, "departamentos")
    })


  
  }

  get f() { return this.inmuebleForm.controls; }

  
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.inmuebleForm.invalid) {

        console.log(this.inmuebleForm)
        return;
    }

    this.loading = true;    
    this.createInmueble();
  
}
  
  createInmueble() {
    
    console.log(this.inmuebleForm.value)
    this._apiService.setInmueble(this.inmuebleForm.value)
    .then(() =>{
      console.warn(this.inmuebleForm.value);
      Swal.fire({
        title: 'Exito',
        text: 'Se registro correctamente',
        icon: 'success',
        confirmButtonText: 'OK',
      })
      
    })
    .catch((e)=>{
     Swal.fire({
        title: 'Error!',
        text: 'No se pudo registrar',
        icon: 'error',
        confirmButtonText: 'OK'
      })

      {
     
    }  
      this.loading = false;
      this.verDetallesFunction.emit(true);
    });
    
    document.getElementById("closeModalInmuebleButton").click();
  }

  
}