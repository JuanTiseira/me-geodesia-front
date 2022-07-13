import { Injectable } from '@angular/core';
import { Role } from '../models/role.models';
import { User } from '../models/user.models';
import { TokenService } from './token.service';
import { ApiService } from './api.service';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private usert: User;
  private data = {}

  constructor(private _apiService: ApiService,
    private _tokenService: TokenService,
    private router: Router
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
  }

  hasRole(role: Role[]) {
    let authority = false;
    let rolAuth = false;
    if (this.isAuthorized()) authority = true; else return false;
    for(var i = 0; i < role.length; i++){
      if (this.usert.authorities[0].authority === role[i]) rolAuth = true;
    } 
    return (authority && rolAuth);
  }


  login(user: string, password: string, responseCaptcha: string): Promise<boolean> {
    var log = false;
    return this._apiService.getLogin(user.toUpperCase(), password, responseCaptcha)
      .then((response: any )=> {
        this._tokenService.setData(response);   
        this.usert = response;
        log = true;
        return log;
        }  
      )
      .catch(error =>{
        this.logout()
        return log;
      })     
  }



  logout() {
     
    this.usert = null; 
    this._tokenService.setData(this.data);
    this.router.navigate(['login']);
    
  }

}
