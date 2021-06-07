
import { Roles } from './roles.models';

export class Cliente {
    id: number;
    username: string;
    razon_social: string;
    nombre_legal: string;
    domicilio: string;
    web: string;
    documento: string;
    email: string;
    enabled: boolean;
    public_key: string;
    private_key: string;
    token: string;
    localidad: string;
    user_create: string;
    user_update: string;
    roles: Array<Roles>
    create_at: string;
    updated_at: string;
}
