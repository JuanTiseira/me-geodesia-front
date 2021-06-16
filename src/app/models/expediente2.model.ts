export class Expediente {
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

export class Agrimensor {
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

export class Documento {
    id:             number;
    url:            string;
    descripcion:    string;
    tipo_documento: string;
    retiro:         string;
}

export class Inmueble {
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

export class Observacion {
    id:          number;
    url:         string;
    descripcion: string;
    nombre?:     string;
}

export class Tramite {
    id:                  number;
    url:                 string;
    numero:              number;
    numero_presentacion: number;
}
