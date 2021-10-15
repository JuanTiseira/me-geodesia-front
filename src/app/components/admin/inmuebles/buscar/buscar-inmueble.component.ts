
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { FormControl, FormGroup } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { Role } from 'src/app/models/role.models';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';




/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-buscar',
  templateUrl: './buscar-inmueble.component.html',
  styleUrls: ['./buscar-inmueble.component.scss']
})
  

export class BuscarInmuebleComponent implements OnInit {


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

  p: number = 1;
  inmueble: string
  tramite: string

  categories = [
    {id: 1, name: 'Unidad Funcional', value: 'unidad_funcional'},
    {id: 2, name: 'Número de partida', value: 'numero_partida'},
    {id: 3, name: 'Datos', value: 'datos'},
    {id: 4, name: 'Seccion', value: 'seccion'},
    {id: 5, name: 'Chacra', value: 'chacra'},
    {id: 6, name: 'Manzana', value: 'manzana'},
    {id: 7, name: 'Parcela', value: 'parcela'},
    {id: 8, name: 'Número de mensura', value: 'numero_mensura'},
    {id: 9, name: 'Municipio', value: 'municipio'},
    {id: 10, name: 'Observaciones', value: 'observaciones'},
  ]

  constructor( private _apiService: ApiService,
                private _functionService: FunctionsService ,
                private modalService: NgbModal,
                private authService: AuthService,
                private router: Router,
                private spinner: NgxSpinnerService
                ) { }


  consultaForm = new FormGroup({
    numero: new FormControl(''),
    nombre: new FormControl(''),
    matricula: new FormControl(''),
    rol: new FormControl(''),
    tipo_consulta: new FormControl(''),
    param_busqueda: new FormControl('')

  });

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
  
      this._apiService.getInmuebles().then(response => {
        this.inmuebles = response
        this._functionService.imprimirMensaje(response, "inmuebles")
      })

      this._apiService.getRoles().then(response => {
        this.roles = response
        this._functionService.imprimirMensaje(response, "roles")
        
        this.spinner.hide();

      })
     
  }

  onTableDataChange(event) {

    this.spinner.show();
   
    this._apiService.changePage(event, 'inmuebles')

    .then((res) =>{

      this.p = event

      this.inmuebles = res
     
      console.log(this.inmuebles)
      
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
    .catch(()=>{
      console.log('error')
    });

  } 

  eliminar (id) {
    this._functionService.configSwal(this.mensajeSwal, `¿Está seguro de que desea eliminar el inmueble?`, "warning", "Aceptar", "Cancelar", true, "", "");
    this.mensajeSwal.fire()
      .then((result) => {
        if (result.isConfirmed) {
          this._apiService.deleteInmueble(id)
          .then(() =>{ 
            this._functionService.configSwal(this.mensajeSwal, `El inmueble fue eliminado.`, "success", "Aceptar", "", false, "", "");
          this.ngOnInit();
        }) 
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

  buscarInmueble() {
  
    this.spinner.show();
    var numero = this.consultaForm.value.numero
    var parametro = this.consultaForm.value.param_busqueda
    this._apiService.getInmuebleWithParams(parametro, numero).then((response) => {
      console.log("response: ",response)
      this.inmuebles = response;
    })
    
    this.spinner.hide();
  }


  limpiar(){
    this.consultaForm.reset();
    this.ngOnInit();
  }
  
  // onSubmit() {
    
    
  //   this._apiService.getInmueble(this.consultaForm.value)
  //   .then(() =>{
  //     console.warn(this.consultaForm.value);
  //     //this._functionService.configSwal(this.mensajeSwal, `El inmueble ${this.inmuebleForm.value} fue creado correctamente.`, "success", "Aceptar", "", false, "", "");
  //     // this.mensajeSwal.fire().finally(()=> {
  //     //   this.ngOnInit();
  //     //   //this.mostrarLista();
  //     // });
  //   })
  //   .catch(()=>{
  //    // this._functionService.configSwal(this.mensajeSwal, `Error al intentar crear el inmueble ${this.inmuebleForm.value}`, "error", "Aceptar", "", false, "", "");
  //     //this.mensajeSwal.fire();
  //   });
  // }

  

}