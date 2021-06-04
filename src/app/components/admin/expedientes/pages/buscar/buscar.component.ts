import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styles: [
    `
      hr {
        margin-bottom: 50px;
        margin-top: 50px;
      } 
    `
  ]
})
export class BuscarComponent implements OnInit {

  displayedColumnsDetalles = ["1", "2", "3"];
  displayedColumnsSearchDetalles = ["1", "2", "3"];
  dataSourceDetalles = ["1", "2", "3"];
  mensajeResultadoDetalles = "Resultados";
  items = [1,2, 3, 4, 5]

  constructor() { }

  ngOnInit(): void {
  }

}
