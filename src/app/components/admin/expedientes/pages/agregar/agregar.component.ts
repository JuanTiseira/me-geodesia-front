import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SwalComponent } from '@sweetalert2/ngx-sweetalert2';
import { ApiService } from '../../../../../services/api.service';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styleUrls: ['./agregar.component.scss']
})
export class AgregarComponent implements OnInit {

  @ViewChild('failSwal') failSwal: SwalComponent

  expediente = {
    numero: ''
  }

  
  constructor(private router: Router,
              private _apiService: ApiService,
              private formBuilder:FormBuilder) { }

  ngOnInit(): void {
    
  
  }

  guardar() {

    console.log('formulario posteado', this.expediente);
    this._apiService.setExpediente()
    // .then(response => {
    //   if(response){
    //     this.router.navigate(['home']);
    //   }else{
    //         // this.failSwal.fire();
    //   }
    // })
    // .catch(error => {
    //   console.log(error)
    //   // this.failSwal.fire();
    // });   
  }

}
