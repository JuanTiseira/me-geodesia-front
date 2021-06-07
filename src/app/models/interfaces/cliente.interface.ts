import { Roles } from "../roles.models";

export interface ClienteInterface {

    id?: number;
    username?:string;
    razon_social?: string;
    nombre_legal?: boolean;
    domicilio?: string;
    web?: string;
    documento?: number;
    email?: string;
    password?: string;
    enabled?: boolean;
    localidad?: string;
}
