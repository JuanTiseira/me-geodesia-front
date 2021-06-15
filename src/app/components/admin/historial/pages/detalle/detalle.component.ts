import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-detalle-historial',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})
export class DetalleHistorialComponent implements OnInit {

  expediente = null;
  message = '';

  constructor(
    private _apiService: ApiService,
    private _functionService: FunctionsService ,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router) {}

  ngOnInit(): void {
    this.message = '';

    this._apiService.getExpediente(this.route.snapshot.paramMap.get('id'))
    .then(response => {
      this.expediente = response
      this._functionService.imprimirMensaje(response, "historial")
    })
  }
}