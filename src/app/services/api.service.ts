import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

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
    return this.http.get(this.url+`/${module}/?page=${page}`).toPromise();
  }

  //EXPEDIENTES  ////////////////////////////////////////////////////////////////////////////////

  getExpedientes(){
    return this.http.get(this.url+'/expedientes/').toPromise();
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

    if (filtros.agrimensor){
      params.set('id_agrimensor', filtros.agrimensor);
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
       
    return this.http.get(this.url+`/expedientes?${params.toString()}`).toPromise();
  }

  getExpediente(id){
    return this.http.get(this.url+`/expedientes/expediente_tramite/?id=${id}`).toPromise();
  }

  getExpedienteNumero(numero, anio) {
    return this.http.get(this.url+`/expedientes/expediente_tramite/?anio=${anio}&numero=${numero}`).toPromise();
  }

  getExpedienteTramite(numero){
    return this.http.get(this.url+`/expedientes/expediente_tramite/?tramite=${numero}`).toPromise();
  }

  setExpediente(expediente) {
    return this.http.post(this.url+'/expedientes/', expediente).toPromise();
  }

  editExpediente(expediente) {
    return this.http.put(this.url+'/expedientes/', expediente).toPromise();
  }

  deleteExpediente(expediente) {
    return this.http.patch(this.url+`/expedientes/${expediente}/`, {
      "habilitado": false 
      } ).toPromise();
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

  setNuevaTransicion(tramite){
    return this.http.get(this.url+'/tramites/nueva_transicion/?tramite='+tramite).toPromise();
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

  getInmuebleWithParams(parametro, valor){
    return this.http.get(this.url+`/inmuebles/?${parametro}=${valor}`).toPromise();
  }

  setInmueble(inmueble) {
    console.warn(inmueble);
    return this.http.post(this.url+'/inmuebles/', inmueble).toPromise();
  }

  deleteInmueble(inmueble) {;
    let params = {
      "habilitado": false
    }
    return this.http.patch(this.url+`/inmuebles/${inmueble}/`, params).toPromise();
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


  getUsuariosFiltros(filtros){

    let params: URLSearchParams = new URLSearchParams();

    if (filtros.nombre){
      params.set('nombre', filtros.nombre);
    }
    if (filtros.apellido){
      params.set('apellido', filtros.apellido);
    }
    if (filtros.matricula){
      params.set('matricula', filtros.matricula);
    }
       
    return this.http.get(this.url+`/usuarios?${params.toString()}`).toPromise();
  }

  getUsuario(id){
    return this.http.get(this.url+`/usuarios/${id}`).toPromise();
  }

  getUsuarioNumero(numero) {
    return this.http.get(this.url+`/usuarios/?dni=${numero}`).toPromise();
    
  }

  setUsuario(usuario) {
    return this.http.post(this.url+'/usuarios/', usuario).toPromise();
  }

  deleteUsuario(usuario) {
    return this.http.patch(this.url+`/usuarios/${usuario}/`, {
      "habilitado": false 
      } ).toPromise();
  }


  // DEPARTAMENTOS //////////////////////////////////////////////////////

  getDepartamentos() {
    return this.http.get(this.url+'/departamentos/').toPromise();
  }

  // MUNICIPIOS

  getMunicipios() {
    return this.http.get(this.url+'/municipios/').toPromise();
  }



  // RETIROS / DEVOLUCIONES ////////////////////////////////////////////

  setRetiro(retiro) {
    return this.http.post(this.url+'/retiros/', retiro).toPromise()
  }

  setDevol(retiro) {
    return this.http.post(this.url+'/retiros/devolver/', retiro).toPromise();
  }


  getHistoriales(id){
    let params: URLSearchParams = new URLSearchParams();
    params.set('tramite', id);
    return this.http.get(this.url+`/historiales?${params.toString()}`).toPromise();
  }

}
