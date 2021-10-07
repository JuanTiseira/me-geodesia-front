import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'invert'
})
export class InvertPipe implements PipeTransform {

  transform(array, asc = true){
    if (asc){
      return Array.from(array).reverse();
    }

}

}
