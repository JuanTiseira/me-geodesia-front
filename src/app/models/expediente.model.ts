export interface Expediente {
    count:    number;
    next:     null;
    previous: null;
    results:  Result[];
}

export interface Result {
    id:             number;
    url:            string;
    tramiteurgente: boolean;
    numero:         number;
    anio:           number;
    abreviatura:    string;
    tipoexpediente: string;
    documento:      string;
    tramite:        string;
    observacion:    string;
    inmueble:       string;
    propietario:    string;
    agrimensor:     string;
    gestor:         string;
}
