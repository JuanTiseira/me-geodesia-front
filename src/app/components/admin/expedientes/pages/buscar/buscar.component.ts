import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.scss']
})
export class BuscarComponent implements OnInit {

  displayedColumnsDetalles = ["1", "2", "3"];
  displayedColumnsSearchDetalles = ["1", "2", "3"];
  dataSourceDetalles = ["1", "2", "3"];
  mensajeResultadoDetalles = "Resultados";
  items = [1,2, 3, 4, 5]

  
  loading: boolean;

  constructor() { }

  ngOnInit(): void {
  }

}
