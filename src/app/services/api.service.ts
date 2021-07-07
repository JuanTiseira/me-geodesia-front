import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { catchError, debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';


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

  changePage(page, module){
    console.log('bucando pagina: ' , page)
    return this.http.get(this.url+`/${module}/?page=${page}`).toPromise().catch((e)=>
    {   
        console.log("ERRORRRRR.", e);
        //this.router.navigate(['login']);
    });
  }

  //EXPEDIENTES  ////////////////////////////////////////////////////////////////////////////////

  getExpedientes(){
    return this.http.get(this.url+'/expedientes/').toPromise().catch(()=>
    { 
        console.log("ERRORRRRR.");
        this.router.navigate(['login']);
    });
  }

  getExpedientesFiltros(filtros){

    let params: URLSearchParams = new URLSearchParams();

    if (filtros.numero){
      params.set('numero', filtros.numero);
    }
    if (filtros.anio){
      params.set('anio', filtros.anio);
    }
    if (filtros.gestor){
      params.set('id_gestor', filtros.gestor);
    }

    if (filtros.abreviatura){
      params.set('abreviatura', filtros.abreviatura);
    }

    if (filtros.tipo_expediente){
      params.set('id_tipo_expediente', filtros.tipo_expediente);
    }

    if (filtros.propietario){
      params.set('id_propietario', filtros.propietario);
    }
   
    console.log('parametros', params.toString())
    
    return this.http.get(this.url+`/expedientes?${params.toString()}`).toPromise().catch((e)=>
    { 
      console.log('error', e);
      this.router.navigate(['login']);

    });
  }

  getExpediente(id){
    console.log(id)
    return this.http.get(this.url+`/expedientes/expediente_tramite/?id=${id}`).toPromise();
  }

  getExpedienteNumero(numero, anio) {
    console.log(numero, anio)
    return this.http.get(this.url+`/expedientes/expediente_tramite/?anio=${anio}&numero=${numero}`).toPromise();
  }

  getExpedienteTramite(numero){
    return this.http.get(this.url+`/expedientes/expediente_tramite/?tramite=${numero}`).toPromise();
  }

  setExpediente(expediente) {
    console.warn(expediente);
    return this.http.post(this.url+'/expedientes/', expediente).toPromise().catch((e)=>
    { 
      console.log('error al crear expediente', e);
    
    }); 
  }

  editExpediente(expediente) {
    console.warn(expediente);

    return this.http.put(this.url+'/expedientes/', expediente).toPromise();
  }

  deleteExpediente(expediente) {
    console.warn(expediente);
    return this.http.delete(this.url+`/expedientes/${expediente}/`).toPromise();
  }



  //TIPO EXPETIENTE  ////////////////////////////////////////////////////////////////////////////////
  
  getTipoExpedientes () { 
    return this.http.get(this.url+'/tipo_expedientes/').toPromise();
  }

  //DOCUMENTO  ////////////////////////////////////////////////////////////////////////////////

  getDocumentos () {
    return this.http.get(this.url+'/documentos/').toPromise();
  }

  //TRAMITE  ////////////////////////////////////////////////////////////////////////////////

  getTramites () {
    return this.http.get(this.url+'/tramites/').toPromise();
  }

  //OBSERVACION  ////////////////////////////////////////////////////////////////////////////////

  getObservaciones () {
    return this.http.get(this.url+'/observaciones/').toPromise();
  }

  //INMUEBLE  ////////////////////////////////////////////////////////////////////////////////

  getInmuebles () {
    return this.http.get(this.url+'/inmuebles/').toPromise();
  }

  getInmueblesDisponibles () {
    return this.http.get(this.url+'/inmuebles/?disponibles=1234').toPromise();
  }

  getInmueble(id){
    return this.http.get(this.url+`/inmuebles/${id}`).toPromise();
  }


  setInmueble(inmueble) {
    console.warn(inmueble);
    return this.http.post(this.url+'/inmuebles/', inmueble).toPromise().catch((e)=>
    { 
      console.log('error', e);
    
    }); 
  }

  deleteInmueble(inmueble) {
    console.warn(inmueble);
    return this.http.delete(this.url+`/inmuebles/${inmueble}/`).toPromise();
  }




  //USUARIOS ////////////////////////////////////////////////////////////////////////////////

  getUsuarios () {
    return this.http.get(this.url+'/usuarios/').toPromise();
  }

  getRoles() {
    return this.http.get(this.url+'/roles/').toPromise();
  }

  getUsers() {
    return this.http.get(this.url+'/roles/').toPromise();
  }

  getUsuario(id){
    return this.http.get(this.url+`/usuarios/${id}`).toPromise();
  }

  getUsuarioNumero(numero) {
    console.log(numero)
    return this.http.get(this.url+`/usuarios/?dni=${numero}`).toPromise();
    
  }

  setUsuario(usuario) {
    console.warn(usuario);
    return this.http.post(this.url+'/usuarios/', usuario).toPromise().catch((e)=>
    { 
      console.log('error', e);
     

    }); 
  }

  deleteUsuario(usuario) {
    console.warn(usuario);
    return this.http.delete(this.url+`/usuarios/${usuario}/`).toPromise();
  }


  // DEPARTAMENTOS //////////////////////////////////////////////////////

  getDepartamentos() {
    return this.http.get(this.url+'/departamentos/').toPromise();
  }


  // RETIROS / DEVOLUCIONES ////////////////////////////////////////////

  setRetiro(retiro) {
    console.warn(retiro);
    return this.http.post(this.url+'/retiros/', retiro).toPromise().catch((e)=>
    { 
      console.log('error', e);

    }); 
  }

}
