import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import {environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url: string;
  private urlLogin: string;

  constructor(
    private http: HttpClient,
    private router: Router
    ) { 
      this.url  =  environment.endpoint;
      this.urlLogin = this.url + '/auth/';
      
  }

  getLogin(username: string, password: string){
    var data = new FormData();
    data.append('username', username);
    data.append('password', password);
    return this.http.post(this.urlLogin, data).toPromise();
  }


  errorPeticion(){
    this.router.navigate(['login']);
  }


   
}
