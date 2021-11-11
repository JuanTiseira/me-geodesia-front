import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Router } from '@angular/router';

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
export interface Respuesta {
    count:    number;
    next:     null;
    previous: null;
    results:  Usuario[];
}

export interface Usuario {
    id:               number;
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
    public items


    constructor(
        private http: HttpClient,
        private router: Router,
        
        ) { 
        this.url  =  environment.endpoint;
        this.urlLogin = this.url + '/auth/';
        
    }
        

    getUsuarios () {
        return this.http.get(this.url+'/usuarios/').toPromise();
    }

    getDocumentos () {
        return this.http.get(this.url+'/documentos/').toPromise();
    }
    
    getPeople(term: string = null): Observable<Person[]> {

        this.getUsuarios().then((res:Respuesta) =>{          
            this.items = res.results
            this.items.map((i) => { i.fullName = i.nombre + ' ' + i.apellido + ' ' + i.dni; return i; })
            if (term) {
                this.items = this.items.filter(x => x.fullName.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
            }

          })
        
        return of(this.items).pipe( delay(1));
    }


    getDocs(term: string = null): Observable<Documento[]> {


        this.getDocumentos().then((res:Respuesta) =>{

            this.items = res.results
            
            if (term) {
                this.items = this.items.filter(x => x.descripcion.toLocaleLowerCase().indexOf(term.toLocaleLowerCase()) > -1);
            }

          })

        return of(this.items).pipe( delay(1));
    }

}
