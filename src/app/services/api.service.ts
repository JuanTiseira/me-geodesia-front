import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
import {FunctionsService} from 'src/app/services/functions.service'
@Injectable({
  providedIn: 'root'
})


export class ApiService {

  private url: string;
  private urlLogin: string;
  private res: string;
  private listaPeticiones :Subscription[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private _functionService: FunctionsService,
    ) { 
      this.url  =  environment.endpoint;
      this.urlLogin = this.url + '/auth/';
      
  }



  ///////// control de peticiones /////////////

  cancelarPeticionesPendientes(){
    this._functionService.imprimirMensaje(this.listaPeticiones, "lista de peticiones a limpiar: ")
    this.listaPeticiones.forEach((peticion)=>{
      peticion.unsubscribe();
    })
    this.listaPeticiones = [];
    this._functionService.imprimirMensaje(this.listaPeticiones, "lista de peticiones limpias: ")
  }

  cargarPeticion(peticion: Subscription){
    this._functionService.imprimirMensaje(peticion, "Peticiones a guardar: ")
    this.listaPeticiones.push(peticion);
  }
  
  ///////// control de peticiones /////////////


  

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
    return this.http.get(this.url+'/expedientes/');
  }

  getExpedientesFiltros(filtros){
    let params: URLSearchParams = new URLSearchParams();
    for(let i in filtros){
      if(filtros[i]) params.set(i, filtros[i])
    }
    return this.http.get(this.url+`/expedientes?${params.toString()}`);
  }

  getExpediente(id){
    return this.http.get(this.url+`/expedientes/expediente_tramite/?id=${id}`);
  }

  getExpedienteNumero(numero, anio) {
    return this.http.get(this.url+`/expedientes/expediente_tramite/?anio=${anio}&numero=${numero}`);
  }

  getExpedientesSector(){
    return this.http.get(this.url+'/expedientes/sector_unificado/');
  }

  // getExpedientesSectorSalida(){
  //   return this.http.get(this.url+'/expedientes/sector_salida/');
  // }

  // getExpedientesSectorEntrada(){
  //   return this.http.get(this.url+'/expedientes/sector_entrada/');
  // }

  getExpedienteTramite(numero){
    return this.http.get(this.url+`/expedientes/expediente_tramite/?tramite=${numero}`);
  }

  setExpediente(expediente) {
    return this.http.post(this.url+'/expedientes/', expediente);
  }

  editExpediente(expediente) {
    return this.http.put(this.url+'/expedientes/', expediente);
  }

  deleteExpediente(expediente) {
    return this.http.patch(this.url+`/expedientes/${expediente}/`, {"habilitado": false});
  }



  //TIPO EXPETIENTE  ////////////////////////////////////////////////////////////////////////////////
  
  getTipoExpedientes () { 
    return this.http.get(this.url+'/tipo_expedientes/');
  }

  //DOCUMENTO  ////////////////////////////////////////////////////////////////////////////////

  getDocumentos () {
    return this.http.get(this.url+'/documentos/');
  }

  //TRAMITE  ////////////////////////////////////////////////////////////////////////////////

  getTramites () {
    return this.http.get(this.url+'/tramites/');
  }


  setNuevaTransicion(tramite){
    return this.http.get(this.url+'/tramites/nueva_transicion/?tramite='+tramite)
  }

  setNuevaTransicionAdmin(datos){
    return this.http.post(this.url+'/tramites/nueva_transicion_admin/', datos);
  }

  //OBSERVACION  ////////////////////////////////////////////////////////////////////////////////

  getObservaciones () {
    return this.http.get(this.url+'/observaciones/');
  }

  //INMUEBLE  ////////////////////////////////////////////////////////////////////////////////

  getInmuebles () {
    return this.http.get(this.url+'/inmuebles/')
    // return this.http.get(this.url+'/inmuebles/').toPromise();
  }

  // getWithoutPagination(){
  //   return this.http.get(this.url+'/inmuebles/get_without_pagination/').toPromise();
  // }

  getInmueblesDisponibles () {
    return this.http.get(this.url+'/inmuebles/?disponibles=1234');
  }

  getInmueble(id){
    return this.http.get(this.url+`/inmuebles/${id}`);
  }

  getInmuebleWithParams(parametro, valor){
    return this.http.get(this.url+`/inmuebles/?${parametro}=${valor}`);
  }

  setInmueble(inmueble) {
    console.warn(inmueble);
    return this.http.post(this.url+'/inmuebles/', inmueble);
  }

  deleteInmueble(inmueble) {;
    let params = {
      "habilitado": false
    }
    return this.http.patch(this.url+`/inmuebles/${inmueble}/`, params);
  }




  //USUARIOS ////////////////////////////////////////////////////////////////////////////////

  getUsuarios () {
    return this.http.get(this.url+'/usuarios/');
  }

  getRoles() {
    return this.http.get(this.url+'/roles/');
  }

  // getUsers() {
  //   return this.http.get(this.url+'/roles/').toPromise();
  // }


  getUsuariosFiltros(filtros){

    let params: URLSearchParams = new URLSearchParams();
    for(let i in filtros){
      if(filtros[i]) params.set(i, filtros[i])
    }   
    return this.http.get(this.url+`/usuarios?${params.toString()}`);
  }

  getUsuario(id){
    return this.http.get(this.url+`/usuarios/${id}`);
  }

  getUsuarioNumero(numero) {
    return this.http.get(this.url+`/usuarios/?dni=${numero}`);
    
  }

  setUsuario(usuario) {
    return this.http.post(this.url+'/usuarios/', usuario);
  }

  deleteUsuario(usuario) {
    return this.http.patch(this.url+`/usuarios/${usuario}/`, {"habilitado": false});
  }


  // DEPARTAMENTOS //////////////////////////////////////////////////////

  getDepartamentos() {
    return this.http.get(this.url+'/departamentos/');
  }

  // MUNICIPIOS

  getMunicipios() {
    return this.http.get(this.url+'/municipios/');
  }



  // RETIROS / DEVOLUCIONES ////////////////////////////////////////////

  setRetiro(retiro) {
    return this.http.post(this.url+'/retiros/', retiro);
  }

  setDevol(retiro) {
    return this.http.post(this.url+'/retiros/devolver/', retiro);
  }


  // HISTORIALES

  getHistorial(id){
    let params: URLSearchParams = new URLSearchParams();
    params.set('tramite', id);
    return this.http.get(this.url+`/historiales?${params.toString()}`);
  }

  getHistoriales(){
    return this.http.get(this.url+`/historiales`);
  }

  getHistorialesUltimos(){
    return this.http.get(this.url+'/historiales/ultimos_historiales');
  }

  setNuevoMovimiento(json){
    return this.http.post(this.url+'/retiros/nuevo_movimiento/', json);
  }

  //SECTORES  
  getSectores(){
    return this.http.get(this.url+'/sectores');
  }
}
