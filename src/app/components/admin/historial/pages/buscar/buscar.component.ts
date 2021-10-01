
import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { TipoExpediente } from '../../../../../models/tipo_expediente.model';
import { FunctionsService } from '../../../../../services/functions.service';
import { FormControl, FormGroup } from '@angular/forms';
import {NgxPaginationModule} from 'ngx-pagination';
import {NgbModal, ModalDismissReasons} from '@ng-bootstrap/ng-bootstrap';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { AuthService } from '../../../../../services/auth.service';
import { Role } from 'src/app/models/role.models';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';




/**
 * @title Data table with sorting, pagination, and filtering.
 */
@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})


export class BuscarHistorialComponent implements OnInit {

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

  expediente: string
  tramite: string
  param_busqueda: ''
  historiales: any;  //cambiar tipos de datos any
  id: string;

  categories = [
    {id: 1, name: 'Expediente', value: 'expediente'},
    {id: 2, name: 'Tramite', value: 'tramite'},
  ]

  constructor( private _apiService: ApiService,
                private _functionService: FunctionsService ,
                private modalService: NgbModal,
                private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute,
                private spinner: NgxSpinnerService
                ) { this.load = false; }


    consultaForm = new FormGroup({
    param_busqueda: new FormControl(''),   
    numero: new FormControl(''),
    anio: new FormControl(''),
    tipo_expediente: new FormControl(''),
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
    this.id = this.route.snapshot.params['id'];
    if( this.id != null){
      this.buscarHistorial();
    }
  }


  get isAdmin() {
    return this.authService.hasRole(Role.ROL_ADMIN);
  }

  buscarHistorial() {
    

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

      //BUSCA POR NUMERO DE EXPEDIENTE Y TRAE EL TRAMITE CON OBSERVACION Y EXPEDIENTE

      this._apiService.getExpedienteNumero(numero, anio)
        .then((x:any) =>{
          this._apiService.getHistoriales(x.id).then((x:any) =>{
            console.log(x.results);
            this.historiales = x.results;
          })         
      }).catch(()=>{
        this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      });
      

    }else{

      //BUSCA POR NUMERO DE TRAMITE Y TRAE EL TRAMITE CON OBSERVACION Y EXPEDIENTE
      if(this.consultaForm.value.param_busqueda != 'tramite' && this.id != null){
        numeroanio = this.id
      }

      this._apiService.getExpedienteTramite(numeroanio)
        .then((x:any) =>{
          this._apiService.getHistoriales(x.id).then((x:any) =>{
            console.log(x.results);
            this.historiales = x.results;
          })
          // this.router.navigate(['/expediente/'+x.expediente.id],{ queryParams: { numero: numeroanio } }); //TOMA EL ID DEL OBJETO Y MUESTRA EL DETALLE
          
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
  
}