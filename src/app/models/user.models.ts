import { Authority } from './authority.models';

export class User {

    constructor(){};

    token: string;
    authorities: Authority[]
    expired_in: string; 
    user_name: string
    
}
