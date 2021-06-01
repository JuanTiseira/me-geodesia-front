import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(value: any, input: any): any {
    var listaObjetosFiltrado: Object[] = [];
    if (input) {
      // Convierte el valor a minúsculas
      input = input.toLowerCase();
      //Devuelve
      for (var i in value) {
        let object = value[i];
        for (var key in object) {
          let palabra = object[key].toString().toLowerCase();;
          if (palabra.indexOf(input) >= 0) {
            if (!listaObjetosFiltrado.includes(object)) {
              listaObjetosFiltrado.push(object);
            }
          }
        }
      }
      return listaObjetosFiltrado;
    } else {
      return value;
    }
  }
}
