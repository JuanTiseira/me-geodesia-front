import { Injectable } from '@angular/core';
import { Role } from '../models/role.models';
import { User } from '../models/user.models';
import { TokenService } from './token.service';

import { ApiService } from './api.service';


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
    this.usert.user_name = this._tokenService.getUserName();

    if(this.usert.user_name != null){
      return this.usert;
    }else{
      return false;
    }
    return true;
  }

  hasRole(role: Role) {
      return this.isAuthorized() && this.usert.authorities[0].authority === Role.ROL_ADMIN;
  }


  login(user: string, password: string): Promise<boolean> {
    var log = false;
    return this._apiService.getLogin(user, password)
      .then(response => {
        this._tokenService.setData(response);              
        this.usert = response['user'];
        log = true;

        //alert('entra')
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
