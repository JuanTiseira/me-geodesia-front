import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Role } from 'src/app/models/role.models';
import { AuthService } from 'src/app/services/auth.service';
import * as $ from 'JQuery';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit{
  @ViewChild('failSwal') failSwal: SwalComponent
  Role = Role;
  loginForm: FormGroup;
  loading = false;

  constructor(private router: Router,
    private authService: AuthService, 
     private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
  })    
  }

  onSubmit(formData: {email: string, password: string}) {

    this.loading = true;
    $("#btn-login").toggleClass('disabled');
    this.authService.login(formData.email, formData.password)
    .then(response => {
      
      if(response){
        
        this.router.navigate(['home']);
      }else{
            this.failSwal.fire();
      }
    })
    .catch(error => {
      
      $("#btn-login").removeClass('disabled');
      this.loading = false;
      this.failSwal.fire();
    });   
  }
}
