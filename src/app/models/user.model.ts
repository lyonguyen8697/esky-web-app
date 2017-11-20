import { Role } from '../enums/role.emum';

export interface User {
    id: string;
    email: string;
    username: string;
    name: string;
    avatar: string;
    role: string;
    token: string;

}
