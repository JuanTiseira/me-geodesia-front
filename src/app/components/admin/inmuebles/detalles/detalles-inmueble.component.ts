import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { NgxSpinnerService } from 'ngx-spinner';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-detalles',
  templateUrl: './detalles-inmueble.component.html',
  styleUrls: ['./detalles-inmueble.component.scss']
})
export class DetallesInmuebleComponent implements OnInit, OnDestroy{

  @ViewChild('mensajeSwal') mensajeSwal: SwalComponent
  inmueble: any;
  id: string;
  inmueblesSub: Subscription;

  constructor(
    private _apiService: ApiService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.buscarInmueble();
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }

  buscarInmueble() {
    this.spinner.show();
    this.inmueblesSub = this._apiService.getInmueble(this.id)
      .subscribe((response) => {
        this.inmueble = response;
      })
    this._apiService.cargarPeticion(this.inmueblesSub)  
    this.spinner.hide();
  }

}
