import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute , Router} from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import Swal from 'sweetalert2'



@Component({
  selector: 'app-crear-inmueble',
  templateUrl: './agregar-inmueble.component.html',
  styleUrls: ['./agregar-inmueble.component.scss']
})
export class AgregarInmuebleComponent implements OnInit {

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent

  @Output() verDetallesInmuebles: EventEmitter<any>;
  @Input() volver: string;


  public municipios: any;

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
      this.verDetallesInmuebles = new EventEmitter();
     }

  ngOnInit(): void {
   
    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.inmuebleForm = this.formBuilder.group({
      
      // user: ['', Validators.required],
      numero_partida: ['', Validators.compose([Validators.required, Validators.maxLength(6), Validators.pattern(/^-?([0-9]\d*)?$/)])],
      datos: ['', Validators.compose([Validators.required, Validators.maxLength(400)])],
      observaciones: ['', Validators.compose([Validators.required, Validators.maxLength(100)])],
      seccion: ['', Validators.compose([Validators.required, Validators.maxLength(3), Validators.pattern(/^-?([0-9]\d*)?$/)])],
      chacra: ['', Validators.compose([Validators.required, Validators.maxLength(4), Validators.pattern(/^[a-zA-Z0-9]+$/)])],
      manzana: ['', Validators.compose([Validators.required, Validators.maxLength(4), Validators.pattern(/^[a-zA-Z0-9]+$/)])],
      parcela: ['', Validators.compose([Validators.required, Validators.maxLength(4), Validators.pattern(/^[a-zA-Z0-9]+$/)])],
      numero_mensura: ['', Validators.compose([Validators.required, Validators.maxLength(6), Validators.pattern(/^-?([0-9]\d*)?$/)])],
      unidad_funcional: ['', Validators.compose([Validators.required, Validators.maxLength(6), Validators.pattern(/^[a-zA-Z0-9]+$/)])],
      municipio: ['', Validators.required]
    }, {
         
      });


    if (!this.isAddMode) {
        this._apiService.getExpediente(this.route.snapshot.paramMap.get('id'))
        .then(x => this.form.patchValue(x));
    }

    this._apiService.getMunicipios().then(response => {
      this.municipios = response
      this._functionService.imprimirMensaje(response, "municipios")
    })

  
  }

  get f() { 
    return this.inmuebleForm.controls; }

  
  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.inmuebleForm.invalid) {
        return;
    }

    this.loading = true;    
    this.createInmueble();
  
}
  
  createInmueble() {
    this._apiService.setInmueble(this.inmuebleForm.value)
      .then(() =>{     
        this.loading = false;
        this.verDetallesInmuebles.emit(true);
        this._functionService.configSwal(this.mensajeSwal, 'Inmueble registrado correctamente', "success", "Aceptar", "", false, "", "")
        this.mensajeSwal.fire().finally(() => {
          this.inmuebleForm.reset();
          this.submitted = false;
        })
      })
      .catch((e)=>{
        this._functionService.configSwal(this.mensajeSwal, `No se pudo registrar`, "error", "Aceptar", "", false, "", "")
        this.mensajeSwal.fire()
    
        this.loading = false;
    
      });
    document.getElementById("closeModalInmuebleButton").click();
  }

  
}