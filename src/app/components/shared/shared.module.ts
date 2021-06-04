import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BuscadorComponent } from './buscador/buscador.component';
import { CardComponent } from './card/card.component';
import { BotonComponent } from './boton/boton.component';
import { PaginadorComponent } from './paginador/paginador.component';
import { FiltroComponent } from './filtro/filtro.component';
import { ComboBoxComponent } from './combo-box/combo-box.component';
import { TablaComponent } from './tabla/tabla.component';



@NgModule({
  declarations: [
    BuscadorComponent,
    CardComponent,
    TablaComponent,
    BotonComponent,
    PaginadorComponent,
    FiltroComponent,
    ComboBoxComponent,
  ],
  imports: [
    CommonModule
  ],
  exports: [
    BuscadorComponent,
    CardComponent,
    TablaComponent,
    BotonComponent,
    PaginadorComponent,
    FiltroComponent,
    ComboBoxComponent,
    CommonModule
  ]
})
export class SharedModule { }
