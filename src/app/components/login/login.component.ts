import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { Role } from 'src/app/models/role.models';
import { AuthService } from 'src/app/services/auth.service';
import * as $ from 'jquery';
import { environment } from 'src/environments/environment';
import { ReCaptcha2Component } from 'ngx-captcha';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  @ViewChild('failSwal') failSwal: SwalComponent
  @ViewChild('captchaElem') captchaElem: ReCaptcha2Component
  loginForm: FormGroup;

  Role = Role;
  loading = false;
  date: Date;
  submitted = false;
  handleToken
  siteKey: string = environment.siteKey

  constructor(private router: Router,
    private authService: AuthService,
    private formBuilder: FormBuilder) { }

  ngOnInit(): void {
    // this._apiService.cancelarPeticionesPendientes()
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      // recaptcha: ['', Validators.required]
    })

    this.date = new Date()
  }


  get f() { return this.loginForm.controls; }

  onSubmit() {
    if(!this.loading){
      this.submitted = true;
      // stop here if form is invalid
      if (this.loginForm.invalid) {
        return;
      }
  
      this.loading = true;
      $("#btn-login").toggleClass('disabled');
      this.authService.login(this.loginForm.value.email, this.loginForm.value.password)
        .then(response => {
          if (response) {
            this.router.navigate(['home']);
          } else {
            $("#btn-login").removeClass('disabled');
            this.loading = false;
            this.failSwal.fire();
            // this.captchaElem.resetCaptcha();
          }
        })
    } 
  }

}
