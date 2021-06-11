export interface Expediente {
    count:    number;
    next:     null;
    previous: null;
    results:  Result[];
}

export interface Result {
    id:              number;
    url:             string;
    tramite_urgente: boolean;
    numero:          number;
    anio:            number;
    abreviatura:     string;
    tipo_expediente: Observacion;
    documento:       Documento;
    tramite:         Tramite;
    observacion:     Observacion;
    inmueble:        Inmueble;
    propietario:     Agrimensor;
    agrimensor:      Agrimensor;
    gestor:          Agrimensor;
}

export interface Agrimensor {
    id:               number;
    url:              string;
    rol:              string;
    cuit:             number;
    dni:              number;
    nombre:           string;
    apellido:         string;
    direccion:        string;
    fecha_nacimiento: Date;
    email:            string;
    matricula:        string;
    telefono:         string;
}

export interface Documento {
    id:             number;
    url:            string;
    descripcion:    string;
    tipo_documento: string;
    retiro:         string;
}

export interface Inmueble {
    id:             number;
    url:            string;
    numero_partida: number;
    datos:          string;
    observaciones:  string;
    seccion:        number;
    chacra:         number;
    manzana:        number;
    parcela:        number;
    numero_mensura: number;
    departamento:   string;
}

export interface Observacion {
    id:          number;
    url:         string;
    descripcion: string;
    nombre?:     string;
}

export interface Tramite {
    id:                  number;
    url:                 string;
    numero:              number;
    numero_presentacion: number;
}
