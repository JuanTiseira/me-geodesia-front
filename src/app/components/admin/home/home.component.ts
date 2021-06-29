
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';

import { FormControl, FormGroup } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';

import { Role } from 'src/app/models/role.models';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { resolve } from 'url';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { AuthService } from 'src/app/services/auth.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  
  
  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent

  closeResult = '';
  
  public page: number = 0;
  public search: string = '';
  public expedientes: any;

  public tipos_expedientes: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public usuarios: any;
  public tipo_consulta: any;

  expediente: string
  tramite: string
  param_busqueda: ''

  categories = [
    {id: 1, name: 'Expediente', value: 'expediente'},
    {id: 2, name: 'Tramite', value: 'tramite'},
  ]


  constructor( private _apiService: ApiService,
                private _functionService: FunctionsService ,
                private modalService: NgbModal,
                private authService: AuthService,
                private router: Router,
                private spinner: NgxSpinnerService
                ) { }


  consultaForm = new FormGroup({
    param_busqueda: new FormControl(''),   
    numero: new FormControl(''),
    anio: new FormControl(''),
    tipoexpediente: new FormControl(''),
    inmueble: new FormControl(''),
    documento: new FormControl(''),
    propietario: new FormControl(''),
    gestor: new FormControl(''),
    tramite: new FormControl(''),
    observacion: new FormControl(''),
    abreviatura: new FormControl(''),
    agrimensor: new FormControl(''),
    tipo_consulta: new FormControl('')

  });

  ngOnInit(): void {

      this.spinner.show();

      setTimeout(() => {
        /** spinner ends after 5 seconds */
        this.spinner.hide();
      }, 1000);

      if (this.authService.hasRole(Role.ROL_ADMIN) || this.authService.hasRole(Role.ROL_EMPLEADO)) {
        this._apiService.getExpedientes()
        .then(response => {
          this.expedientes = response
          this._functionService.imprimirMensaje(response, "expedientes")
        })


      this._apiService.getUsuarios()
        .then(response => {
          this.usuarios = response
          this._functionService.imprimirMensaje(response, "usuarios")
        })
      }


      
     
  }

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  get isEmpleado() {
    return this.authService.hasRole(Role.ROL_EMPLEADO);
  }

  get isProfesional() {
    return this.authService.hasRole(Role.ROL_PROFESIONAL);
  }
  buscar () {
    alert('buscado')
  }

  eliminar (id) {
    Swal.fire({
      title: 'Esta Seguro?',
      text: "No podra revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, eliminar Expediente!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._apiService.deleteExpediente(id)
        .then(() =>{ 
          Swal.fire(
          'Eliminado!',
          'El expediente fue eliminado.',
          'success'
        ) 
        this.router.navigate(['/usuario/buscar']);
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

  buscarExpediente() {

    this.spinner.show();
    var numeroanio = this.consultaForm.value.numero
    
    if (this.consultaForm.value.param_busqueda == 'expediente') {

       
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

      //BUSCA POR NUMERO DE EXPEDIENTE Y TRAE EL TRAMITE CON OBSERVACION Y EXPEDIENTE

      this._apiService.getExpedienteNumero(numero, anio)
        .then((x:any) =>{

          console.warn(x);
          this.router.navigate(['/expediente/'+x.expediente.id],{ queryParams: { numero: numero , anio: anio} }); //TOMA EL ID DEL OBJETO Y MUESTRA EL DETALLE
          
      }).catch(()=>{
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      });
      

    }else{

      //BUSCA POR NUMERO DE TRAMITE Y TRAE EL TRAMITE CON OBSERVACION Y EXPEDIENTE
      this._apiService.getExpedienteTramite(numeroanio)
        .then((x:any) =>{

          console.warn(x);
          this.router.navigate(['/expediente/'+x.expediente.id],{ queryParams: { numero: numeroanio } }); //TOMA EL ID DEL OBJETO Y MUESTRA EL DETALLE
          
      }).catch(()=>{
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      });

    }
    this.spinner.hide();
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
  
  buscarExpedientes() {
    this.spinner.show();
   
    this._apiService.getExpedientesFiltros(this.consultaForm.value)
    .then((res) =>{

      this.expedientes = res
     
      console.log(this.expedientes)
      
      if (this.expedientes.count == 0) {
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      }else{
        this.expedientes = res
      }

      
    })
    .catch(()=>{
      console.log('error')
    });

    this.spinner.hide();
  }

  

}