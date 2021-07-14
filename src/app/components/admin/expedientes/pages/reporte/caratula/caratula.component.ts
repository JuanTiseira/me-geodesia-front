import { Component, OnInit } from '@angular/core';
import {NgxPrintModule} from 'ngx-print';
@Component({
  selector: 'app-caratula',
  templateUrl: './caratula.component.html',
  styleUrls: ['./caratula.component.scss']
})
export class CaratulaComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  elementType = 'svg';
  value = '1234567';
  format = 'EAN8';
  lineColor = '#000000';
  width = 1.5;
  height = 24;
  displayValue = true;
  font = 'monospace';
  textAlign = 'center';
  textPosition = 'bottom';
  textMargin = 2;
  fontSize = 24;
  background = '#ffffff';
  margin = 0;
  marginTop = 0;
  marginBottom = 0;
  marginLeft = 0;
  marginRight = 0;

  get values(): string[] {
    return this.value.split('\n');
  }
  codeList: string[] = [
    '', 'CODE128',
    'CODE128A', 'CODE128B', 'CODE128C',
    'UPC', 'EAN8', 'EAN5', 'EAN2',
    'CODE39',
    'ITF14',
    'MSI', 'MSI10', 'MSI11', 'MSI1010', 'MSI1110',
    'pharmacode',
    'codabar'
  ];

  mytodos = [
    {
      item:'need to buy movie tickets',
      isCompleted:false
    },
    {
      item:'Gardening tomorrow 9:00AM',
      isCompleted:false
    },
    {
      item:'Car Washing',
      isCompleted:true
    },
    {
      item:'Buy a pen',
      isCompleted:false
    }
  ]
  title = 'print-sample';

}
