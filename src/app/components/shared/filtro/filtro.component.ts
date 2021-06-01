import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-filtro',
  templateUrl: './filtro.component.html',
  styleUrls: ['./filtro.component.scss']
})
export class FiltroComponent implements OnInit {

  items = [1,2, 3, 4, 5]
  constructor() { }

  ngOnInit(): void {
  }

}
