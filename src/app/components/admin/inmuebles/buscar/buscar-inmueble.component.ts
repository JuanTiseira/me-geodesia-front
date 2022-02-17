
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { Role } from 'src/app/models/role.models';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';


/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-buscar',
  templateUrl: './buscar-inmueble.component.html',
  styleUrls: ['./buscar-inmueble.component.scss']
})
  

export class BuscarInmuebleComponent implements OnInit, OnDestroy {


  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  closeResult = '';

  public page: number = 0;
  public search: string = '';
  public inmuebles: any;
  public roles: any;
  public tipos_inmuebles: any;
  public documentos: any; 
  public tramites: any;
  public observaciones: any;
  public tipo_consulta: any;
  public param_busqueda: any
  public load: boolean;
  
  inmueblesSub: Subscription;
  rolesSub: Subscription;
  eliminarInmuebleSub: Subscription;

  p: number = 1;
  inmueble: string
  tramite: string
  submitted:boolean = false;

  categories = [
    {id: 1, name: 'Unidad Funcional', value: 'unidad_funcional'},
    {id: 2, name: 'Número de partida', value: 'numero_partida'},
    {id: 3, name: 'Datos', value: 'datos'},
    {id: 4, name: 'Seccion', value: 'seccion'},
    {id: 5, name: 'Chacra', value: 'chacra'},
    {id: 6, name: 'Manzana', value: 'manzana'},
    {id: 7, name: 'Parcela', value: 'parcela'},
    {id: 8, name: 'Número de mensura', value: 'numero_mensura'},
    {id: 9, name: 'Municipio', value: 'municipio_nombre'},
    {id: 10, name: 'Observaciones', value: 'observaciones'},
  ]

  constructor( private _apiService: ApiService,
                private _functionService: FunctionsService ,
                private modalService: NgbModal,
                private authService: AuthService,
                private spinner: NgxSpinnerService,
                private formBuilder: FormBuilder
                ) { }

  consultaForm = new FormGroup({
    numero: new FormControl('', Validators.required),
    tipo_consulta: new FormControl(''),
    param_busqueda: new FormControl('', Validators.required)
  });

  consultaFormAvanzado =this.formBuilder.group({
    unidad_funcional:[''],
    numero_partida: [''],
    datos: [''],
    seccion: [''],
    chacra: [''],
    manzana: [''],
    parcela: [''],
    numero_mensura: [''],
    municipio_nombre: [''],
    observaciones: ['']
  })


  open(content, id) {
     
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

  ngOnInit(): void {
    this.spinner.show();
    
    this.inmueblesSub = this._apiService.getInmuebles()
      .subscribe((response)=>{
          this.inmuebles = response
          this.spinner.hide();
          this._functionService.imprimirMensaje(response, "inmuebles")
    })
    
    this._apiService.cargarPeticion(this.inmueblesSub);
    this.spinner.hide()
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }

  onTableDataChange(event) {

    this.spinner.show();
   
    this._apiService.changePage(event, 'inmuebles')
      .then((res) =>{
        this.p = event
        this.inmuebles = res        
        if (this.inmuebles.count == 0) {
          this.spinner.hide();
          this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
          this.mensajeSwal.fire()
        }else{
          this.inmuebles = res
          this.spinner.hide();
        }
        this.load = false;
      })
      .catch((error)=>{
        this._functionService.imprimirMensaje(error, "error: ")
      });

  } 

  get r(){ return this.consultaForm.controls;}

  eliminar (id) {
    this._functionService.configSwal(this.mensajeSwal, `¿Está seguro de que desea eliminar el inmueble?`, "warning", "Aceptar", "Cancelar", true, "", "");
    this.mensajeSwal.fire()
      .then((result) => {
        if (result.isConfirmed) {
          this.eliminarInmuebleSub = this._apiService.deleteInmueble(id)
            .subscribe(() =>{ 
              this._functionService.configSwal(this.mensajeSwal, `El inmueble fue eliminado.`, "success", "Aceptar", "", false, "", "");
              this.ngOnInit();
            }) 
          this._apiService.cargarPeticion(this.eliminarInmuebleSub);
        }
      })
  }

  buscarSiguiente() {
    alert('siguiente pagina')

  } 

  buscarAnterior() {
    alert('aterior pagina')

  }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  get isEmpleado() {
    return this.authService.hasRole(Role.ROL_EMPLEADO);
  }

  get isEmpleadoME() {
    return this.authService.hasRole(Role.ROL_EMPLEADOME);
  }

  get isEmpleadoCarga() {
    return this.authService.hasRole(Role.ROL_EMPLEADO_CARGA);
  }

  buscarInmueble() {
    this.submitted = true;
    this.p = 1
    var numero = this.consultaForm.value.numero
    var parametro = this.consultaForm.value.param_busqueda
    if(this.consultaForm.invalid){
      return
    }
    this.spinner.show();
    this._apiService.getInmuebleWithParams(parametro, numero)
      .subscribe((response)=>{
        this.inmuebles = response
        this._functionService.imprimirMensaje(response, "inmuebles")
      })
    
    this.spinner.hide();
  }

  buscarInmuebles(){
    console.warn("consultaFormAvanzado: ", this.consultaFormAvanzado.value)
    this.spinner.show();
    this._apiService.getInmuebles(this.consultaFormAvanzado.value)
      .subscribe((response)=>{
        this.inmuebles = response;
        this._functionService.imprimirMensaje(response, "Inmuebles consulta avanzada")
      })
    this.spinner.hide();
  }


  limpiar(){
    this.consultaForm.reset();
    this.ngOnInit();
  }
  

}