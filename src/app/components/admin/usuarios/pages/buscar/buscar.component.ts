
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../../../../services/auth.service';
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
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})
  

export class BuscarUsuarioComponent implements OnInit {


  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  closeResult = '';

  public page: number = 0;



 
  public load: boolean;
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
  p: number = 1;
  usuario: string
  tramite: string
  submitted = false;
  consultaForm : FormGroup


  constructor( private _apiService: ApiService,
                private _functionService: FunctionsService ,
                private modalService: NgbModal,
                private authService: AuthService,
                private router: Router,
                private formBuilder: FormBuilder,
                private spinner: NgxSpinnerService
                ) { }



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


  
      this._apiService.getInmuebles().then(response => {
        this.inmuebles = response
        this._functionService.imprimirMensaje(response, "inmuebles")
      })
  
      this._apiService.getObservaciones().then(response => {
        this.observaciones = response
        this._functionService.imprimirMensaje(response, "observaciones")
      })

      this._apiService.getRoles().then(response => {
        this.roles = response
        this._functionService.imprimirMensaje(response, "roles")
      })

      this.consultaForm = this.formBuilder.group({
        numero: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern(/^-?(0|[1-9]\d*)?$/)])],
        nombre: [''],
        matricula: [''],
        rol: [''],
        tipo_consulta: [''],
        param_busqueda: [''],
      })  
  }

  get f() { return this.consultaForm.controls; }


  buscarUsuarios() {
    this.spinner.show();
    this._apiService.getUsuariosFiltros(this.consultaForm.value)
    .then((res) =>{

      this.usuarios = res
     
      console.log(this.usuarios)
      
      if (this.usuarios.count == 0) {
        this.spinner.hide();
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      }else{
        this.usuarios = res
        this.spinner.hide();
      }

      this.load = false;
    
    })
    .catch(()=>{
      console.log('error')
    });
  }

  limpiar(){
    this.consultaForm.reset();
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
        this.buscarUsuarios()
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
    this.submitted = true;
    if (this.consultaForm.invalid) {
      this._functionService.imprimirMensaje(this.consultaForm, "consulta form: ")
      return;
    }
    
    this.spinner.show();
    var numero = this.consultaForm.value.numero
    
    //BUSCA POR NUMERO DE DNI
    this._apiService.getUsuarioNumero(numero)
      .then((x:any) =>{

        console.warn(x);
        this.router.navigate(['/usuario/'+x.results[0].id]); //TOMA EL ID DEL OBJETO Y MUESTRA EL DETALLE
          
    }).catch(()=>{
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      });
      

    
    this.spinner.hide();
  }
  
  // onSubmit() {
  //   this.submitted = true;
  //   console.log("sdasdasdasdadadasdas ",this.consultaForm)
  //   if (this.consultaForm.invalid) {
  //     this._functionService.imprimirMensaje(this.consultaForm.invalid, "expediente form invalid: ")
  //     return;
  //   }    
  //   this.buscarUsuario();
  // }

  

}