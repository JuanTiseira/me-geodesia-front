import { Injectable } from '@angular/core';
import { Authority } from '../models/authority.models';

import { LocalService } from 'src/app/services/storage/local.service';
import { LoginUser } from '../models/login-user.models';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  roles: Array<Authority> = [];

  constructor(
    private _localService: LocalService,
    private router: Router
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
    var username = dato != null? dato.user.username: null;
    return username;
    // return localStorage.getItem(USERNAME_KEY);
  }

  public getAuthorities(): Authority[] {
    var dato: LoginUser = this._localService.getJsonValue("dato");
    this.roles = dato != null? dato.user.authorities: null;
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