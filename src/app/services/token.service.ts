import { Injectable } from '@angular/core';
import { Authority } from '../models/authority.models';


import { LoginUser } from '../models/login-user.models';
import { Router } from '@angular/router';
import { LocalService } from './storage/local.service';
import { FunctionsService } from './functions.service';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<Authority> = [];

  constructor(
    private _localService: LocalService,
    private router: Router,
    private _functionService: FunctionsService
    ) { }


  public setData(objeto){
    this._localService.setJsonValue("data", objeto);
  }  

  public getData(){
    return this._localService.getJsonValue("data");
  }  


  public getToken(): string {
    var dato: LoginUser = this._localService.getJsonValue("data");
    var token = dato != null? dato.token: null;
    return token
  }

  public getUserName(): string {
    var dato: LoginUser = this._localService.getJsonValue("data");
    var user_name = dato != null? dato.user_name: null;
    return user_name;
    // return localStorage.getItem(USERNAME_KEY);
  }

  public getAuthorities(): Authority[] {
    //this._functionService.imprimirMensaje(this._localService.getJsonValue("dato"), "dato en localstorage, getAuthorities")

    
    var dato: LoginUser = this._localService.getJsonValue("dato");
    this.roles = dato != null? dato.authorities: null;
    // this.roles = [];
    // if (localStorage.getItem(AUTHORITIES_KEY)) {
    //   JSON.parse(localStorage.getItem(AUTHORITIES_KEY)).forEach(authority => {
    //     var auth: Authority = {"authority":authority.authority}
    //     this.roles.push(auth);
    //   });
    // }
    // console.log("get authorities: ", this.roles)
    return this.roles;
  }

  public logOut(): void {
    this._localService.clearToken();
    this.router.navigate(['login']);
  }
}