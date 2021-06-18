import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private url: string;
  private urlLogin: string;
  private res: string;

  constructor(
    private http: HttpClient,
    private router: Router,
    
    ) { 
      this.url  =  environment.endpoint;
      this.urlLogin = this.url + '/auth/';
      
  }

  getLogin(username: string, password: string){
    var data = new FormData();
    data.append('username', username);
    data.append('password', password);
    return this.http.post(this.urlLogin, data).toPromise();
  }

  

  errorPeticion(){
    this.router.navigate(['login']);
  }

  //EXPEDIENTES 

  getExpedientes(){
    return this.http.get(this.url+'/expedientes/').toPromise().catch(()=>
    { 
        console.log("ERRORRRRR.");
        this.router.navigate(['login']);
    });
  }

  getExpediente(id){
    return this.http.get(this.url+`/expedientes/${id}`).toPromise();
  }

  setExpediente(expediente) {
    console.warn(expediente);
    return this.http.post(this.url+'/expedientes/', expediente).toPromise();
  }

  editExpediente(expediente) {
    console.warn(expediente);

    return this.http.post(this.url+'/expedientes/', expediente).toPromise();
  }

  deleteExpediente(expediente) {
    console.warn(expediente);
    return this.http.delete(this.url+'/expedientes/', expediente).toPromise();
  }



  //TIPO EXPETIENTE 
  
  getTipoExpedientes () { 
    return this.http.get(this.url+'/tipo_expedientes/').toPromise();
  }

  //DOCUMENTO 

  getDocumentos () {
    return this.http.get(this.url+'/documentos/').toPromise();
  }

  //TRAMITE 

  getTramites () {
    return this.http.get(this.url+'/tramites/').toPromise();
  }

  //OBSERVACION 

  getObservaciones () {
    return this.http.get(this.url+'/observaciones/').toPromise();
  }

  //INMUEBLE 

  getInmuebles () {
    return this.http.get(this.url+'/inmuebles/').toPromise();
  }

  //PROPIETARIO

  getUsuarios () {
    return this.http.get(this.url+'/usuarios/').toPromise();
  }

  
}
