import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../../services/api.service';
import { FunctionsService } from '../../../../../services/functions.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.scss']
})


export class DetalleComponent implements OnInit {
  idEdit: boolean
  expediente = null;
  message = '';
  expedienteForm: FormGroup;
  id: string;
  isAddMode: boolean;
  loading = false;
  submitted = false;

  constructor(
    private _apiService: ApiService,
    private _functionService: FunctionsService ,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
   
    ) {}

  ngOnInit(): void {


    this.id = this.route.snapshot.params['id'];
    this.isAddMode = !this.id;

    this.expedienteForm = this.formBuilder.group({
      numero: ['', Validators.required],
      anio: ['', Validators.required],
      tipo_expediente: ['', Validators.required],
      inmueble: ['', [Validators.required]],
      documento: ['', Validators.required],
      propietario: ['', Validators.required],
      gestor: ['', Validators.required],
      tramite: ['', Validators.required],
      observacion: ['', Validators.required],
      abreviatura: ['', Validators.required],
      agrimensor: ['', Validators.required],
      }, {
         
      });


      if (!this.isAddMode) {
        this._apiService.getExpediente(this.route.snapshot.paramMap.get('id'))
        .then(x => this.expedienteForm.patchValue(x));
    }
    this.message = '';
    
    this.idEdit = false

    this._apiService.getExpediente(this.route.snapshot.paramMap.get('id'))
    .then(response => {
      this.expediente = response
      this._functionService.imprimirMensaje(response, "expediente")
    })


    
  }

  compareFn(c1, c2): boolean {
    return c1 && c2 ? c1.id === c2.id : c1 === c2;
}

}
