import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-historial',
  templateUrl: './historial.component.html',
  styles: [


    
  ]
})
export class HistorialComponent implements OnInit {

  displayedColumnsDetalles = ["1", "2", "3"];
  displayedColumnsSearchDetalles = ["1", "2", "3"];
  dataSourceDetalles = ["1", "2", "3"];
  mensajeResultadoDetalles = "Resultados";

  constructor() { }

  ngOnInit(): void {
  }

}
