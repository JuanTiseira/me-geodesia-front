import { Component, OnInit } from '@angular/core';
import {MatTableModule} from '@angular/material/table';

@Component({
  selector: 'app-buscar',
  templateUrl: './buscar.component.html',
  styles: [
  ]
})
export class BuscarUsuarioComponent implements OnInit {

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


