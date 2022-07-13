import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { AuthService } from 'src/app/services/auth.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-transiciones',
  templateUrl: './transiciones.component.html',
  styleUrls: ['./transiciones.component.scss']
})
export class TransicionesComponent implements OnInit, OnDestroy {
  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent

  load: boolean = false;
  consultaForm : FormGroup;
  tramites: any;
  p: number = 1;
  sectores:any;
  sinSector:boolean = false;

  historialesSub: Subscription;
  historialesSinSectorSub: Subscription;
  sectorSub: Subscription;
  transicionSub: Subscription;
  
  constructor(private _apiService: ApiService,
              private _functionService: FunctionsService ,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
      this.buscarTramites();
      this.buscarSectores();
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }

  buscarTramites() {
    this.spinner.show();
    this.sinSector = false;
    this.p = 1;
    this.historialesSub = this._apiService.getHistorialesUltimos()
      .subscribe((res:any) =>{

        this.tramites = res
        if (this.tramites.count == 0) {
          this._functionService.configSwal(this.mensajeSwal, 'No se encuentran registros', "info", "Aceptar", "", false, "", "");
          this.mensajeSwal.fire()
        }
        this.load = false;
      },(error)=>{

      },()=>{
        this.spinner.hide();
      })
    this._apiService.cargarPeticion(this.historialesSub);
  }

  buscarTramitesSinSector(){
    this.spinner.show();
    this.sinSector = true
    this.p = 1
    this.historialesSinSectorSub = this._apiService.getHistorialesUltimosFiltro(1)
      .subscribe((res:any) => {
        this.tramites = res
        if (this.tramites.count == 0) {
          this._functionService.configSwal(this.mensajeSwal, 'No se encuentran registros', "info", "Aceptar", "", false, "", "");
          this.mensajeSwal.fire()
        }
        this.load = false;
      },(error)=>{

      },()=>{
        this.spinner.hide();
      })
    this._apiService.cargarPeticion(this.historialesSinSectorSub);
  }

  buscarSectores(){
    this.spinner.show();
    this.sectorSub = this._apiService.getSectores()
      .subscribe((res:any)=>{
        this.sectores = res.results
      }, error=>{
        this.spinner.hide()
      })
    this._apiService.cargarPeticion(this.sectorSub)
  }

  onChange(value) {
    value = value.split(",");
    let json = {
      'sector':value[0],
      'tramite': value[1],
      'tipo_expediente':value[2]
    }

    this.transicionSub = this._apiService.setNuevaTransicionAdmin(json)
      .subscribe((res:any)=>{
        this._functionService.configSwal(this.mensajeSwal, res.message, "success", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      })
    this._apiService.cargarPeticion(this.transicionSub)
}


  onTableDataChange(event) {
    this.spinner.show();
    let endpointHistorial = 'historiales/ultimos_historiales'
    if(this.sinSector) endpointHistorial = 'historiales/ultimos_historiales_filtros'
    this._apiService.changePage(event, endpointHistorial)
      .then((res:any) =>{

        this.p =  event
        this.tramites = res
        
        if (this.tramites.count == 0) {
          this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
          this.mensajeSwal.fire()
        }

        this.load = false;
      
      })
      .catch(()=>{
        this._functionService.imprimirMensajeDebug(event, "error onTableDataChange: ")
      })
      .finally(()=>{
        this.spinner.hide();
      })

  } 

}
