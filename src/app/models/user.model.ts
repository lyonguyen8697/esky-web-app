import { Role } from '../enums/role.emum';

export interface User {
    id: string;
    email: string;
    name: string;
    avatar: string;
    role: string;
    token: string;

}
