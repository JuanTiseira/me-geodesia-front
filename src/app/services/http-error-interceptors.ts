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
        let errorMessage = '';
        if (error instanceof ErrorEvent) {
          // client-side error
          errorMessage = `Client-side error: ${error.error.message}`;
          Swal.fire({
            title: 'Error! ' + ` ${error.error.status}`,
            text: 'Ocurrio un error en la operacion',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        } else {
          // backend error
          errorMessage = `Server-side error: ${error.status} ${error.message}`;
          Swal.fire({
            title: 'Error! ' + ` ${error.status}`,
            text: 'Ocurrio un error en la operacion',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          })
        }
        
        // aquí podrías agregar código que muestre el error en alguna parte fija de la pantalla.
        if (error.status == 401) {
          console.log("error: ",error.status)
            this.router.navigate(['login']);
            
        }

        console.log('error', errorMessage)
        return throwError(errorMessage);
      })
    );
  }
}