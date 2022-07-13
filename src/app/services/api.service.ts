import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';
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
    ) { 
      this.url  =  environment.endpoint;
      this.urlLogin = this.url + '/auth/';
      
  }



  ///////// control de peticiones /////////////

  cancelarPeticionesPendientes(){
    // this._functionService.imprimirMensajeDebug(this.listaPeticiones, "lista de peticiones a limpiar: ")
    this.listaPeticiones.forEach((peticion)=>{
      peticion.unsubscribe();
    })
    this.listaPeticiones = [];
    // this._functionService.imprimirMensajeDebug(this.listaPeticiones, "lista de peticiones limpias: ")
  }

  cargarPeticion(peticion: Subscription){
    // this._functionService.imprimirMensajeDebug(peticion, "Peticiones a guardar: ")
    this.listaPeticiones.push(peticion);
  }
  
  ///////// control de peticiones /////////////


  

  getLogin(username: string, password: string, currentResponse){
    var data = new FormData();
    data.append('username', username);
    data.append('password', password);
    data.append('currentResponse', currentResponse);
    return this.http.post(this.urlLogin, data).toPromise();
  }

  

  // errorPeticion(){
  //   this.router.navigate(['login']);
  // }

  changePage(page, module){
    return this.http.get(this.url+`/${module}/?page=${page}`).toPromise();
  }

  //EXPEDIENTES  ////////////////////////////////////////////////////////////////////////////////

  getExpedientes(){
    return this.http.get(this.url+'/expedientes/');
  }

  esUrgente(id){
    return this.http.get(this.url+'/expedientes/es_urgente/?id='+id);
  }

  // getExpedientesFiltros(filtros){
  //   let params: URLSearchParams = new URLSearchParams();
  //   for(let i in filtros){
  //     if(filtros[i]) params.set(i, filtros[i])
  //   }
  //   return this.http.get(this.url+`/expedientes/?${params.toString()}`);
  // }

  getExpedientesTramitesFiltros(filtros, page = '1'){
    let params: URLSearchParams = new URLSearchParams();
    for(let i in filtros){
      if(filtros[i]) params.set(i, filtros[i])
    }
    params.set("page", page)
    return this.http.get(this.url+`/expedientes/expedientes_tramites/?${params.toString()}`);
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


  getExpedienteTramite(numero){
    return this.http.get(this.url+`/expedientes/expediente_tramite/?tramite=${numero}`);
  }

  setExpediente(expediente) {
    return this.http.post(this.url+'/expedientes/', expediente);
  }

  editExpediente(id, expediente) {
    return this.http.patch(this.url+`/expedientes/${id}/`, expediente);
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

  //ABREVIATURAS /////////////////////////////////////////////////////////////////////////

  getAbreviaturas () { 
    return this.http.get(this.url+'/mensuras/');
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
  
  addObservacion(tramite, observacion){
    return this.http.post(this.url+'/tramites/add_observacion/', {tramite: tramite, observacion: observacion});
  }

  //INMUEBLE  ////////////////////////////////////////////////////////////////////////////////

  getInmuebles(parametros = null, page = "1") {
    if(parametros == null) return this.http.get(this.url+'/inmuebles/')
    else {
      let params: URLSearchParams = new URLSearchParams();
      for(let i in parametros){
        if(parametros[i]) params.set(i, parametros[i])
      } 
      params.set("page", page)
      return this.http.get(this.url+`/inmuebles/?${params.toString()}`)
    }
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

  getAsignaciones() {
    return this.http.get(this.url+'/asignaciones/');
  }

  // getUsers() {
  //   return this.http.get(this.url+'/roles/').toPromise();
  // }


  getUsuariosFiltros(filtros, page = '1'){

    let params: URLSearchParams = new URLSearchParams();
    for(let i in filtros){
      if(filtros[i]) params.set(i, filtros[i])
    } 
    params.set("page",page)
    return this.http.get(this.url+`/usuarios/?${params.toString()}`);
  }

  getUsuario(id){
    return this.http.get(this.url+`/usuarios/${id}/`);
  }

  getUsuarioNumero(numero) {
    return this.http.get(this.url+`/usuarios/?dni=${numero}`);
  }

  getUsuarioCuit(cuit) {
    return this.http.get(this.url+`/usuarios/?cuit=${cuit}`);
  }


  editUsuario(id, values){
    return this.http.patch(this.url+`/usuarios/${id}/`, values);
  }

  setUsuario(usuario) {
    return this.http.post(this.url+'/usuarios/', usuario);
  }

  deleteUsuario(usuario) {
    return this.http.patch(this.url+`/usuarios/${usuario}/`, {"habilitado": false});
  }

  getCantidadUsuarios(){
    return this.http.get(this.url+'/usuarios/cantidad_usuarios/')
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

  setNuevoMovimiento(json){
    return this.http.post(this.url+'/retiros/nuevo_movimiento/', json);
  }


  // HISTORIALES

  getHistorial(numero = null, anio = null, num_tramite = null){
    let params: URLSearchParams = new URLSearchParams();
    params.set('numero', numero);
    params.set('anio', anio);
    params.set('num_tramite', num_tramite);
    return this.http.get(this.url+`/historiales/?${params.toString()}`);
  }

  getHistoriales(){
    return this.http.get(this.url+`/historiales/`);
  }

  getHistorialesUltimos(){
    return this.http.get(this.url+'/historiales/ultimos_historiales/');
  }

  getHistorialesUltimosFiltro(page:number){
    return this.http.get(this.url+'/historiales/ultimos_historiales_filtros/?page='+page);
  }

  getExpedientesPorSector(){
    return this.http.get(this.url+'/historiales/expedientes_por_sector/')
  }

  //SECTORES  
  getSectores(){
    return this.http.get(this.url+'/sectores/');
  }
}
