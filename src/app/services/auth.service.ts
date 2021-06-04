import { Injectable } from '@angular/core';
import { Role } from '../models/role.models';
import { User } from '../models/user.models';
import { TokenService } from './token.service';

import { ApiService } from './api.service';
import { LoginUser } from '../models/login-user.models';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private usert: User;

  constructor(private _apiService: ApiService,
    private _tokenService: TokenService
    ) { }



  isAuthorized() {
    this.usert = new User();
    this.usert.authorities = this._tokenService.getAuthorities();
    this.usert.username = this._tokenService.getUserName();

    if(this.usert.username != null){
      return this.usert;
    }else{
      return false;
    }
    return true;
  }

  hasRole(role: Role) {
      return this.isAuthorized() && this.usert.authorities[0].authority === Role.ROLE_ADMIN;
  }

  hasRole(){

  }


  login(user: string, password: string): Promise<boolean> {
    var log = false;
    return this._apiService.getLogin(user, password)
      .then(response => {
        this._tokenService.setData(response);              
        this.usert = response['user'];
        log = true;
        return log;
        }  
      )
      .catch(error =>{
        console.log("login error: ",error);
        return log;
      })     
  }



  logout() {
    this.usert = null; 
  }
}
