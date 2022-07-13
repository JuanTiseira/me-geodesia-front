import { Injectable } from '@angular/core';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { environment } from 'src/environments/environment';
import { Role } from '../models/role.models';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(private authService: AuthService) { }


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



  imprimirMensajeDebug(obj, mensaje){
    if(!environment.production){
      console.log(`Debug:     ${mensaje}: `,obj);
    }
  }

  imprimirTabla(obj){
    if(!environment.production){
      console.table(obj);
    }
  }





  get isAdmin() {
    return this.authService.hasRole([Role.ROL_ADMIN]);
  }

  get isEmpleado() {
    return this.authService.hasRole([Role.ROL_LINDERO, Role.ROL_TECNICO, Role.ROL_PARCELAMIENTO, Role.ROL_PRES_POST]);
  }

  get isEmpleadoME() {
    return this.authService.hasRole([Role.ROL_MESA_ENTRADA]);
  }

  get isEmpleadoCarga() {
    return this.authService.hasRole([Role.ROL_EMPLEADO_CARGA]);
  }

  get isExterno() {
    return this.authService.hasRole([Role.ROL_PROFESIONAL]);
  }

  get isPropietario() {
    return this.authService.hasRole([Role.ROL_PROPIETARIO]);
  }


}
