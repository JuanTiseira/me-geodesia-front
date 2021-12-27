import { Authority } from "./authority.models";
import { User } from "./user.models";

export class LoginUser{
    token: string;
    authorities: Authority[]
    expired_in: string; 
    username: string;
    grupos: Array<string>
}