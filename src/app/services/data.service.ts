import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

export interface Person {
    id: string;
    isActive: boolean;
    age: number;
    name: string;
    gender: string;
    company: string;
    email: string;
    phone: string;
    disabled?: boolean;
}

export interface Departamento{
    id: string;
    codigo: string;
    created_at: string;
    descripcion: string;
    habilitado: boolean;
    url: string;
}

export interface Municipio{
    id: string;
    codigo: string;
    codigo_posta: string;
    created_at: string;
    departamento: Departamento;
    descripcion: string;
    habilitado: boolean;
    url: string;
}
export interface Inmueble {
    id: string;
    chacra: string;
    created_at: string;
    datos: string;
    manzana: string;
    municipio: Municipio;
    numero_mensura: string;
    observaciones: string;
    parcela: string;
    seccion: string;
    unidad_funcional: string;
    url: string;
    nomenclatura: string;
    habilitado: boolean;
}

export interface Tramite {
    id: string,
    numero: string,
    numero_presentacion: number,
    codigo_verificacion: number,
    tramite_urgente: boolean,
    observacion: Observacion,
    tramite_previo: Tramite,
    expediente: Expediente,
    habilitado: boolean,
    created_at: string,
    url: string
}

export interface Observacion {
    id: string,
    descripcion: string,
    habilitado: boolean
}

export interface Expediente {
    id: string,
    numero: string,
    anio: number,
    mensura: Mensura,
    documentos: Documento[],
    tipo_expediente: TipoExpediente,
    inmueble: Inmueble,
    propietario: Usuario,
    agrimensor: Usuario,
    gestor: Usuario,
    habilitado: boolean
}

export interface TipoExpediente {
    id: string,
    nombre: string,
    descripcion: string,
    mensuras: Mensura[],
    habilitado: boolean
}

export interface Mensura {
    id: string,
    nombre: string,
    abreviatura: string,
    habilitado: boolean
}
export interface Respuesta {
    count:    number;
    next:     null;
    previous: null;
    results:  Usuario[];
}

export interface RespuestaInmueble {
    count:    number;
    next:     null;
    previous: null;
    results:  Inmueble[];
}

export interface Usuario {
    id:               number;
    fullName:         string;
    url:              string;
    rol:              Rol;
    cuit:             number;
    dni:              number;
    nombre:           string;
    apellido:         string;
    direccion:        string;
    fecha_nacimiento: Date;
    email:            string;
    matricula:        number;
    telefono:         string;
    gestores:         string[];
    habilitado:       boolean;
}

export interface Rol {
    id:          number;
    url:         string;
    nombre:      string;
    descripcion: string;
    habilitado:  boolean;
}

export class Documento {
    id:             number;
    url:            string;
    descripcion:    string;
    tipo_documento: string;
    retiro:         string;
}


@Injectable({
    providedIn: 'root'
})
export class DataService {

    private url: string;
    private urlLogin: string;
    private res: string;
    public items;
    public tramitesPrevios;


    constructor(
        private http: HttpClient,
        
        ) { 
        this.url  =  environment.endpoint;
        this.urlLogin = this.url + '/auth/';
        
    }
        

    getUsuarios (term, rolDescripcion) {
        return this.http.get(this.url+'/usuarios/?apellido='+term+'&rol_descripcion='+rolDescripcion).toPromise();
    }

    getDocumentos () {
        return this.http.get(this.url+'/documentos/').toPromise();
    }

    getInmueble(params:URLSearchParams) {
        return this.http.get(this.url+`/inmuebles/?${params.toString()}`).toPromise();
    }

    getTramitePrevio(params:URLSearchParams){
        return this.http.get(this.url+`/expedientes/expedientes_tramites/?${params.toString()}`).toPromise();
    }
    
    getPeople(term: string = null, rolDescripcion): Observable<Person[]> {
        this.getUsuarios(term, rolDescripcion).then((res:Respuesta) =>{          
            this.items = res.results.map((i) => { i.fullName = i.nombre + ' ' + i.apellido + ' ' + (i.cuit? i.cuit: ""); return i; })
            if (term) {
                this.items = this.items.filter(x => x.apellido.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
            }
          }) 
        return of(this.items);
    }


    getDocs(term: string = null): Observable<Documento[]> {
        this.getDocumentos().then((res:Respuesta) =>{
            this.items = res.results
            if (term) {
                this.items = this.items.filter(x => x.descripcion.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
            }
          })
        return of(this.items).pipe(delay(1));
    }

    getInmuebles(term: string = null): Observable<Inmueble[]> {

        let terms = term.split("-")
        let params: URLSearchParams = new URLSearchParams();

        if(terms.length >= 1 && terms[0] != "") params.set("departamento", terms[0])
        if(terms.length >= 2 && terms[1] != "") params.set("municipio", terms[1])
        if(terms.length >= 3 && terms[2] != "") params.set("seccion", terms[2])
        if(terms.length >= 4 && terms[3] != "") params.set("chacra", terms[3])
        if(terms.length >= 5 && terms[4] != "") params.set("manzana", terms[4])
        if(terms.length >= 6 && terms[5] != "") params.set("parcela", terms[5])
        if(terms.length >= 7 && terms[6] != "") params.set("unidad_funcional", terms[6])

        params.set("disponibles", "true")
        this.getInmueble(params).then((res:RespuestaInmueble) =>{          
            this.items = res.results
            this.items.map((i) => { i.nomenclatura = i.municipio.departamento.codigo + '-' + i.municipio.codigo + '-' + i.seccion + '-' + i.chacra + '-' + i.manzana + '-' + i.parcela + '-' + i.unidad_funcional; return i; })
            // console.warn(this.items[0].nomenclatura.includes(term))
            if(term){
                this.items = this.items.filter(x=>x.nomenclatura.includes(term))
            }
          })
        
        return of(this.items).pipe(delay(1));
    }

    getTramitesPrevios(term: string = null): Observable<Tramite[]> {
        let params: URLSearchParams = new URLSearchParams();
        if(term.length >=1 && term.length <= 7) params.set("numero", term)

        this.getTramitePrevio(params).then((res:Respuesta) =>{
            this.tramitesPrevios = res.results
            this.tramitesPrevios.map((i) => { i.numtramite = `${i.numero}${i.codigo_verificacion}`; return i; })
            if (term) {
                // console.log("term: ", term, "      items: ", this.items)
                this.tramitesPrevios = this.tramitesPrevios.filter(x => x.numtramite.includes(term));
            }
          })
        return of(this.tramitesPrevios).pipe(delay(1));
    }

}
