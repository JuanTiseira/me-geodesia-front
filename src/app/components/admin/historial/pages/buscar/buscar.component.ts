
import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { FormBuilder, Validators } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from 'src/app/services/auth.service';
import { Role } from 'src/app/models/role.models';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';




/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})


export class BuscarHistorialComponent implements OnInit, OnDestroy {

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent

  closeResult = '';
  
  public page: number = 0;
  public search: string = '';
  public expedientes: any;
  public load: boolean;

  public tipos_expedientes: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
  public tipo_consulta: any;

  expedienteSub: Subscription;
  historialSub: Subscription;


  expediente: string
  tramite: string
  param_busqueda: ''
  historiales: any;  //cambiar tipos de datos any
  id: string;
  submitted: boolean = false;
  datos: any;
  loading: boolean = false;

  categories = [
    {id: 1, name: 'Expediente', value: 'expediente'},
    {id: 2, name: 'Trámite', value: 'tramite'},
  ]

  constructor( private _apiService: ApiService,
                public _functionService: FunctionsService ,
                private route: ActivatedRoute,
                private formBuilder: FormBuilder,
                private spinner: NgxSpinnerService
                ) { this.load = false; }


    consultaForm =  this.formBuilder.group({
      param_busqueda: ['', Validators.required],  
      numero: ['', Validators.required],  
    });


  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    if( this.id != null){
      this.buscarHistorial();
    }
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }

  get r() { return this.consultaForm.controls; }

  buscarHistorial() {

    if(this.id == null) {
      this.submitted = true;
      if (this.consultaForm.invalid) return;
    };
    
    
    this.loading = true;
    this.spinner.show();
    var numeroanio = this.consultaForm.value.numero
    
    if (this.consultaForm.value.param_busqueda == 'expediente' && this.id == null) {

      var numero = 0 
      let z = 1

      for (let i = 5; i < 9; i++) {

        if (numeroanio.length === i) {
          numero = numeroanio.slice(0, z);
        }else{
          z++
        }
      
      }

      var anio = numeroanio.slice(-4);
      this.historialSub = this._apiService.getHistorial(numero, anio)
        .subscribe((x:any) =>{
          this.historiales = x.results;
          this.datos = this.historiales[0]
          this.cargarSwal();
        }) 
      this._apiService.cargarPeticion(this.historialSub)        
    }else{
      //BUSCA POR NUMERO DE TRAMITE Y TRAE EL TRAMITE CON OBSERVACION Y EXPEDIENTE
      if(this.consultaForm.value.param_busqueda != 'tramite' && this.id != null){
        numeroanio = this.id
      }

      if(this.consultaForm.value.param_busqueda == 'tramite' && this.id == null){
        numeroanio = this.consultaForm.value.numero
      }

          this.historialSub = this._apiService.getHistorial(null, null, numeroanio)
            .subscribe((x:any) =>{
              this.historiales = x.results;
              this.datos = this.historiales[0]
              this.cargarSwal();
            })
          this._apiService.cargarPeticion(this.historialSub)     
    }


    this.loading = false;
    this.spinner.hide();
  }

  cargarSwal(){
    if(!this.datos){
      this._functionService.configSwal(this.mensajeSwal, `No se encontró historial para el dato solicitado`, "warning", "Aceptar", "", false, "", "")
      this.mensajeSwal.fire()
      this.loading = false;
      this.spinner.hide();
    }
  }

  rangeYear () {
    const max = new Date().getFullYear()
    const min = max - 100
    const years = []
  
    for (let i = max; i >= min; i--) {
        years.push(i)
    }
    return years
  }
  
}