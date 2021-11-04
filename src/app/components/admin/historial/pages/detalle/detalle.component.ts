import { Component, OnInit, OnDestroy } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-detalle-historial',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleHistorialComponent implements OnInit, OnDestroy {

  expediente = null;
  message = '';
  expedienteSub: Subscription;

  constructor(
    private _apiService: ApiService,
    private _functionService: FunctionsService ,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.message = '';

    this.expedienteSub = this._apiService.getExpediente(this.route.snapshot.paramMap.get('id'))
      .subscribe(response => {
        this.expediente = response
        this._functionService.imprimirMensaje(response, "historial")
      })
    this._apiService.cargarPeticion(this.expedienteSub);  
  }

  ngOnDestroy(): void {
    this._apiService.cancelarPeticionesPendientes()
  }
}