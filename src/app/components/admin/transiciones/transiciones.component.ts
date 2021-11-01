import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-transiciones',
  templateUrl: './transiciones.component.html',
  styleUrls: ['./transiciones.component.scss']
})
export class TransicionesComponent implements OnInit {
  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  load: boolean = false;
  consultaForm : FormGroup;
  tramites: any;
  p: number = 1;
  sectores:any;
  
  constructor(private _apiService: ApiService,
              private _functionService: FunctionsService ,
              private formBuilder: FormBuilder,
              private router: Router,
              private spinner: NgxSpinnerService) { }

  ngOnInit(): void {
    this.consultaForm = this.formBuilder.group({
      param_busqueda: ['', Validators.required],   
      numero: ['', Validators.compose([Validators.required, Validators.maxLength(8), Validators.pattern(/^-?([0-9]\d*)?$/)])],
      anio: [''],
      tipo_expediente: [''],
      inmueble: [''],
      documento: [''],
      propietario: [''],
      gestor: [''],
      tramite: [''],
      observacion: [''],
      abreviatura: [''],
      agrimensor: [''],
      tipo_consulta: [''],
      });


      this.buscarTramites();
      this.buscarSectores();
  }




  buscarTramites() {
    this.spinner.show();
    this._apiService.getHistorialesUltimos()
      .then((res:any) =>{

        this.tramites = res  
        if (this.tramites.count == 0) {
          this._functionService.configSwal(this.mensajeSwal, 'No se encuentran registros', "info", "Aceptar", "", false, "", "");
          this.mensajeSwal.fire()
        }
        this.load = false;
      })
      .catch((error)=>{

      })
      .finally(()=>{
        this.spinner.hide();
      })
  }

  buscarSectores(){
    this.spinner.show();
    this._apiService.getSectores()
      .then((res:any)=>{
        this.sectores = res.results
      })
      .catch((error)=>{
        this._functionService.configSwal(this.mensajeSwal, 'No se encuentran sectores', "info", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      })
  }

  onChange(value) {
    value = value.split(",");
    let json = {
      'sector':value[0],
      'tramite': value[1]
    }

    this._apiService.setNuevaTransicionAdmin(json)
      .then((res:any)=>{
        this._functionService.configSwal(this.mensajeSwal, res.message, "success", "Aceptar", "", false, "", "");
        this.mensajeSwal.fire()
      })
}


  onTableDataChange(event) {
    this.spinner.show();
    this._apiService.changePage(event, 'historiales/ultimos_historiales')
      .then((res) =>{

        this.p =  event
        this.tramites = res
        
        if (this.tramites.count == 0) {
          this._functionService.configSwal(this.mensajeSwal, `No se encuentran registros`, "info", "Aceptar", "", false, "", "");
          this.mensajeSwal.fire()
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
