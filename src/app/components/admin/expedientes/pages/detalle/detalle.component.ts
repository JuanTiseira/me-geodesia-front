import { Component, OnInit, ViewChild } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import Swal from 'sweetalert2'
import { AuthService } from '../../../../../services/auth.service';
import { Role } from 'src/app/models/role.models';
import { NgxSpinnerService } from 'ngx-spinner';

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
  id: string;
  isEditMode: boolean;
  loading = false;
  submitted = false;
  selecteditem: string;
  selectedinmueble: string;
  selecteddocumentos: [];
  selectedtramite: string;
  selectedobservacion: string;
  selectedgestor: string; 
  selectedpropietario: string; 
  selectedagrimensor: string;


  public tipos_expedientes: any;
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
    private authService: AuthService,
    private spinner: NgxSpinnerService
   
    ) {}

  ngOnInit(): void {

    this.spinner.show();

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 1000);

    this.id = this.route.snapshot.params['id'];

    this.isEditMode = false;
    
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
      }, {
         
      });

      this.expedienteForm.disable();


      
    this.message = '';
    
    this.idEdit = false


    this.id = this.route.snapshot.params['id'];

    if (this.route.snapshot.queryParams['anio']) {
      this._apiService.getExpedienteNumero(this.route.snapshot.queryParams['numero'], this.route.snapshot.queryParams['anio'])
        .then((x:any) =>{

         
          this.resultado = x.expediente

          this.expedienteForm.patchValue(this.resultado)
          if (x.observacion != null) {
            this.expedienteForm.patchValue({observacion: x.observacion.descripcion});
          }

          this.selecteditem = this.resultado.expedientetipo_expediente
          this.selectedinmueble = this.resultado.expedienteinmueble
          this.selecteddocumentos = this.resultado.expedientedocumentos
          this.selectedobservacion = this.resultado.expedienteobservacion
          this.selectedpropietario = this.resultado.expedientepropietario
          this.selectedgestor = this.resultado.expedientegestor
          this.selectedagrimensor = this.resultado.expedienteagrimensor
          this.selectedtramite = this.resultado.expedientetramite


          this._functionService.imprimirMensaje(x, "expediente")
          
      }).catch((e)=>{
        console.log(e)
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      });
    }else if (this.route.snapshot.params['id'] && !this.route.snapshot.queryParams['anio'] && !this.route.snapshot.queryParams['numero'])
      {
        this._apiService.getExpediente(this.route.snapshot.params['id'])
        .then((x:any) =>{

      
          this.resultado = x.expediente
          console.log(x)
          this.expedienteForm.patchValue(this.resultado)

          if (x.observacion != null) {
            this.expedienteForm.patchValue({observacion: x.observacion.descripcion});
          }
          

          this.selecteditem = this.resultado.expedientetipo_expediente
          this.selectedinmueble = this.resultado.expedienteinmueble
          this.selecteddocumentos = this.resultado.expedientedocumentos
          this.selectedobservacion = this.resultado.expedienteobservacion
          this.selectedpropietario = this.resultado.expedientepropietario
          this.selectedgestor = this.resultado.expedientegestor
          this.selectedagrimensor = this.resultado.expedienteagrimensor
          this.selectedtramite = this.resultado.expedientetramite


          this._functionService.imprimirMensaje(x, "expediente")
          
      }).catch((e)=>{
        console.log(e)
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      });


    }
    
    else{
      
      this._apiService.getExpedienteTramite(this.route.snapshot.queryParams['numero'])
        .then((x:any) =>{

          
          this.resultado = x.expediente
          
          this.expedienteForm.patchValue(this.resultado)
          if (x.observacion != null) {
            this.expedienteForm.patchValue({observacion: x.observacion.descripcion});
          }

          


          this.selecteditem = this.resultado.expedientetipo_expediente
          this.selectedinmueble = this.resultado.expedienteinmueble
          this.selecteddocumentos = this.resultado.expedientedocumentos
          this.selectedpropietario = this.resultado.expedientepropietario
          this.selectedgestor = this.resultado.expedientegestor
          this.selectedagrimensor = this.resultado.expedienteagrimensor
          this.selectedtramite = this.resultado.expedientetramite


          this._functionService.imprimirMensaje(x, "expediente")
          
      }).catch((e)=>{
        console.log(e)
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      });

    }
    
    
    
      
    

    this._apiService.getTipoExpedientes().then(response => {
      
      this.tipos_expedientes = response
      //this.tipos_expedientes = response
    })

    this._apiService.getTramites().then(response => {
      this.tramites = response
      this._functionService.imprimirMensaje(response, "tramites")
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

  compareFn(value, option): boolean {
    return value.id === option.id;
}

  imprimirEtiqueta(){
    
    this._functionService.configSwal(this.mensajeSwal, `Imprimiendo Documento`, "success", "Aceptar", "", false, "", "")
    this.mensajeSwal.fire()
  }

  editar (){
    this.isEditMode = true
    this.expedienteForm.enable();
  }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.expedienteForm.invalid) {
        alert('errores')
        console.log(this.expedienteForm)
        return;
    }

    this.loading = true;    
    this.updateExpediente();
  
  }

  get f() { return this.expedienteForm.controls; }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  updateExpediente() {
    
    
    this._apiService.editExpediente(this.expedienteForm.value)
    .then(() =>{
      console.warn(this.expedienteForm.value);
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
