import {Injectable} from '@angular/core';
import {HttpHandler, HttpRequest, HttpInterceptor} from '@angular/common/http';
import {throwError} from 'rxjs';
import {catchError} from 'rxjs/internal/operators';
import { FunctionsService } from './functions.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
@Injectable({
  providedIn: 'root'
})
export class HttpErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router,) {}
  
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(error => {
        switch (error.status) {
          case 500:
            Swal.fire({
              title: 'Error' + ` ${error.status}`,
              text: error?.message,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            })
            break;
          case 404:
            Swal.fire({
              title: 'No se encontró el recurso solicitado',
              text: error?.message,
              icon: 'info',
              confirmButtonText: 'Aceptar'
            })
            break; 
          case 401:
            Swal.fire({
              title: 'Sin permiso' + ` ${error.status}`,
              text: 'Por favor volver a loguearse.',
              icon: 'info',
              confirmButtonText: 'Aceptar'
            }).finally(() => {
              this.router.navigate(['login']);
            })
            
            break;
        }
        return throwError(error.status);
      })
    );
  }
}