import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';
import { FunctionsService } from './functions.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import { TokenService } from './token.service';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router,
              private _functionService: FunctionsService,
              private _tokenService: TokenService,
              private _apiService: ApiService) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(error => {
        this._functionService.imprimirMensaje(error, "error INTERCEPTOR: ")
        switch (error.status) {
          case 500:
            Swal.fire({
              title: 'Error' + ` ${error.status}`,
              text: error?.message,
              icon: 'error',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#53BAAB'
            })
            break;
          case 404:
            let mensaje = error.error.detail!=null?error.error.detail:error.error
            Swal.fire({
              title: mensaje,
              icon: 'info',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#53BAAB'
            })
            break; 
            case 400:
              let mensaje2 = error.error.message!=null?error.error.message : error.error.detail!=null?error.error.detail : error.error.error!=null?error.error.error : error.error
              Swal.fire({
                title: error?.status,
                text: mensaje2,
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#53BAAB'
              })
              break;             
          case 401:
            this._apiService.cancelarPeticionesPendientes();
            Swal.fire({
              title: 'Sin permiso' + ` ${error.status}`,
              text: 'Por favor volver a ingresar.',
              icon: 'info',
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#53BAAB'
            }).finally(() => {
              this._tokenService.logOut()
              this.router.navigate(['login']);
            })
            
            break;

            case 403:
              Swal.fire({
                title:  "No tienes los permisos necesarios para realizar esta acción",
                icon: 'error',
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#53BAAB'
              })
              
              break;            
        }
        return throwError(error.status);
      })
    );
  }
}