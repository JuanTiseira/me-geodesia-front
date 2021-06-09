import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpResponse, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from './token.service';


@Injectable()
export class ValidatorInterceptorService implements HttpInterceptor {
  constructor(private _tokenService: TokenService){}

  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const Authorization = `Token ${this._tokenService.getToken()}`;
    const userName = this._tokenService.getUserName();
    // si no hay usuario no modifica la petición (si intercepta sin modificar )
    if(userName != null){
      return next.handle(httpRequest.clone({ 
        headers: httpRequest.headers.set('Authorization', Authorization)
       })); 
    }else{
      return next.handle(httpRequest.clone({ })); 
    }
  }
}