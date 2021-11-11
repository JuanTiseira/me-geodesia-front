
import {AfterViewInit, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from 'src/app/services/auth.service';
import { Role } from 'src/app/models/role.models';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Subscription } from 'rxjs';




/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})
  

export class BuscarUsuarioComponent implements OnInit, OnDestroy{


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
  submitted2 = false;
  consultaForm : FormGroup
  consultaAvanzadaForm : FormGroup

  inmueblesSub: Subscription;
  observacionesSub: Subscription;
  rolesSub: Subscription;
  usuariosSub: Subscription;
  eliminarUsuarioSub: Subscription;
  usuarioSub: Subscription;


  constructor( private _apiService: ApiService,
                private _functionService: FunctionsService ,
                private modalService: NgbModal,
                private authService: AuthService,
                private router: Router,
                private formBuilder: FormBuilder,
                private spinner: NgxSpinnerService
                ) { }



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
        this._functionService.imprimirMensaje(response, "inmuebles")
      })

    this._apiService.cargarPeticion(this.inmueblesSub)


    this.observacionesSub = this._apiService.getObservaciones()
      .subscribe(response => {
        this.observaciones = response
        this._functionService.imprimirMensaje(response, "observaciones")
      })

    this._apiService.cargarPeticion(this.observacionesSub);

    this.rolesSub = this._apiService.getRoles()
      .subscribe(response => {
        this.roles = response
        this._functionService.imprimirMensaje(response, "roles")
        
        this.spinner.hide();
      })
    this._apiService.cargarPeticion(this.rolesSub);  

    this.consultaForm = this.formBuilder.group({
      numero: ['', Validators.compose([Validators.required, Validators.minLength(7), Validators.pattern(/^-?(0|[0-9]\d*)?$/)])]
    })  

    this.consultaAvanzadaForm = this.formBuilder.group({
      nombre: ['', Validators.pattern(/^[a-zA-Z\s]+$/)],
      matricula: ['', Validators.compose([Validators.minLength(4), Validators.pattern(/^-?(0|[0-9]\d*)?$/)])],
      rol: [''],
      tipo_consulta: [''],
      param_busqueda: [''],
    }) 
  }

  get f() { return this.consultaForm.controls; }
  get g() { return this.consultaAvanzadaForm.controls; }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }
  
  buscarUsuarios() {
    this.submitted2 = true;
    if (this.consultaAvanzadaForm.invalid) {
      return;
    }
    this.spinner.show();
    this.usuariosSub = this._apiService.getUsuariosFiltros(this.consultaAvanzadaForm.value)
      .subscribe((res) =>{
        this.usuarios = res
        this._functionService.imprimirMensaje(this.usuarios, "usuarios: ")
        
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
    this._apiService.cargarPeticion(this.usuariosSub)
  }

  limpiar(form){
    form.reset();
  }

  eliminar (id) {
    Swal.fire({
      title: '¿Está seguro de que desea eliminar el Usuario?',
      text: "No podra revertir la acción",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText : 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eliminarUsuarioSub = this._apiService.deleteUsuario(id)
          .subscribe(() =>{ 
            Swal.fire(
              'Eliminado!',
              'El usuario fue eliminado.',
              'success') 
            this.buscarUsuarios()
          })
        this._apiService.cargarPeticion(this.eliminarUsuarioSub)
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

  get isEmpleadoME() {
    return this.authService.hasRole(Role.ROL_EMPLEADOME);
  }

  buscarUsuario() {
    this.submitted = true;
    if(this.consultaForm.value.numero < 1){
      this._functionService.configSwal(this.mensajeSwal, `Debe ingresar un DNI`, "info", "Aceptar", "", false, "", "");
      this.mensajeSwal.fire();
      return;
    }
    if (this.consultaForm.invalid) {
      return;
    }
    
    this.spinner.show();
    var numero = this.consultaForm.value.numero
    
    //BUSCA POR NUMERO DE DNI
    this.usuarioSub = this._apiService.getUsuarioNumero(numero)
      .subscribe((x:any) =>{
        if ( x.count > 0){
          this.router.navigate(['/usuario/'+x.results[0].id]); //TOMA EL ID DEL OBJETO Y MUESTRA EL DETALLE 
        } else {
          this._functionService.configSwal(this.mensajeSwal, `No se encontró ningún usuario.`, "info", "Aceptar", "", false, "", "");
          this.mensajeSwal.fire();
        }
      })
    this.spinner.hide();
    this._apiService.cargarPeticion(this.usuarioSub)
  }
  

  onTableDataChange(event) {
    this.spinner.show();
    this._apiService.changePage(event, 'usuarios')
      .then((res) =>{

        this.p =  event
        this.usuarios = res
        
        if (this.usuarios.count == 0) {
          this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
          this.mensajeSwal.fire()
        }else{
          this.usuarios = res
        }
        this.load = false;
      
      })
      .catch(()=>{
        this._functionService.imprimirMensaje(event, "error onTableDataChange: ")
      })
      .finally(()=>{
        this.spinner.hide();
      })

  } 


}