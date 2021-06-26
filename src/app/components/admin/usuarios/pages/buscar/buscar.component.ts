
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { FormControl, FormGroup } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../../services/auth.service';
import { Role } from 'src/app/models/role.models';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';




/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})


export class BuscarUsuarioComponent implements OnInit {

  closeResult = '';

  public page: number = 0;
  public search: string = '';
  public usuarios: any;
  public roles: any;
  public tipos_usuarios: any;
  public documentos: any; 
  public tramites: any;
  public inmuebles: any;
  public observaciones: any;
  public tipo_consulta: any;
  public param_busqueda: any

  usuario: string
  tramite: string

  categories = [
    {id: 1, name: 'DNI'},
    
  ]

  constructor( private _apiService: ApiService,
                private _functionService: FunctionsService ,
                private modalService: NgbModal,
                private authService: AuthService,
                private router: Router,
                ) { }


  consultaForm = new FormGroup({

    
    nombre: new FormControl(''),
    matricula: new FormControl(''),
    rol: new FormControl(''),
    tipo_consulta: new FormControl(''),
    param_busqueda: new FormControl('')

  });

  open(content, id) {
     
    console.log('se abrio el modal con id: ', id)

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

      this._apiService.getUsuarios()
      .then(response => {
        this.usuarios = response
        this._functionService.imprimirMensaje(response, "usuarios")
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
      confirmButtonText: 'Si, eliminar Usuario!'
    }).then((result) => {
      if (result.isConfirmed) {
        this._apiService.deleteUsuario(id)
        .then(() =>{ 
          Swal.fire(
          'Eliminado!',
          'El usuario fue eliminado.',
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

  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  buscarUsuario() {

    var numero = this.consultaForm.value.numero

    this._apiService.getUsuario(numero)
    .then((x:any) =>{

      console.warn(x);
      this.router.navigate(['/usuario/', x.id ]); //TOMA EL ID DEL OBJETO Y MUESTRA EL DETALLE
      
      //this.router.navigate(['/usuario'], { queryParams: { order: 'popular', 'price-range': 'not-cheap' } });
      

      //this._functionService.configSwal(this.mensajeSwal, `El usuario ${this.usuarioForm.value} fue creado correctamente.`, "success", "Aceptar", "", false, "", "");
      // this.mensajeSwal.fire().finally(()=> {
      //   this.ngOnInit();
      //   //this.mostrarLista();
      // });
    })
    .catch(()=>{
     // this._functionService.configSwal(this.mensajeSwal, `Error al intentar crear el usuario ${this.usuarioForm.value}`, "error", "Aceptar", "", false, "", "");
      //this.mensajeSwal.fire();
    });

  }
  
  onSubmit() {
    
    
    this._apiService.getUsuario(this.consultaForm.value)
    .then(() =>{
      console.warn(this.consultaForm.value);
      //this._functionService.configSwal(this.mensajeSwal, `El usuario ${this.usuarioForm.value} fue creado correctamente.`, "success", "Aceptar", "", false, "", "");
      // this.mensajeSwal.fire().finally(()=> {
      //   this.ngOnInit();
      //   //this.mostrarLista();
      // });
    })
    .catch(()=>{
     // this._functionService.configSwal(this.mensajeSwal, `Error al intentar crear el usuario ${this.usuarioForm.value}`, "error", "Aceptar", "", false, "", "");
      //this.mensajeSwal.fire();
    });
  }

  

}