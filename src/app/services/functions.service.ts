import { Injectable } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor() { }


  configSwal(mensajeSwal: SwalComponent, title: string, icon:string, btnAceptar:string, btnCancelar:string, showCancelButton: boolean, confirmButtonColor:string , cancelButtonColor:string){
    mensajeSwal.title = title;
    mensajeSwal.confirmButtonText = btnAceptar;
    mensajeSwal.cancelButtonText = btnCancelar;
    mensajeSwal.showCancelButton = showCancelButton;
    mensajeSwal.confirmButtonColor = confirmButtonColor == ""? "#53BAAB": confirmButtonColor;
    mensajeSwal.cancelButtonColor = cancelButtonColor == ""? "": cancelButtonColor;

    switch (icon) {
      case "warning":
        mensajeSwal.icon = "warning";
        break;
      case "success":
        mensajeSwal.icon = "success";
        break;
      case "error":
        mensajeSwal.icon = "error";
        break;
      case "question":
        mensajeSwal.icon = "question";
        break; 
      case "info":
        mensajeSwal.icon = "info";
        break;     
    
      default:
        mensajeSwal.icon = "warning";
        break;
    }    
    return mensajeSwal;
  }



  imprimirMensaje(obj, mensaje){
    if(!environment.production){
      console.log(`Debug:     ${mensaje}: `,obj);
    }
  }

  imprimirTabla(obj){
    if(!environment.production){
      console.table(obj);
    }
  }


}
