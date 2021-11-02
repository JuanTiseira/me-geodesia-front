import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { ApiService } from 'src/app/services/api.service';
import { FunctionsService } from 'src/app/services/functions.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles-inmueble.component.html',
  styleUrls: ['./detalles-inmueble.component.scss']
})
export class DetallesInmuebleComponent implements OnInit {

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  inmueble: any;
  id: string;

  constructor(
    private _apiService: ApiService,
    private _functionService: FunctionsService ,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.buscarInmueble();
  }

  buscarInmueble() {
    this.spinner.show();
    const inmueblesSub = this._apiService.getInmueble(this.id)
      .subscribe((response) => {
        this.inmueble = response;
      })
    this._apiService.cargarPeticion(inmueblesSub)  
    this.spinner.hide();
  }

}
