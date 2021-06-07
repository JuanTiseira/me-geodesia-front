import { Roles } from "../roles.models";

export interface UserInterface {

    username?: string;
    nombre?:string;
    password?: string;
    enabled?: boolean;
    email?: string;
    roles?: Roles[];
    id?: number;
}
