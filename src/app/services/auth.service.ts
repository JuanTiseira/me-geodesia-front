import { Injectable } from '@angular/core';
import { Role } from '../models/role.models';
import { User } from '../models/user.models';
import { TokenService } from './token.service';
import Swal from 'sweetalert2'
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
    return true;
  }

  hasRole(role: Role) {
      return this.isAuthorized() && this.usert.authorities[0].authority === role;
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
